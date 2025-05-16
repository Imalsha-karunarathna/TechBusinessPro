'use server';

import { db } from '@/db';
import { solutionProviders } from '@/lib/db/tables/solutionProviders';
import { partnerApplications } from '@/lib/db/tables/partnerApplications';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

/**
 * Sets up a provider profile from an approved application
 * This is called when an application is approved
 */
export async function setupProviderFromApplication(
  userId: number,
  applicationId: number,
) {
  try {
    console.log(
      `Setting up provider profile for user ${userId} from application ${applicationId}`,
    );

    // Get the application data
    const application = await db.query.partnerApplications.findFirst({
      where: eq(partnerApplications.id, applicationId),
    });

    if (!application) {
      console.error(`Application ${applicationId} not found`);
      return { success: false, error: 'Application not found' };
    }

    if (application.application_status !== 'approved') {
      console.error(`Application ${applicationId} is not approved`);
      return { success: false, error: 'Application is not approved' };
    }

    console.log(`Found application for ${application.organization_name}`);

    // Check if a provider already exists for this user
    const existingProvider = await db.query.solutionProviders.findFirst({
      where: eq(solutionProviders.user_id, userId),
    });

    if (existingProvider) {
      console.log(
        `Provider already exists for user ${userId}, updating with application data`,
      );

      // Update the existing provider with application data
      const updatedProvider = await db
        .update(solutionProviders)
        .set({
          name: application.organization_name,
          description: application.designation || '',
          email: application.email,
          website: application.website || '',
          phone: application.phone || '',
          application_id: applicationId, // Set the application_id
          verification_status: 'approved',
          approved_date: new Date(),
        })
        .where(eq(solutionProviders.user_id, userId))
        .returning();

      console.log(
        `Updated provider: ${updatedProvider[0].id} with application_id: ${applicationId}`,
      );

      // Revalidate relevant paths
      revalidatePath('/providers');
      revalidatePath('/solutionProvider');

      return { success: true, data: updatedProvider[0] };
    }

    // Create a new provider profile
    console.log(
      `Creating new provider for user ${userId} with application ${applicationId}`,
    );

    const newProvider = await db
      .insert(solutionProviders)
      .values({
        name: application.organization_name,
        description: application.designation || '',
        email: application.email,
        website: application.website || '',
        phone: application.phone || '',
        regions_served: ['global'],
        user_id: userId,
        application_id: applicationId, // Set the application_id
        verification_status: 'approved',
        approved_date: new Date(),
        created_at: new Date(),
      })
      .returning();

    console.log(
      `Created new provider: ${newProvider[0].id} with application_id: ${applicationId}`,
    );

    // Revalidate relevant paths
    revalidatePath('/providers');
    revalidatePath('/solutionProvider');

    return { success: true, data: newProvider[0] };
  } catch (error) {
    console.error('Error setting up provider from application:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to set up provider',
    };
  }
}
