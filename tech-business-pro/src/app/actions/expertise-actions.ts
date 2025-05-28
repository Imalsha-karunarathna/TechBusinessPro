'use server';

import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { auth } from '@/lib/server-auth';
import { revalidatePath } from 'next/cache';
import { providerExpertise } from '@/lib/db/tables/providerExpertise';
import { solutionProviders } from '@/lib/db/tables/solutionProviders';
import { partnerApplications } from '@/lib/db/tables/partnerApplications';
import { eq, and } from 'drizzle-orm';

// Get all expertise categories from partner applications
export async function getAllExpertiseCategories() {
  try {
    // Use raw SQL to unnest the expertise array and get unique values
    const result = await db.execute(
      sql`
      SELECT DISTINCT unnest(expertise) as expertise
      FROM partner_applications
      ORDER BY expertise
    `,
    );

    // Extract the expertise values from the result
    const rows = result.rows as { expertise: string }[];
    const categories = rows.map((row) => row.expertise);
    return { success: true, data: categories };
  } catch (error) {
    console.error('Error fetching expertise categories:', error);
    return { success: false, error: 'Failed to fetch expertise categories' };
  }
}

// Get expertise for a specific provider
export async function getProviderExpertise(providerId: number) {
  try {
    const expertise = await db
      .select()
      .from(providerExpertise)
      .where(eq(providerExpertise.provider_id, providerId))
      .orderBy(providerExpertise.created_at);

    return {
      success: true,
      data: expertise,
    };
  } catch (error) {
    console.error('Error fetching provider expertise:', error);
    return {
      success: false,
      error: 'Failed to fetch expertise',
    };
  }
}

// Get expertise from partner application for a provider
export async function getApplicationExpertise(providerId: number) {
  try {
    // Get the provider with their application ID
    const provider = await db.query.solutionProviders.findFirst({
      where: eq(solutionProviders.id, providerId),
    });

    if (!provider || !provider.application_id) {
      return { success: true, data: [] };
    }

    // Get the expertise from the partner application
    const application = await db.query.partnerApplications.findFirst({
      where: eq(partnerApplications.id, provider.application_id),
      columns: {
        expertise: true,
      },
    });

    if (!application) {
      return { success: true, data: [] };
    }

    return { success: true, data: application.expertise || [] };
  } catch (error) {
    console.error('Error fetching application expertise:', error);
    return { success: false, error: 'Failed to fetch application expertise' };
  }
}

// Add a new expertise for a provider
export async function addProviderExpertise(
  providerId: number,
  expertiseName: string,
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check if the provider exists and belongs to the current user
    const provider = await db.query.solutionProviders.findFirst({
      where: eq(solutionProviders.id, providerId),
    });

    console.log('providerId:', providerId);
    console.log('session.user.id:', session.user.id);
    console.log('Provider found:', provider ? 'Yes' : 'No');

    if (!provider) {
      return { success: false, error: 'Provider not found' };
    }

    // Verify the provider belongs to the current user
    // if (provider.user_id !== session.user.id) {
    //   return {
    //     success: false,
    //     error: 'Unauthorized - this provider does not belong to you',
    //   };
    // }

    // Check if this expertise already exists for this provider
    const existingExpertise = await db.query.providerExpertise.findFirst({
      where: and(
        eq(providerExpertise.provider_id, providerId),
        eq(providerExpertise.name, expertiseName),
      ),
    });

    if (existingExpertise) {
      return {
        success: false,
        error: 'This expertise already exists for your profile',
      };
    }

    // Check if this expertise already exists in the partner application
    if (provider.application_id) {
      const application = await db.query.partnerApplications.findFirst({
        where: eq(partnerApplications.id, provider.application_id),
        columns: {
          expertise: true,
        },
      });

      if (
        application &&
        application.expertise &&
        application.expertise.includes(expertiseName)
      ) {
        return {
          success: false,
          error: 'This expertise already exists in your application',
        };
      }
    }

    // Insert the new expertise
    const result = await db
      .insert(providerExpertise)
      .values({
        provider_id: providerId,
        name: expertiseName,
        status: 'pending', // All new expertise start as pending
        created_at: new Date(),
      })
      .returning();

    // Revalidate relevant paths
    revalidatePath('/providers');
    revalidatePath('/admin/expertise-requests');

    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error adding provider expertise:', error);
    return { success: false, error: 'Failed to add expertise' };
  }
}

