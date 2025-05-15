'use server';

import { db } from '@/db';
import {
  solutionProviders,
  partnerApplications,
  insertSolutionProviderSchema,
} from '@/lib/db/schema';
import { eq, sql, inArray, arrayContains } from 'drizzle-orm';
import type { NewSolutionProvider, SolutionProvider } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

export async function createOrUpdateProvider(data: NewSolutionProvider) {
  try {
    console.log('Server action received data:', data);

    // Validate the data
    const validatedData = insertSolutionProviderSchema.parse(data);
    console.log('Validated data:', validatedData);

    // If regions_served is a string, convert it to an array
    if (typeof validatedData.regions_served === 'string') {
      validatedData.regions_served = [validatedData.regions_served];
    }

    // Insert the provider
    const result = await db
      .insert(solutionProviders)
      .values(validatedData)
      .returning();
    console.log('Database insert result:', result);

    // Revalidate the providers page
    revalidatePath('/providers');
    revalidatePath('/solutions');
    revalidatePath('/');

    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error creating provider:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create provider',
    };
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
