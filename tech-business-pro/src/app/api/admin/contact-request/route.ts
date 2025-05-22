import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sendContactRequestWithFiles } from '@/app/actions/contact-provider-action';

export async function GET() {
  try {
    // Fetch all contact requests from the database
    const requests = await db.query.contactRequests.findMany({
      orderBy: (requests, { desc }) => [desc(requests.created_at)],
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching contact requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact requests' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    // Check content type to handle different request formats
    const contentType = req.headers.get('content-type') || '';

    // Handle JSON requests
    if (contentType.includes('application/json')) {
      const { seekerId, providerId } = await req.json();

      if (seekerId && providerId) {
        // Check if there's an existing request
        const existing = await db.query.contactRequests.findFirst({
          where: (requests, { and, eq }) =>
            and(
              eq(requests.seeker_id, seekerId),
              eq(requests.provider_id, providerId),
              eq(requests.status, 'pending'),
            ),
        });

        return NextResponse.json({ exists: !!existing });
      }

      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 },
      );
    }

    // Handle multipart form data (file uploads)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();

      // Use the server action to handle the form data
      const result = await sendContactRequestWithFiles(formData);

      if (result.success) {
        return NextResponse.json({ success: true, data: result.data });
      } else {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { error: 'Unsupported content type' },
      { status: 400 },
    );
  } catch (error) {
    console.error('Error processing contact request:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to process request',
      },
      { status: 500 },
    );
  }
}
