'use server';

import { db } from '@/db';
import { solutionProviders, partnerApplications } from '@/lib/db/schema';
import { eq, sql, inArray, arrayContains } from 'drizzle-orm';
import type { SolutionProvider } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

export async function getOrCreateProviderProfileByEmail(email: string) {
  try {
    console.log(`Getting provider profile for email: ${email}`);

    // Find user by email first
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const userId = user.id;

    // Check if provider profile already exists for this user ID
    const provider = await db.query.solutionProviders.findFirst({
      where: (providers, { eq }) => eq(providers.user_id, userId),
    });

    if (provider) {
      console.log(`Found existing provider: ${provider.id}`);

      let applicationExpertise: string[] = [];

      if (provider.application_id) {
        console.log(`Provider has application ID: ${provider.application_id}`);

        // Get the partner application to access expertise
        const application = await db.query.partnerApplications.findFirst({
          where: (apps, { eq }) => eq(apps.id, provider.application_id!),
        });

        if (application && application.expertise) {
          applicationExpertise = application.expertise;
          console.log(`Found application expertise:`, applicationExpertise);
        } else {
          console.log(`No expertise found in application`);
        }
      } else {
        console.log(`Provider has no application ID`);
      }

      return {
        success: true,
        data: {
          ...provider,
          applicationExpertise,
        },
      };
    }

    // No provider profile found, check for an approved application with this email
    console.log(`Looking for approved application for email: ${email}`);

    const application = await db.query.partnerApplications.findFirst({
      where: (apps, { eq, and }) =>
        and(eq(apps.email, email), eq(apps.application_status, 'approved')),
    });

    if (!application) {
      console.log(
        `No approved application found, creating empty provider profile`,
      );

      // Create empty provider profile
      const newProvider = await db
        .insert(solutionProviders)
        .values({
          name: user.name || 'New Provider',
          description: '',
          email,
          website: '',
          phone: '',
          regions_served: ['global'],
          verification_status: 'pending',
          created_at: new Date(),
          user_id: userId,
        })
        .returning();

      return {
        success: true,
        data: {
          ...newProvider[0],
          applicationExpertise: [],
        },
        isNew: true,
      };
    }

    console.log(
      `Found approved application: ${application.id} with expertise:`,
      application.expertise,
    );

    // Create provider from application
    const newProvider = await db
      .insert(solutionProviders)
      .values({
        name: application.organization_name,
        description: application.description || '',
        email: application.email,
        website: application.website || '',
        phone: application.phone || '',
        regions_served: ['global'],
        user_id: userId,
        application_id: application.id,
        verification_status: 'approved',
        approved_date: new Date(),
        created_at: new Date(),
      })
      .returning();

    // Revalidate paths
    revalidatePath('/providers');
    revalidatePath('/solutionProvider');

    return {
      success: true,
      data: {
        ...newProvider[0],
        applicationExpertise: application.expertise || [],
      },
      isFromApplication: true,
    };
  } catch (error) {
    console.error('Error getting or creating provider profile:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get or create provider profile',
    };
  }
}

/**
 * Sets up a provider account based on an approved partner application
 */
export async function getOrCreateProviderProfile(userId: number) {
  try {
    console.log(`Getting provider profile for user ID: ${userId}`);

    // First, check if provider profile already exists
    const provider = await db.query.solutionProviders.findFirst({
      where: (providers, { eq }) => eq(providers.user_id, userId),
    });

    // If provider exists, get application expertise
    if (provider) {
      console.log(`Found existing provider: ${provider.id}`);

      let applicationExpertise: string[] = [];

      if (provider.application_id) {
        console.log(`Provider has application ID: ${provider.application_id}`);

        // Get the partner application to access expertise
        const application = await db.query.partnerApplications.findFirst({
          where: (apps, { eq }) => eq(apps.id, provider.application_id ?? 0),
        });
        if (application && application.expertise) {
          applicationExpertise = application.expertise;
          console.log(`Found application expertise:`, applicationExpertise);
        } else {
          console.log(`No expertise found in application`);
        }
      } else {
        console.log(`Provider has no application ID`);
      }

      return {
        success: true,
        data: {
          ...provider,
          applicationExpertise,
        },
      };
    }

    // If not, check if there's an approved application for this user's email
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    console.log(`Looking for approved application for email: ${user.email}`);

    // Find application by email
    const application = await db.query.partnerApplications.findFirst({
      where: (apps, { eq, and }) =>
        and(
          eq(apps.email, user.email),
          eq(apps.application_status, 'approved'),
        ),
    });

    if (!application) {
      console.log(
        `No approved application found, creating empty provider profile`,
      );

      // No approved application found, create an empty provider profile
      const newProvider = await db
        .insert(solutionProviders)
        .values({
          name: user.name || 'New Provider',
          description: '',
          email: user.email,
          website: '',
          phone: '',
          regions_served: ['global'],
          verification_status: 'pending',
          created_at: new Date(),
          user_id: userId,
        })
        .returning();

      return {
        success: true,
        data: {
          ...newProvider[0],
          applicationExpertise: [],
        },
        isNew: true,
      };
    }

    console.log(
      `Found approved application: ${application.id} with expertise:`,
      application.expertise,
    );

    // Create provider from application
    const newProvider = await db
      .insert(solutionProviders)
      .values({
        name: application.organization_name,
        description: application.description || '',
        email: application.email,
        website: application.website || '',
        phone: application.phone || '',
        regions_served: ['global'],
        user_id: userId,
        application_id: application.id,
        verification_status: 'approved',
        approved_date: new Date(),
        created_at: new Date(),
      })
      .returning();

    // Revalidate relevant paths
    revalidatePath('/providers');
    revalidatePath('/solutionProvider');

    return {
      success: true,
      data: {
        ...newProvider[0],
        applicationExpertise: application.expertise || [],
      },
      isFromApplication: true,
    };
  } catch (error) {
    console.error('Error getting or creating provider profile:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get or create provider profile',
    };
  }
}

