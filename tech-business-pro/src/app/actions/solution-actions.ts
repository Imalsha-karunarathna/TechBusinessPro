// 'use server';

// import { db } from '@/db';
// import { solutions } from '@/lib/db/tables/solutions';
// import { solutionProviders } from '@/lib/db/tables/solutionProviders';
// import { eq, and } from 'drizzle-orm';
// import { auth } from '@/lib/server-auth';
// import { revalidatePath } from 'next/cache';
// import type { z } from 'zod';
// import type {
//   insertSolutionSchema,
//   solutionCategoryEnum,
// } from '@/lib/db/schema';

// export async function getProviderSolutions(providerId: number) {
//   try {
//     // Get solutions for the provider
//     const providerSolutions = await db.query.solutions.findMany({
//       where: (solutions, { eq }) => eq(solutions.provider_id, providerId),
//       orderBy: (solutions, { desc }) => [desc(solutions.created_at)],
//     });

//     return { success: true, data: providerSolutions };
//   } catch (error) {
//     console.error('Error fetching provider solutions:', error);
//     return {
//       success: false,
//       error:
//         error instanceof Error ? error.message : 'Failed to fetch solutions',
//     };
//   }
// }

// // Get all solutions
// export async function getAllSolutions() {
//   try {
//     const allSolutions = await db.query.solutions.findMany({
//       with: {
//         provider: true,
//       },
//     });

//     return { success: true, data: allSolutions };
//   } catch (error) {
//     console.error('Error fetching solutions:', error);
//     return { success: false, error: 'Failed to fetch solutions' };
//   }
// }

// // Get solutions by category
// export async function getSolutionsByCategory(
//   category: (typeof solutionCategoryEnum.enumValues)[number],
// ) {
//   try {
//     const filteredSolutions = await db.query.solutions.findMany({
//       where: eq(solutions.category, category),
//       with: {
//         provider: true,
//       },
//     });

//     return { success: true, data: filteredSolutions };
//   } catch (error) {
//     console.error('Error fetching solutions by category:', error);
//     return { success: false, error: 'Failed to fetch solutions' };
//   }
// }

// // Get solutions by provider ID
// export async function getSolutionsByProvider(providerId: number) {
//   try {
//     const providerSolutions = await db.query.solutions.findMany({
//       where: eq(solutions.provider_id, providerId),
//     });

//     return { success: true, data: providerSolutions };
//   } catch (error) {
//     console.error('Error fetching provider solutions:', error);
//     return { success: false, error: 'Failed to fetch provider solutions' };
//   }
// }

// // Get solution by ID
// export async function getSolutionById(id: number) {
//   try {
//     const solution = await db.query.solutions.findFirst({
//       where: eq(solutions.id, id),
//       with: {
//         provider: true,
//       },
//     });

//     if (!solution) {
//       return { success: false, error: 'Solution not found' };
//     }

//     // Increment views count
//     await db
//       .update(solutions)
//       .set({
//         views_count: solution.views_count + 1,
//       })
//       .where(eq(solutions.id, id));

//     return { success: true, data: solution };
//   } catch (error) {
//     console.error('Error fetching solution:', error);
//     return { success: false, error: 'Failed to fetch solution' };
//   }
// }

// // Create solution
// export async function createSolution(
//   data: z.infer<typeof insertSolutionSchema>,
// ) {
//   try {
//     const session = await auth();

//     if (!session?.user) {
//       return { success: false, error: 'Unauthorized' };
//     }

//     // Get the provider ID
//     const provider = await db.query.solutionProviders.findFirst({
//       where: eq(solutionProviders.email, session.user.email),
//     });

//     if (!provider) {
//       return { success: false, error: 'Provider profile not found' };
//     }

//     // Ensure regions and features are arrays
//     const regions = Array.isArray(data.regions) ? data.regions : [data.regions];
//     const features = Array.isArray(data.features)
//       ? data.features
//       : data.features
//         ? [data.features]
//         : [];

//     // Create the solution
//     const result = await db
//       .insert(solutions)
//       .values({
//         title: data.title,
//         description: data.description,
//         category: data.category,
//         provider_id: provider.id,
//         image_url: data.image_url || null,
//         regions: regions,
//         features: features,
//         pricing_info: data.pricing_info || null,
//         is_featured: data.is_featured || false,
//       })
//       .returning();

//     revalidatePath('/solutionProvider');

//     return { success: true, data: result[0] };
//   } catch (error) {
//     console.error('Error creating solution:', error);
//     return { success: false, error: 'Failed to create solution' };
//   }
// }

// // Update solution
// export async function updateSolution(
//   id: number,
//   data: z.infer<typeof insertSolutionSchema>,
// ) {
//   try {
//     const session = await auth();

//     if (!session?.user) {
//       return { success: false, error: 'Unauthorized' };
//     }

//     // Get the provider ID
//     const provider = await db.query.solutionProviders.findFirst({
//       where: eq(solutionProviders.email, session.user.email),
//     });

//     if (!provider) {
//       return { success: false, error: 'Provider profile not found' };
//     }

//     // Verify the solution belongs to this provider
//     const existingSolution = await db.query.solutions.findFirst({
//       where: and(eq(solutions.id, id), eq(solutions.provider_id, provider.id)),
//     });

//     if (!existingSolution) {
//       return {
//         success: false,
//         error: "Solution not found or you don't have permission to edit it",
//       };
//     }

//     // Ensure regions and features are arrays
//     const regions = Array.isArray(data.regions) ? data.regions : [data.regions];
//     const features = Array.isArray(data.features)
//       ? data.features
//       : data.features
//         ? [data.features]
//         : [];

//     // Update the solution
//     const result = await db
//       .update(solutions)
//       .set({
//         title: data.title,
//         description: data.description,
//         category: data.category,
//         image_url: data.image_url || null,
//         regions: regions,
//         features: features,
//         pricing_info: data.pricing_info || null,
//         is_featured: data.is_featured || false,
//         updated_at: new Date(),
//       })
//       .where(eq(solutions.id, id))
//       .returning();

//     revalidatePath('/solutionProvider');
//     revalidatePath(`/solutions/${id}`);

//     return { success: true, data: result[0] };
//   } catch (error) {
//     console.error('Error updating solution:', error);
//     return { success: false, error: 'Failed to update solution' };
//   }
// }

// // Delete solution
// export async function deleteSolution(id: number) {
//   try {
//     const session = await auth();

//     if (!session?.user) {
//       return { success: false, error: 'Unauthorized' };
//     }

//     // Get the provider ID
//     const provider = await db.query.solutionProviders.findFirst({
//       where: eq(solutionProviders.email, session.user.email),
//     });

//     if (!provider) {
//       return { success: false, error: 'Provider profile not found' };
//     }

//     // Verify the solution belongs to this provider
//     const existingSolution = await db.query.solutions.findFirst({
//       where: and(eq(solutions.id, id), eq(solutions.provider_id, provider.id)),
//     });

//     if (!existingSolution) {
//       return {
//         success: false,
//         error: "Solution not found or you don't have permission to delete it",
//       };
//     }

//     // Delete the solution
//     await db.delete(solutions).where(eq(solutions.id, id));

//     revalidatePath('/solutionProvider');

//     return { success: true };
//   } catch (error) {
//     console.error('Error deleting solution:', error);
//     return { success: false, error: 'Failed to delete solution' };
//   }
// }
