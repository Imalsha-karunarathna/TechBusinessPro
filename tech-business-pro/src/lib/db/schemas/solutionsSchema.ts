import { createInsertSchema } from 'drizzle-zod';
import { solutions } from '../schema';
import { z } from 'zod';

export const insertSolutionSchema = createInsertSchema(solutions).pick({
  title: true,
  description: true,
  category: true,
  provider_id: true,
  regions: true,
  image_url: true,
  features: true,
  pricing_info: true,
  is_featured: true,
});

export type InsertSolution = z.infer<typeof insertSolutionSchema>;
export type Solution = typeof solutions.$inferSelect;
