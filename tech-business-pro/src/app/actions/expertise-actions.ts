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
    // First, check if the provider exists
    const provider = await db.query.solutionProviders.findFirst({
      where: eq(solutionProviders.id, providerId),
    });

    if (!provider) {
      return { success: false, error: 'Provider not found' };
    }

    // Get all expertise entries for this provider
    const expertise = await db.query.providerExpertise.findMany({
      where: eq(providerExpertise.provider_id, providerId),
      // orderBy: [
      //   { status: 'asc' }, // Pending first, then approved
      //   { created_at: 'desc' }, // Newest first
      // ],
    });

    return { success: true, data: expertise };
  } catch (error) {
    console.error('Error fetching provider expertise:', error);
    return { success: false, error: 'Failed to fetch provider expertise' };
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
export async function deleteProviderExpertise(expertiseId: number) {
  try {
    console.log(`Attempting to delete expertise with ID: ${expertiseId}`);

    const session = await auth();
    if (!session?.user) {
      console.error('No authenticated user found');
      return { success: false, error: 'Unauthorized' };
    }

    console.log(`User ID from session: ${session.user.id}`);

    // Get the expertise to check if it exists
    const expertise = await db.query.providerExpertise.findFirst({
      where: eq(providerExpertise.id, expertiseId),
    });

    if (!expertise) {
      console.error(`Expertise with ID ${expertiseId} not found`);
      return { success: false, error: 'Expertise not found' };
    }

    console.log(
      `Found expertise: ${expertise.name} for provider ID: ${expertise.provider_id}`,
    );

    // Get the provider to check if it belongs to the current user
    const provider = await db.query.solutionProviders.findFirst({
      where: eq(solutionProviders.id, expertise.provider_id),
    });

    if (!provider) {
      console.error(`Provider with ID ${expertise.provider_id} not found`);
      return { success: false, error: 'Provider not found' };
    }

    console.log(
      `Provider user_id: ${provider.user_id}, Session user.id: ${session.user.id}`,
    );

    // Check if the provider belongs to the current user or if user is admin
    if (provider.user_id !== session.user.id && !session.user.isAdmin) {
      console.error('User is not authorized to delete this expertise');
      return {
        success: false,
        error: 'Unauthorized - you cannot delete expertise for this provider',
      };
    }

    // Delete the expertise - using prepared statement for safety
    console.log(`Deleting expertise ID: ${expertiseId}`);
    const result = await db
      .delete(providerExpertise)
      .where(eq(providerExpertise.id, expertiseId))
      .returning();

    console.log(`Delete operation result:`, result);

    if (!result || result.length === 0) {
      console.error('Delete operation did not return any results');
      return { success: false, error: 'Failed to delete expertise' };
    }

    // Revalidate relevant paths
    revalidatePath('/providers');
    revalidatePath('/admin/expertise-requests');
    revalidatePath('/solution-provider/expertise');

    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error deleting provider expertise:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to delete expertise',
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
