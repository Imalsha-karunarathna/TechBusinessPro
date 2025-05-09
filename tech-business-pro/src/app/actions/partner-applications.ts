'use server';

import { partnerApplications } from '@/lib/db/tables/partnerApplications';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth, requireAdmin } from '@/lib/server-auth';
import { db } from '@/db';
import { unstable_noStore as noStore } from 'next/cache';
import { createUserWithResetToken } from './reset-token';

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
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const reviewerId = session.user.id;

    // First, get the application details if status is approved
    // We need this to create the user
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
          error: `Application approved but failed to create user: ${userResult.error}`,
        };
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
