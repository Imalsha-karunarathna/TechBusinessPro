import { db } from '@/db';
import { contactRequests } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function getAllContactRequests() {
  try {
    const requests = await db.query.contactRequests.findMany({
      orderBy: (requests, { desc }) => [desc(requests.created_at)],
    });
    return requests;
  } catch (error) {
    console.error('Error fetching all contact requests:', error);
    throw new Error('Failed to fetch contact requests');
  }
}

export async function getContactRequestsForProvider(providerId: number) {
  try {
    const requests = await db.query.contactRequests.findMany({
      where: (requests, { eq }) => eq(requests.provider_id, providerId),
      orderBy: (requests, { desc }) => [desc(requests.created_at)],
    });
    return requests;
  } catch (error) {
    console.error('Error fetching contact requests for provider:', error);
    throw new Error('Failed to fetch contact requests');
  }
}

export async function getContactRequestById(requestId: number) {
  try {
    const request = await db.query.contactRequests.findFirst({
      where: (requests, { eq }) => eq(requests.id, requestId),
    });
    return request || null;
  } catch (error) {
    console.error('Error fetching contact request by ID:', error);
    throw new Error('Failed to fetch contact request');
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

export async function getContactRequestsByStatus(status: string) {
  try {
    const requests = await db.query.contactRequests.findMany({
      where: (requests, { eq }) => eq(requests.status, status),
      orderBy: (requests, { desc }) => [desc(requests.created_at)],
    });
    return requests;
  } catch (error) {
    console.error('Error fetching contact requests by status:', error);
    throw new Error('Failed to fetch contact requests');
  }
}

export async function getUnreadContactRequestsCount(providerId?: number) {
  try {
    const whereCondition = providerId
      ? and(
          eq(contactRequests.provider_id, providerId),
          eq(contactRequests.read, false),
        )
      : eq(contactRequests.read, false);

    const requests = await db.query.contactRequests.findMany({
      where: whereCondition,
    });
    return requests.length;
  } catch (error) {
    console.error('Error fetching unread contact requests count:', error);
    return 0;
  }
}
