"use server";

import { partnerApplications } from "@/lib/db/tables/partnerApplications";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/server-auth";
import { db } from "@/db";
import { unstable_noStore as noStore } from "next/cache";

export async function getPartnerApplications(status?: string) {
  // Prevent caching to ensure fresh data every time
  noStore();

  try {
    await requireAdmin();

    // Normalize the status parameter
    const normalizedStatus = status?.trim().toLowerCase() || "all";

    // If status is "all", return all applications
    if (normalizedStatus === "all") {
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

    // Otherwise filter by specific status
    if (["pending", "approved", "rejected"].includes(normalizedStatus)) {
      // Use a direct query with explicit casting to ensure proper filtering
      const filteredApplications = await db.query.partnerApplications.findMany({
        where: (partnerApplications, { eq }) =>
          /* eslint-disable no-explicit-any*/
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
    console.error("Error fetching partner applications:", error);
    return [];
  }
}

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

    // Revalidate all paths to ensure fresh data
    revalidatePath("/admin/partner-application");
    revalidatePath(`/admin/partner-application/${applicationId}`);

    // Force revalidation of all status tabs
    revalidatePath("/admin/partner-application?status=pending");
    revalidatePath("/admin/partner-application?status=approved");
    revalidatePath("/admin/partner-application?status=rejected");
    revalidatePath("/admin/partner-application?status=all");

    return { success: true };
  } catch (error) {
    console.error("Error updating application status:", error);
    return { success: false, error: "Failed to update application status" };
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
    console.error("Error fetching partner application:", error);
    return null;
  }
}
