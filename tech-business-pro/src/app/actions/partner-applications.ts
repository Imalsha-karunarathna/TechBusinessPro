'use server';

import { partnerApplications } from '@/lib/db/tables/partnerApplications';
import { eq } from 'drizzle-orm';
import { auth, requireAdmin } from '@/lib/server-auth';
import { db } from '@/db';
import { unstable_noStore as noStore } from 'next/cache';
import { createUserWithResetToken } from './reset-token';
import { setupProviderFromApplication } from './provider-profile-setup';
import { revalidatePath } from 'next/cache';
import {
  createPartnerApplication,
  PartnerApplicationInput,
} from '@/lib/db/partnerApplication/write';

export async function getPartnerApplications(status?: string) {
  // Prevent caching to ensure fresh data every time
  noStore();

  try {
    await requireAdmin();

    // Normalize the status parameter
    const normalizedStatus = status?.trim().toLowerCase() || 'all';

    // If status is "all", return all applications
    if (normalizedStatus === 'all') {
      const allApplications = await db.query.partnerApplications.findMany({
        with: {
          reviewer: true,
        },
        orderBy: (partnerApplications, { desc }) => [
          desc(partnerApplications.created_at),
        ],
      });

      return allApplications;
    }

    if (['pending', 'approved', 'rejected'].includes(normalizedStatus)) {
      // Use a direct query with explicit casting to ensure proper filtering
      const filteredApplications = await db.query.partnerApplications.findMany({
        where: (partnerApplications, { eq }) =>
          /*eslint-disable @typescript-eslint/no-explicit-any */
          eq(partnerApplications.application_status, normalizedStatus as any),
        with: {
          reviewer: true,
        },
        orderBy: (partnerApplications, { desc }) => [
          desc(partnerApplications.created_at),
        ],
      });

      return filteredApplications;
    }

    // Invalid status — return empty array
    return [];
  } catch (error) {
    console.error('Error fetching partner applications:', error);
    return [];
  }
}

export async function updateApplicationStatus(
  applicationId: number,
  status: 'approved' | 'rejected',
  reviewNotes: string,
) {
  try {
    console.log(`Updating application ${applicationId} status to ${status}`);

    const session = await auth();

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const reviewerId = session.user.id;

    // First, get the application details
    const applicationData = await db.query.partnerApplications.findFirst({
      where: eq(partnerApplications.id, applicationId),
    });

    if (!applicationData) {
      return { success: false, error: 'Application not found' };
    }

    console.log(`Found application for ${applicationData.organization_name}`);

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

    console.log(`Updated application status to ${status}`);

    // If approved, create a user account with reset token
    if (status === 'approved') {
      console.log(`Creating user account for ${applicationData.email}`);

      const userResult = await createUserWithResetToken(
        applicationData.email,
        applicationData.partner_name,
        applicationData.organization_name,
      );

      if (!userResult.success) {
        return {
          success: false,
          error: `Application approved but failed to create user: ${userResult.error}`,
        };
      }

      console.log(`Created user account with ID: ${userResult.userId}`);

      // If user was created successfully, set up the provider profile
      if (userResult.userId) {
        console.log(
          `Setting up provider profile for user ${userResult.userId}`,
        );

        // Set up the provider profile
        const providerResult = await setupProviderFromApplication(
          userResult.userId,
          applicationId,
        );

        if (!providerResult.success) {
          console.error(
            `Failed to set up provider profile: ${providerResult.error}`,
          );
          return {
            success: false,
            error: `Application approved and user created, but failed to set up provider profile: ${providerResult.error}`,
          };
        }

        // console.log(
        //   `Provider profile set up successfully with ID: ${providerResult.data.id}`,
        // );
      }

      // Revalidate paths
      revalidatePath('/admin/partner-application');
      revalidatePath('/providers');
      revalidatePath('/solutions');

      // Return success with reset URL
      return {
        success: true,
        resetUrl: userResult.resetUrl,
      };
    }

    // Revalidate paths
    revalidatePath('/admin/partner-application');

    return { success: true };
  } catch (error) {
    console.error('Error updating application status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getPartnerApplicationById(id: number) {
  noStore(); // Prevent caching

  try {
    await requireAdmin();

    const application = await db.query.partnerApplications.findFirst({
      where: (partnerApplications, { eq }) => eq(partnerApplications.id, id),
      with: {
        reviewer: true,
      },
    });

    return application;
  } catch (error) {
    console.error('Error fetching partner application:', error);
    return null;
  }
}
export async function submitPartnerApplication(data: PartnerApplicationInput) {
  try {
    const result = await createPartnerApplication(data);

    // Revalidate the partner page to reflect any changes
    revalidatePath('/');

    return {
      success: true,
      message: 'Your partner application has been submitted successfully.',
      application: result.application,
    };
  } catch (error) {
    console.error('Error in submitPartnerApplication:', error);
    return {
      success: false,
      message:
        'There was an error submitting your application. Please try again.',
    };
  }
}