export async function setupProviderFromApplication(
  userId: number,
  applicationId: number,
) {
  try {
    // Get the application data
    const application = await db.query.partnerApplications.findFirst({
      where: eq(partnerApplications.id, applicationId),
    });

    if (!application) {
      return { success: false, error: 'Application not found' };
    }

    if (application.application_status !== 'approved') {
      return { success: false, error: 'Application is not approved' };
    }

    // Create or update the provider profile
    const result = await db
      .insert(solutionProviders)
      .values({
        name: application.organization_name,
        description: application.description || '',
        email: application.email,
        website: application.website || '',
        phone: application.phone || '',
        regions_served: ['global'],
        user_id: userId,
        application_id: applicationId,
        verification_status: 'approved',
        approved_date: new Date(),
        created_at: new Date(),
      })
      .onConflictDoUpdate({
        target: solutionProviders.user_id,
        set: {
          name: application.organization_name,
          description: application.description || '',
          email: application.email,
          website: application.website || '',
          phone: application.phone || '',
          application_id: applicationId,
        },
      })
      .returning();

    // Revalidate relevant paths
    revalidatePath('/providers');
    revalidatePath('/solutionProvider');

    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error setting up provider from application:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to set up provider',
    };
  }
}

/*eslint-disable @typescript-eslint/no-explicit-any */
export async function createOrUpdateProvider(data: any) {
  const userId = Number(data.user_id); // Ensure correct type
  console.log('Incoming user ID for update:', userId);

  // Check for existing provider by user_id, not id
  const existing = await db.query.solutionProviders.findFirst({
    where: eq(solutionProviders.user_id, userId),
  });

  console.log('Existing provider in DB:', existing);

  if (existing) {
    const result = await db
      .update(solutionProviders)
      .set({
        name: data.name,
        description: data.description || '',
        email: data.email,
        website: data.website || '',
        phone: data.phone || '',
        logo_url: data.logo_url || '',
        regions_served: data.regions_served,
      })
      .where(eq(solutionProviders.user_id, userId))
      .returning();

    console.log('Update result:', result);
    return { success: true, data: result[0] };
  } else {
    console.log('No matching provider found. Creating new one.');

    const result = await db
      .insert(solutionProviders)
      .values({
        name: data.name,
        description: data.description || '',
        email: data.email,
        website: data.website || '',
        phone: data.phone || '',
        logo_url: data.logo_url || '',
        regions_served: data.regions_served,
        user_id: userId,
        verification_status: data.verification_status || 'pending',
        created_at: new Date(),
      })
      .returning();

    console.log('Insert result:', result);
    return { success: true, data: result[0] };
  }
}

// Get all providers with their expertise from partner applications
export async function getAllProviders() {
  try {
    // Get all providers
    const providers = await db.query.solutionProviders.findMany({
      orderBy: (solutionProviders, { desc }) => [
        desc(solutionProviders.created_at),
      ],
    });

    // For each provider, get their expertise from partner applications
    const providersWithDetails = await Promise.all(
      providers.map(async (provider) => {
        // Only get expertise if there's an application_id
        let expertise: string[] = [];

        if (provider.application_id) {
          // Get the partner application to access expertise
          const application = await db.query.partnerApplications.findFirst({
            where: eq(partnerApplications.id, provider.application_id),
          });

          if (application) {
            expertise = application.expertise;
          }
        }

        // Add mock rating and reviews for demo purposes
        // In a real app, you'd fetch these from a reviews table
        const rating = Math.floor(Math.random() * 2) + 4; // Random rating between 4-5
        const reviews = Math.floor(Math.random() * 50) + 1; // Random number of reviews

        // Explicitly cast the result to SolutionProvider to include expertise
        return {
          ...provider,
          expertise,
          rating,
          reviews,
        } as SolutionProvider;
      }),
    );

    return { success: true, data: providersWithDetails };
  } catch (error) {
    console.error('Error fetching providers:', error);
    return { success: false, error: 'Failed to fetch providers' };
  }
}

