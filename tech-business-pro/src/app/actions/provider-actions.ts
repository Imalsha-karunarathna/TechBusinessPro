'use server';

import { db } from '@/db';
import {
  solutionProviders,
  insertSolutionProviderSchema,
  type NewSolutionProvider,
} from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

export async function createOrUpdateProvider(data: NewSolutionProvider) {
  try {
    console.log('Server action received data:', data);

    // Validate the data
    const validatedData = insertSolutionProviderSchema.parse(data);
    console.log('Validated data:', validatedData);

    // If regions_served is a string, convert it to an array
    if (typeof validatedData.regions_served === 'string') {
      validatedData.regions_served = [validatedData.regions_served];
    }

    // Insert the provider
    const result = await db
      .insert(solutionProviders)
      .values(validatedData)
      .returning();
    console.log('Database insert result:', result);

    // Revalidate the providers page
    revalidatePath('/providers');
    revalidatePath('/solutions');
    revalidatePath('/');

    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error creating provider:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create provider',
    };
  }
}

export async function getProviderById(id: number) {
  try {
    const provider = await db.query.solutionProviders.findFirst({
      where: (providers, { eq }) => eq(providers.id, id),
    });

    return { success: true, data: provider };
  } catch (error) {
    console.error('Error fetching provider:', error);
    return { success: false, error: 'Failed to fetch provider' };
  }
}

export async function getAllProviders() {
  try {
    const providers = await db.query.solutionProviders.findMany();
    return { success: true, data: providers };
  } catch (error) {
    console.error('Error fetching providers:', error);
    return { success: false, error: 'Failed to fetch providers' };
  }
}
