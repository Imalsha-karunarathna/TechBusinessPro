import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { solutionProviders } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const provider = await db
        .select()
        .from(solutionProviders)
        .where(eq(solutionProviders.id, Number.parseInt(id)))
        .limit(1);

      if (provider.length === 0) {
        return NextResponse.json(
          { error: 'Provider not found' },
          { status: 404 },
        );
      }

      return NextResponse.json(provider[0]);
    }

    const providers = await db.select().from(solutionProviders);
    return NextResponse.json(providers);
  } catch (error) {
    console.error('Error fetching solution providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solution providers' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate the required fields
    if (!data.name || !data.description || !data.email) {
      return NextResponse.json(
        { error: 'Name, description, and email are required' },
        { status: 400 },
      );
    }

    // Insert the provider
    await db.insert(solutionProviders).values({
      name: data.name,
      description: data.description,
      email: data.email,
      website: data.website,
      phone: data.phone,
      logo_url: data.logo_url,
      regions_served: data.regions_served,
      verification_status: 'pending',
      created_at: new Date(),
      user_id: data.user_id,
    });

    return NextResponse.json({
      success: true,
      message: 'Provider created successfully and pending verification',
    });
  } catch (error) {
    console.error('Error creating solution provider:', error);
    return NextResponse.json(
      { error: 'Failed to create solution provider' },
      { status: 500 },
    );
  }
}
