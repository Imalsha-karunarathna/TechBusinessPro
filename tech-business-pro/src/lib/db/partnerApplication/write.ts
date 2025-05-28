import { db } from '@/db';
import { partnerApplications } from '@/lib/db/tables/partnerApplications';
import { insertPartnerApplicationSchema } from '@/lib/db/schemas/partnerApplicationSchema';
import type { z } from 'zod';

export type PartnerApplicationInput = z.infer<
  typeof insertPartnerApplicationSchema
>;

export async function createPartnerApplication(data: PartnerApplicationInput) {
  try {
    // Validate the data
    const validatedData = insertPartnerApplicationSchema.parse(data);

    // Insert the application into the database
    const result = await db
      .insert(partnerApplications)
      .values({
        ...validatedData,
        application_status: 'pending',
        created_at: new Date(),
      })
      .returning();

    return {
      success: true,
      message: 'Application submitted successfully',
      application: result[0],
    };
  } catch (error) {
    console.error('Error creating partner application:', error);
    throw new Error('Failed to submit application');
  }
}
