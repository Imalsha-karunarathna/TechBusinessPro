'use server';

import { revalidatePath } from 'next/cache';
import {
  getAllContactRequests,
  getContactRequestsForProvider,
  hasExistingContactRequest,
  getContactRequestById,
} from '@/lib/db/contactRequest/read';
import {
  createContactRequest,
  updateContactRequestStatus,
  markRequestAsRead,
  deleteContactRequest,
  uploadFilesToBlob,
} from '@/lib/db/contactRequest/write';
import type { DocumentInfo } from '@/lib/types';

export async function getAllContactRequestsAction() {
  try {
    const requests = await getAllContactRequests();
    return { success: true, data: requests };
  } catch (error) {
    console.error('Error fetching all contact requests:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch contact requests',
      data: [],
    };
  }
}

export async function getContactRequestsForProviderAction(providerId: number) {
  try {
    const requests = await getContactRequestsForProvider(providerId);
    return { success: true, data: requests };
  } catch (error) {
    console.error('Error fetching contact requests:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch contact requests',
      data: [],
    };
  }
}

export async function checkExistingContactRequest(
  seekerId: number,
  providerId: number,
) {
  try {
    const exists = await hasExistingContactRequest(seekerId, providerId);
    return { success: true, exists };
  } catch (error) {
    console.error('Error checking existing contact request:', error);
    return { success: false, exists: false };
  }
}

export async function updateContactRequestStatusAction(
  requestId: number,
  status: 'pending' | 'contacted' | 'completed' | 'rejected',
  notes?: string,
) {
  try {
    const result = await updateContactRequestStatus(requestId, status, notes);
    revalidatePath('/solutionProvider');
    revalidatePath('/admin/request-messages');
    return { success: true, data: result };
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

export async function markRequestAsReadAction(requestId: number) {
  try {
    const result = await markRequestAsRead(requestId);
    revalidatePath('/solutionProvider');
    revalidatePath('/admin/contact-requests');
    return { success: true, data: result };
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

    // Create the contact request
    const result = await createContactRequest({
      provider_id: providerId,
      provider_name: providerName,
      seeker_id: seekerId,
      seeker_name: seekerName,
      seeker_email: seekerEmail,
      requirements: requirements,
      preferred_date: preferredDate,
      preferred_time_slot: preferredTimeSlot,
      urgency: urgency,
      phone: phone || undefined,
      company_name: companyName || undefined,
      budget: budget || undefined,
      additional_info: additionalInfo || undefined,
      status: status,
      documents: documentInfos.length > 0 ? documentInfos : undefined,
    });

    // Revalidate relevant paths
    revalidatePath('/solutionProvider');
    revalidatePath('/admin/contact-requests');

    return { success: true, data: result };
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

export async function deleteContactRequestAction(requestId: number) {
  try {
    const result = await deleteContactRequest(requestId);
    revalidatePath('/solutionProvider');
    revalidatePath('/admin/contact-requests');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error deleting contact request:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete contact request',
    };
  }
}

export async function getContactRequestByIdAction(requestId: number) {
  try {
    const request = await getContactRequestById(requestId);
    return { success: true, data: request };
  } catch (error) {
    console.error('Error fetching contact request:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch contact request',
      data: null,
    };
  }
}