// Delete an expertise
export async function deleteApplicationExpertise(
  providerId: number,
  expertiseName: string,
  applicationId: number,
) {
  try {
    // Get the solution provider to find their email
    const provider = await db
      .select()
      .from(solutionProviders)
      .where(eq(solutionProviders.id, providerId))
      .limit(1);

    if (!provider.length) {
      return {
        success: false,
        error: 'Provider not found',
      };
    }

    // Get the specific application
    const application = await db
      .select()
      .from(partnerApplications)
      .where(eq(partnerApplications.id, applicationId))
      .limit(1);

    if (!application.length) {
      return {
        success: false,
        error: 'Application not found',
      };
    }

    // Remove the expertise from the application's expertise array
    const currentExpertise = application[0].expertise || [];
    const updatedExpertise = currentExpertise.filter(
      (skill) => skill !== expertiseName,
    );

    // Update the application
    await db
      .update(partnerApplications)
      .set({
        expertise: updatedExpertise,
      })
      .where(eq(partnerApplications.id, applicationId));

    revalidatePath('/solutionProvider');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting application expertise:', error);
    return {
      success: false,
      error: 'Failed to delete expertise from application',
    };
  }
}
// Get all pending expertise requests (for admin)
export async function getPendingExpertiseRequests() {
  try {
    // Require admin authentication
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get all pending expertise with provider details
    const pendingRequests = await db.query.providerExpertise.findMany({
      where: eq(providerExpertise.status, 'pending'),
      with: {
        provider: true,
      },
      // orderBy: [
      //   { created_at: 'desc' }, // Newest first
      // ],
    });

    return { success: true, data: pendingRequests };
  } catch (error) {
    console.error('Error fetching pending expertise requests:', error);
    return {
      success: false,
      error: 'Failed to fetch pending expertise requests',
    };
  }
}

// Update expertise status (approve or reject)
export async function updateExpertiseStatus(
  expertiseId: number,
  status: 'approved' | 'rejected',
  reviewNotes?: string,
) {
  try {
    // Require admin authentication
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return { success: false, error: 'Unauthorized' };
    }

    // Update the expertise status
    const result = await db
      .update(providerExpertise)
      .set({
        status,
        reviewer_id: session.user.id,
        review_notes: reviewNotes || null,
        reviewed_at: new Date(),
      })
      .where(eq(providerExpertise.id, expertiseId))
      .returning();

    if (result.length === 0) {
      return { success: false, error: 'Expertise not found' };
    }

    // If approved, also add to the provider's expertise array in partner_applications
    if (status === 'approved') {
      const expertise = result[0];

      // Get the provider
      const provider = await db.query.solutionProviders.findFirst({
        where: eq(solutionProviders.id, expertise.provider_id),
      });

      if (provider && provider.application_id) {
        // Add the expertise to the partner application's expertise array
        await db.execute(
          sql`
          UPDATE partner_applications
          SET expertise = array_append(expertise, ${expertise.name})
          WHERE id = ${provider.application_id}
          AND NOT ${expertise.name} = ANY(expertise)
          `,
        );
      }
    }

    // Revalidate relevant paths
    revalidatePath('/providers');
    revalidatePath('/admin/expertise-requests');

    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error updating expertise status:', error);
    return { success: false, error: 'Failed to update expertise status' };
  }
}

export async function getAllApprovedExpertise(providerId: number) {
  try {
    // Get the solution provider to find their email
    const provider = await db
      .select()
      .from(solutionProviders)
      .where(eq(solutionProviders.id, providerId))
      .limit(1);

    if (!provider.length) {
      return {
        success: false,
        error: 'Provider not found',
      };
    }

    // Get approved partner applications for this provider's email
    const approvedApplications = await db
      .select()
      .from(partnerApplications)
      .where(
        and(
          eq(partnerApplications.email, provider[0].email),
          eq(partnerApplications.application_status, 'approved'),
        ),
      );

    // Get approved additional expertise
    const approvedAdditionalExpertise = await db
      .select()
      .from(providerExpertise)
      .where(
        and(
          eq(providerExpertise.provider_id, providerId),
          eq(providerExpertise.status, 'approved'),
        ),
      );

    // Create a Set to track which expertise names are covered by additional expertise
    const additionalExpertiseNames = new Set(
      approvedAdditionalExpertise.map((item) => item.name.toLowerCase().trim()),
    );

    // Extract expertise from approved applications (only if not covered by additional expertise)
    const applicationExpertise: Array<{
      name: string;
      source: 'application';
      status: 'approved';
      created_at: Date;
      application_id: number;
      deletable: boolean;
    }> = [];

    approvedApplications.forEach((application) => {
      if (application.expertise && Array.isArray(application.expertise)) {
        application.expertise.forEach((skill) => {
          const skillName = skill.toLowerCase().trim();
          // Only add if this expertise is NOT covered by additional expertise
          if (!additionalExpertiseNames.has(skillName)) {
            applicationExpertise.push({
              name: skill,
              source: 'application',
              status: 'approved',
              created_at: application.created_at,
              application_id: application.id,
              deletable: true,
            });
          }
        });
      }
    });

    // Format additional expertise (these take priority)
    const additionalExpertise = approvedAdditionalExpertise.map((item) => ({
      id: item.id,
      name: item.name,
      source: 'additional' as const,
      status: item.status,
      created_at: item.created_at,
      reviewed_at: item.reviewed_at,
      deletable: true,
    }));

    // Combine expertise with additional expertise taking priority
    const allExpertise = [...additionalExpertise, ...applicationExpertise];

    return {
      success: true,
      data: allExpertise,
    };
  } catch (error) {
    console.error('Error fetching all approved expertise:', error);
    return {
      success: false,
      error: 'Failed to fetch approved expertise',
    };
  }
}

