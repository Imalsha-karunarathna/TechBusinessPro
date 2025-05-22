'use server';

import { db } from '@/db';
import { contactRequests } from '@/lib/db/schema';
import type { DocumentInfo } from '@/lib/types';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';

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

// New function to handle file uploads with Vercel Blob
export async function uploadFilesToBlob(
  files: File[],
): Promise<DocumentInfo[]> {
  const documentInfos: DocumentInfo[] = [];

  if (!files || files.length === 0) {
    return documentInfos;
  }

  for (const file of files) {
    try {
      // Generate a unique filename
      const fileExtension = file.name.split('.').pop();
      const uniqueFilename = `${uuidv4()}.${fileExtension}`;

      // Upload to Vercel Blob
      const blob = await put(uniqueFilename, file, {
        access: 'public', // Use 'private' for sensitive documents
      });

      // Store document information
      documentInfos.push({
        filename: uniqueFilename,
        originalName: file.name,
        size: file.size,
        mimeType: file.type,
        url: blob.url,
      });
    } catch (error) {
      console.error('Error uploading file to Blob:', error);
      // Continue with other files if one fails
    }
  }

  return documentInfos;
}

// Function to send contact request with file support
export async function sendContactRequestWithFiles(formData: FormData) {
  try {
    // Extract form fields
    const providerId = Number(formData.get('providerId'));
    const seekerId = Number(formData.get('seekerId'));
    const providerName = formData.get('providerName') as string;
    const seekerName = formData.get('seekerName') as string;
    const seekerEmail = formData.get('seekerEmail') as string;
    const requirements = formData.get('requirements') as string;
    const preferredDate = formData.get('preferredDate') as string;
    const preferredTimeSlot = formData.get('preferredTimeSlot') as string;
    const urgency = formData.get('urgency') as string;
    const phone = formData.get('phone') as string;
    const companyName = formData.get('companyName') as string;
    const budget = formData.get('budget') as string;
    const additionalInfo = formData.get('additionalInfo') as string;
    const status = formData.get('status') as string;

    // Check for existing pending request
    const existing = await hasExistingContactRequest(seekerId, providerId);
    if (existing) {
      return {
        success: false,
        error:
          'You already have a pending request with this provider. Please wait for a response.',
      };
    }

    // Handle file uploads
    const files = formData.getAll('files') as File[];
    let documentInfos: DocumentInfo[] = [];

    if (files && files.length > 0) {
      documentInfos = await uploadFilesToBlob(files);
    }

    // Insert the contact request with document information
    const result = await db
      .insert(contactRequests)
      .values({
        provider_id: providerId,
        provider_name: providerName,
        seeker_id: seekerId,
        seeker_name: seekerName,
        seeker_email: seekerEmail,
        requirements: requirements,
        preferred_date: preferredDate,
        preferred_time_slot: preferredTimeSlot,
        urgency: urgency,
        phone: phone || null,
        company_name: companyName || null,
        budget: budget || null,
        additional_info: additionalInfo || null,
        status: status,
        documents: documentInfos.length > 0 ? documentInfos : null,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    // Revalidate the provider dashboard path
    revalidatePath('/solutionProvider');
    revalidatePath('/admin/contact-requests');

    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error sending contact request with files:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to send contact request',
    };
  }
}
