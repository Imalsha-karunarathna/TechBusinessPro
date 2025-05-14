'use server';

import { db } from '@/db';
import { solutionProviders } from '@/lib/db/tables/solutionProviders';
import { partnerApplications } from '@/lib/db/tables/partnerApplications';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/server-auth';

/**
 * Gets the provider profile for a user, creating one from their application if needed
 */
export async function getOrCreateProviderProfile(userId: number) {
  try {
    // First, check if provider profile already exists
    const provider = await db.query.solutionProviders.findFirst({
      where: (providers, { eq }) => eq(providers.id, userId),
    });

    // If provider exists, return it
    if (provider) {
      return { success: true, data: provider };
    }

    // If not, check if there's an approved application for this user's email
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Find application by email
    const application = await db.query.partnerApplications.findFirst({
      where: (apps, { eq, and }) =>
        and(
          eq(apps.email, user.email),
          eq(apps.application_status, 'approved'),
        ),
    });

    if (!application) {
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

      return { success: true, data: newProvider[0], isNew: true };
    }

    // Create provider from application
    const result = await setupProviderFromApplication(userId, application.id);

    if (result.success) {
      return { ...result, isFromApplication: true };
    }

    return result;
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

    // Convert expertise to array if it's a string
    // let expertiseArray: string[] = [];
    // if (typeof application.expertise === 'string') {
    //   expertiseArray = [application.expertise];
    // } else if (Array.isArray(application.expertise)) {
    //   expertiseArray = application.expertise;
    // }

    // Create or update the provider profile
    const result = await db
      .insert(solutionProviders)
      .values({
        name: application.organization_name,
        description: application.designation || '',
        email: application.email,
        website: application.website || '',
        phone: application.phone || '',
        regions_served: ['global'],
        user_id: userId,
        verification_status: 'approved',
        approved_date: new Date(),
        created_at: new Date(),
      })
      .onConflictDoUpdate({
        target: solutionProviders.id,
        set: {
          name: application.organization_name,
          description: application.designation || '',
          email: application.email,
          website: application.website || '',
          phone: application.phone || '',
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

/**
 * Updates the application status and sets up provider account if approved
 */
export async function updateApplicationStatusAndSetupProvider(
  applicationId: number,
  status: 'approved' | 'rejected',
  reviewNotes: string,
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const reviewerId = session.user.id;

    // First, get the application details if status is approved
    let applicationData;
    if (status === 'approved') {
      applicationData = await db.query.partnerApplications.findFirst({
        where: eq(partnerApplications.id, applicationId),
      });

      if (!applicationData) {
        return { success: false, error: 'Application not found' };
      }
    }

    // Update the application status
    await db
      .update(partnerApplications)
      .set({
        application_status: status,
        reviewer_id: reviewerId,
        review_notes: reviewNotes,
        reviewed_at: new Date(),
      })
      .where(eq(partnerApplications.id, applicationId));

    // If approved, create a user account with reset token
    if (status === 'approved' && applicationData) {
      const userResult = await createUserWithResetToken(
        applicationData.email,
        applicationData.partner_name,
        applicationData.organization_name,
      );

      if (!userResult.success) {
        return {
          success: false,
          //  error: `Application approved but failed to create user: ${userResult.error}`,
        };
      }

      // If user was created successfully, set up the provider profile
      if (userResult.userId) {
        await setupProviderFromApplication(userResult.userId, applicationId);
      }

      // Return success with reset URL
      return {
        success: true,
        resetUrl: userResult.resetUrl,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating application status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// This is a mock function that would be implemented in your actual application
/* eslint-disable @typescript-eslint/no-unused-vars */
async function createUserWithResetToken(
  email: string,
  name: string,
  organization: string,
) {
  // In a real application, this would create a user and generate a reset token
  // For now, we'll just return a mock success response
  return {
    success: true,
    userId: 123, // Mock user ID
    resetUrl: `https://example.com/reset-password?token=mock-token`,
  };
}
