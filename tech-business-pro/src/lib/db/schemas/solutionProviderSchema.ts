import { createInsertSchema } from 'drizzle-zod';
import { solutionProviders } from '../schema';
import { z } from 'zod';

export const insertSolutionProviderSchema = createInsertSchema(
  solutionProviders,
).pick({
  id: true,
  name: true,
  description: true,
  email: true,
  website: true,
  phone: true,
  logo_url: true,
  regions_served: true,
  verification_status: true,
  user_id: true,
});

export type InsertSolutionProvider = z.infer<
  typeof insertSolutionProviderSchema
>;
export type SolutionProvider = typeof solutionProviders.$inferSelect;
export type NewSolutionProvider = z.infer<typeof insertSolutionProviderSchema>;
