'use server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

type ExpertiseRow = { expertise: string };
type ExpertiseCountRow = { expertise: string; provider_count: string | number };
export async function getAllExpertiseCategories() {
  try {
    // Use raw SQL to unnest the expertise array and get unique values
    const result = await db.execute(
      sql`
      SELECT DISTINCT unnest(expertise) as expertise
      FROM partner_applications
      ORDER BY expertise
    `,
    );

    // Extract the expertise values from the result
    const rows = result.rows as ExpertiseRow[];
    const categories = rows.map((row) => row.expertise);
    return { success: true, data: categories };
  } catch (error) {
    console.error('Error fetching expertise categories:', error);
    return { success: false, error: 'Failed to fetch expertise categories' };
  }
}

// Get expertise categories with provider counts
export async function getExpertiseCategoriesWithCounts() {
  try {
    // Use raw SQL to count providers for each expertise
    const result = await db.execute(
      sql`
      SELECT unnest(pa.expertise) as expertise, COUNT(DISTINCT sp.id) as provider_count
      FROM partner_applications pa
      JOIN solution_providers sp ON pa.id = sp.application_id
      GROUP BY unnest(pa.expertise)
      ORDER BY COUNT(DISTINCT sp.id) DESC
    `,
    );

    // Extract the expertise values and counts from the result

    const rows = result.rows as ExpertiseCountRow[];

    const categoriesWithCounts = rows.map((row) => ({
      expertise: row.expertise,
      count: Number.parseInt(String(row.provider_count)),
    }));

    return { success: true, data: categoriesWithCounts };
  } catch (error) {
    console.error('Error fetching expertise categories with counts:', error);
    return {
      success: false,
      error: 'Failed to fetch expertise categories with counts',
    };
  }
}
