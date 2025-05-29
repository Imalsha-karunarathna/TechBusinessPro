import { db } from '@/db';
import { contactRequests } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { DocumentInfo } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';

export async function createContactRequest(data: {
  provider_id: number;
  provider_name: string;
  seeker_id: number;
  seeker_name: string;
  seeker_email: string;
  requirements: string;
  preferred_date: string;
  preferred_time_slot: string;
  urgency: string;
  phone?: string;
  company_name?: string;
  budget?: string;
  additional_info?: string;
  status: string;
  documents?: DocumentInfo[];
}) {
  try {
    const result = await db
      .insert(contactRequests)
      .values({
        ...data,
        phone: data.phone || null,
        company_name: data.company_name || null,
        budget: data.budget || null,
        additional_info: data.additional_info || null,
        documents:
          data.documents && data.documents.length > 0 ? data.documents : null,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error creating contact request:', error);
    throw new Error('Failed to create contact request');
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

    return result[0];
  } catch (error) {
    console.error('Error updating contact request status:', error);
    throw new Error('Failed to update contact request status');
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

    return result[0];
  } catch (error) {
    console.error('Error marking request as read:', error);
    throw new Error('Failed to mark request as read');
  }
}

export async function deleteContactRequest(requestId: number) {
  try {
    const result = await db
      .delete(contactRequests)
      .where(eq(contactRequests.id, requestId))
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error deleting contact request:', error);
    throw new Error('Failed to delete contact request');
  }
}

export async function updateContactRequestNotes(
  requestId: number,
  notes: string,
) {
  try {
    const result = await db
      .update(contactRequests)
      .set({
        notes,
        updated_at: new Date(),
      })
      .where(eq(contactRequests.id, requestId))
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error updating contact request notes:', error);
    throw new Error('Failed to update contact request notes');
  }
}

// File upload helper function
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