// Get providers by expertise using raw SQL - FIXED VERSION
export async function getProvidersByExpertiseRaw(expertise: string) {
  try {
    console.log(`Fetching providers for expertise: ${expertise} using raw SQL`);

    // Use the correct syntax for parameterized queries
    const sanitizedExpertise = expertise.trim();

    const result = await db.execute(
      sql`
      SELECT 
        sp.*,
        pa.expertise
      FROM solution_providers sp
      JOIN partner_applications pa ON sp.email = pa.email
      WHERE pa.expertise @> ARRAY[${sanitizedExpertise}]
      `,
    );

    console.log(`Raw SQL result:`, result.rows);

    if (!result.rows || result.rows.length === 0) {
      return { success: true, data: [] };
    }

    // Transform the result to include all provider fields with proper typing
    const providers = result.rows.map((row) => {
      const rating = Math.floor(Math.random() * 2) + 4;
      const reviews = Math.floor(Math.random() * 50) + 1;

      // Properly cast each field to its expected type
      return {
        id: Number(row.id),
        name: String(row.name || ''),
        description: String(row.description || ''),
        email: String(row.email || ''),
        website: row.website ? String(row.website) : null,
        phone: row.phone ? String(row.phone) : null,
        logo_url: row.logo_url ? String(row.logo_url) : null,
        regions_served: Array.isArray(row.regions_served)
          ? row.regions_served
          : [],
        verification_status: String(row.verification_status || 'pending'),
        approved_date: row.approved_date,
        created_at: row.created_at,
        user_id: Number(row.user_id || 0),
        application_id: Number(row.application_id || 0),
        expertise: Array.isArray(row.expertise) ? row.expertise : [],
        rating,
        reviews,
      } as SolutionProvider;
    });

    console.log('Transformed providers:', providers);
    return { success: true, data: providers };
  } catch (error) {
    console.error('Error in raw SQL query:', error);
    return { success: false, error: 'Failed to execute raw SQL query' };
  }
}

// Alternative implementation using drizzle query builder instead of raw SQL
export async function getProvidersByExpertiseAlternative(expertise: string) {
  try {
    console.log(
      `Fetching providers for expertise: ${expertise} using query builder`,
    );

    // Find all partner applications with this expertise
    const applications = await db.query.partnerApplications.findMany({
      where: arrayContains(partnerApplications.expertise, [expertise]),
    });

    // Get the application IDs
    const applicationIds = applications.map((app) => app.id);

    if (applicationIds.length === 0) {
      return { success: true, data: [] };
    }

    // Find all solution providers linked to these applications
    const providers = await db.query.solutionProviders.findMany({
      where: inArray(solutionProviders.application_id, applicationIds),
    });

    // Add expertise and other details
    const providersWithDetails = providers.map((provider) => {
      // Find the matching application
      const application = applications.find(
        (app) => app.id === provider.application_id,
      );

      // Add mock rating and reviews
      const rating = Math.floor(Math.random() * 2) + 4;
      const reviews = Math.floor(Math.random() * 50) + 1;

      // Explicitly cast the result to SolutionProvider
      return {
        ...provider,
        expertise: application ? application.expertise : [],
        rating,
        reviews,
      } as SolutionProvider;
    });

    return { success: true, data: providersWithDetails };
  } catch (error) {
    console.error('Error fetching providers by expertise:', error);
    return { success: false, error: 'Failed to fetch providers by expertise' };
  }
}

// Get a single provider by ID
export async function getProviderById(id: number) {
  try {
    const provider = await db.query.solutionProviders.findFirst({
      where: eq(solutionProviders.id, id),
    });

    if (!provider) {
      return { success: false, error: 'Provider not found' };
    }

    // Get expertise from partner application
    let expertise: string[] = [];

    if (provider.application_id) {
      const application = await db.query.partnerApplications.findFirst({
        where: eq(partnerApplications.id, provider.application_id),
      });

      if (application) {
        expertise = application.expertise;
      }
    }

    // Add mock rating and reviews for demo purposes
    const rating = Math.floor(Math.random() * 2) + 4; // Random rating between 4-5
    const reviews = Math.floor(Math.random() * 50) + 1; // Random number of reviews

    return {
      success: true,
      data: {
        ...provider,
        expertise,
        rating,
        reviews,
      } as SolutionProvider,
    };
  } catch (error) {
    console.error('Error fetching provider:', error);
    return { success: false, error: 'Failed to fetch provider' };
  }
}
