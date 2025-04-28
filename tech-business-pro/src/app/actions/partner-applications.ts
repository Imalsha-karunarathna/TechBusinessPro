"use server";

import { partnerApplications } from "@/lib/db/tables/partnerApplications";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/server-auth";
import { db } from "@/db";

export async function updateApplicationStatus(
  applicationId: number,
  status: "pending" | "approved" | "rejected",
  reviewNotes?: string
) {
  try {
    const session = await requireAdmin();

    await db
      .update(partnerApplications)
      .set({
        application_status: status,
        reviewer_id: session.user.id,
        review_notes: reviewNotes || null,
        reviewed_at: new Date(),
      })
      .where(eq(partnerApplications.id, applicationId));

    revalidatePath("/admin/partner-application");
    return { success: true };
  } catch (error) {
    console.error("Error updating application status:", error);
    return { success: false, error: "Failed to update application status" };
  }
}

export async function getPartnerApplications(status?: string) {
  try {
    await requireAdmin();

    // If status is "all" or not provided, return all applications
    if (!status || status === "all") {
      return await db.query.partnerApplications.findMany({
        with: {
          reviewer: true,
        },
        orderBy: (partnerApplications, { desc }) => [
          desc(partnerApplications.created_at),
        ],
      });
    }

    // Otherwise, filter by the specified status
    if (["pending", "approved", "rejected"].includes(status)) {
      return await db.query.partnerApplications.findMany({
        where: (partnerApplications, { eq }) =>
          eq(partnerApplications.application_status, status as any),
        with: {
          reviewer: true,
        },
        orderBy: (partnerApplications, { desc }) => [
          desc(partnerApplications.created_at),
        ],
      });
    }

    // Default return empty array if status is invalid
    return [];
  } catch (error) {
    console.error("Error fetching partner applications:", error);
    return [];
  }
}

export async function getPartnerApplicationById(id: number) {
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
    console.error("Error fetching partner application:", error);
    return null;
  }
}
