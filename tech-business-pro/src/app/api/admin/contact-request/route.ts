import { NextResponse } from 'next/server';
import { db } from '@/db';
import { hasExistingContactRequest } from '@/app/actions/contact-provider-action';

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
  const { seekerId, providerId } = await req.json();

  if (!seekerId || !providerId) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const exists = await hasExistingContactRequest(seekerId, providerId);

  return NextResponse.json({ exists });
}
