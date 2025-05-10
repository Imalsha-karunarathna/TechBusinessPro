import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { solutions } from '@/lib/db/tables/solutions';
import { solutionProviders } from '@/lib/db/tables/solutionProviders';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Extracting the dynamic parameter directly from request.nextUrl
    const id = Number.parseInt(request.nextUrl.pathname.split('/').pop() || '');

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid solution ID' },
        { status: 400 },
      );
    }

    // Query to get solution with its provider
    const result = await db
      .select({
        id: solutions.id,
        title: solutions.title,
        description: solutions.description,
        category: solutions.category,
        provider_id: solutions.provider_id,
        image_url: solutions.image_url,
        regions: solutions.regions,
        features: solutions.features,
        pricing_info: solutions.pricing_info,
        is_featured: solutions.is_featured,
        views_count: solutions.views_count,
        inquiries_count: solutions.inquiries_count,
        created_at: solutions.created_at,
        updated_at: solutions.updated_at,
        provider: {
          id: solutionProviders.id,
          name: solutionProviders.name,
          description: solutionProviders.description,
          email: solutionProviders.email,
          verification_status: solutionProviders.verification_status,
          created_at: solutionProviders.created_at,
          logo_url: solutionProviders.logo_url,
          regions_served: solutionProviders.regions_served,
          website: solutionProviders.website,
          phone: solutionProviders.phone,
        },
      })
      .from(solutions)
      .leftJoin(
        solutionProviders,
        eq(solutions.provider_id, solutionProviders.id),
      )
      .where(eq(solutions.id, id))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 },
      );
    }

    const solution = result[0];

    // Add mock data for demo purposes
    // if (solution.provider) {
    //   solution.provider.rating = 4
    //   solution.provider.reviews = Math.floor(Math.random() * 50) + 1
    // }

    // Increment views count
    await db
      .update(solutions)
      .set({ views_count: (solution.views_count || 0) + 1 })
      .where(eq(solutions.id, id));

    return NextResponse.json(solution);
  } catch (error) {
    console.error('Error fetching solution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solution' },
      { status: 500 },
    );
  }
}