export async function getPendingAndRejectedExpertise(providerId: number) {
  try {
    const expertise = await db
      .select()
      .from(providerExpertise)
      .where(
        and(
          eq(providerExpertise.provider_id, providerId),
          // Get pending and rejected expertise
          eq(providerExpertise.status, 'pending'),
        ),
      )
      .orderBy(providerExpertise.created_at);

    const rejectedExpertise = await db
      .select()
      .from(providerExpertise)
      .where(
        and(
          eq(providerExpertise.provider_id, providerId),
          eq(providerExpertise.status, 'rejected'),
        ),
      )
      .orderBy(providerExpertise.created_at);

    return {
      success: true,
      data: [...expertise, ...rejectedExpertise],
    };
  } catch (error) {
    console.error('Error fetching pending/rejected expertise:', error);
    return {
      success: false,
      error: 'Failed to fetch expertise',
    };
  }
}

export async function deleteProviderExpertise(expertiseId: number) {
  try {
    console.log(`Deleting provider expertise with ID: ${expertiseId}`);

    // First, get the expertise details before deleting
    const expertise = await db
      .select()
      .from(providerExpertise)
      .where(eq(providerExpertise.id, expertiseId))
      .limit(1);

    if (!expertise.length) {
      console.error(`Expertise with ID ${expertiseId} not found`);
      return {
        success: false,
        error: 'Expertise not found',
      };
    }

    const expertiseItem = expertise[0];
    console.log(`Found expertise to delete:`, expertiseItem);

    // Get the provider details to find their email and applications
    const provider = await db
      .select()
      .from(solutionProviders)
      .where(eq(solutionProviders.id, expertiseItem.provider_id))
      .limit(1);

    if (!provider.length) {
      console.error(`Provider with ID ${expertiseItem.provider_id} not found`);
      return {
        success: false,
        error: 'Provider not found',
      };
    }

    const providerData = provider[0];
    console.log(`Found provider:`, providerData);

    // Delete the expertise from provider_expertise table
    const deleteResult = await db
      .delete(providerExpertise)
      .where(eq(providerExpertise.id, expertiseId))
      .returning();

    console.log(`Deleted from provider_expertise:`, deleteResult);

    // Also remove this expertise from ALL partner applications for this provider's email
    const applications = await db
      .select()
      .from(partnerApplications)
      .where(eq(partnerApplications.email, providerData.email));

    console.log(
      `Found ${applications.length} applications for email ${providerData.email}`,
    );

    for (const application of applications) {
      if (application.expertise && Array.isArray(application.expertise)) {
        const currentExpertise = application.expertise;
        const expertiseExists = currentExpertise.some(
          (skill) =>
            skill.toLowerCase().trim() ===
            expertiseItem.name.toLowerCase().trim(),
        );

        if (expertiseExists) {
          console.log(
            `Removing "${expertiseItem.name}" from application ${application.id}`,
          );

          const updatedExpertise = currentExpertise.filter(
            (skill) =>
              skill.toLowerCase().trim() !==
              expertiseItem.name.toLowerCase().trim(),
          );

          await db
            .update(partnerApplications)
            .set({
              expertise: updatedExpertise,
            })
            .where(eq(partnerApplications.id, application.id));

          console.log(
            `Updated application ${application.id} expertise from:`,
            currentExpertise,
            `to:`,
            updatedExpertise,
          );
        }
      }
    }

    revalidatePath('/solutionProvider');

    return {
      success: true,
      data: deleteResult[0],
      message: `Expertise "${expertiseItem.name}" has been completely removed from all sources`,
    };
  } catch (error) {
    console.error('Error deleting provider expertise:', error);
    return {
      success: false,
      error: 'Failed to delete expertise',
    };
  }
}
