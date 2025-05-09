import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { solutions } from '@/lib/db/tables/solutions';
import { solutionProviders } from '@/lib/db/tables/solutionProviders';
import { eq } from 'drizzle-orm';
import { solutionCategoryEnum } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category');

    const enumCategories = solutionCategoryEnum.enumValues;

    const category = enumCategories.includes(categoryParam as any)
      ? (categoryParam as (typeof enumCategories)[number])
      : null;

    const queryBuilder = db
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
      );

    const query = category
      ? queryBuilder.where(eq(solutions.category, category))
      : queryBuilder;

    const result = await query;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching solutions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solutions' },
      { status: 500 },
    );
  }
}
