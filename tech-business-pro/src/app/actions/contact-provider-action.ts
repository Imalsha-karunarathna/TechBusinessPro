'use server';

import { db } from '@/db';
import { contactRequests } from '@/lib/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export type ContactRequest = {
  id?: number;
  providerId: number | string;
  providerName: string;
  seekerId: number | string;
  seekerName: string;
  seekerEmail: string;
  requirements: string;
  preferredDate: string;
  preferredTimeSlot: string;
  urgency: 'low' | 'medium' | 'high';
  phone?: string;
  companyName?: string;
  budget?: string;
  additionalInfo?: string;
  status: 'pending' | 'contacted' | 'completed' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
};

export async function sendContactRequest(data: ContactRequest) {
  try {
    // Convert string IDs to numbers if needed
    const providerId =
      typeof data.providerId === 'string'
        ? Number.parseInt(data.providerId)
        : data.providerId;
    const seekerId =
      typeof data.seekerId === 'string'
        ? Number.parseInt(data.seekerId)
        : data.seekerId;

    // Insert the contact request into the database
    const result = await db
      .insert(contactRequests)
      .values({
        provider_id: providerId,
        provider_name: data.providerName,
        seeker_id: seekerId,
        seeker_name: data.seekerName,
        seeker_email: data.seekerEmail,
        requirements: data.requirements,
        preferred_date: data.preferredDate,
        preferred_time_slot: data.preferredTimeSlot,
        urgency: data.urgency,
        phone: data.phone || null,
        company_name: data.companyName || null,
        budget: data.budget || null,
        additional_info: data.additionalInfo || null,
        status: data.status,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    // Revalidate the provider dashboard path
    revalidatePath('/solutionProvider');

    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error sending contact request:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to send contact request',
    };
  }
}

export async function hasExistingContactRequest(
  seekerId: number,
  providerId: number,
) {
  try {
    const existing = await db.query.contactRequests.findFirst({
      where: (requests, { and, eq }) =>
        and(
          eq(requests.seeker_id, seekerId),
          eq(requests.provider_id, providerId),
          eq(requests.status, 'pending'),
        ),
    });

    return !!existing;
  } catch (error) {
    console.error('Error checking existing contact request:', error);
    return false;
  }
}

export async function getContactRequestsForProvider(providerId: number) {
  try {
    const requests = await db.query.contactRequests.findMany({
      where: (requests, { eq }) => eq(requests.provider_id, providerId),
      orderBy: (requests, { desc }) => [desc(requests.created_at)],
    });

    return { success: true, data: requests };
  } catch (error) {
    console.error('Error fetching contact requests:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch contact requests',
    };
  }
}

export async function updateContactRequestStatus(
  requestId: number,
  status: 'pending' | 'contacted' | 'completed' | 'rejected',
  notes?: string,
) {
  try {
    const result = await db
      .update(contactRequests)
      .set({
        status,
        notes: notes || null,
        updated_at: new Date(),
      })
      .where(eq(contactRequests.id, requestId))
      .returning();

    // Revalidate the provider dashboard path
    revalidatePath('/solutionProvider');

    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error updating contact request:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update contact request',
    };
  }
}
export async function markRequestAsRead(requestId: number) {
  try {
    const result = await db
      .update(contactRequests)
      .set({
        read: true,
        updated_at: new Date(),
      })
      .where(eq(contactRequests.id, requestId))
      .returning();

    // Revalidate the provider dashboard path
    revalidatePath('/solutionProvider');

    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error marking request as read:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to mark request as read',
    };
  }
}

export async function getUnreadContactRequestsCount(providerId: number) {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(contactRequests)
      .where(
        and(
          eq(contactRequests.provider_id, providerId),
          eq(contactRequests.read, false),
        ),
      );

    return {
      success: true,
      count: result[0]?.count || 0,
    };
  } catch (error) {
    console.error('Error counting unread requests:', error);
    return {
      success: false,
      count: 0,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to count unread requests',
    };
  }
}
