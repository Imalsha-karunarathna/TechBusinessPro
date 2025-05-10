import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { partnerApplications } from '../tables/partnerApplications';

export const insertPartnerApplicationSchema = createInsertSchema(
  partnerApplications,
).pick({
  partner_name: true,
  organization_name: true,
  email: true,
  phone: true,
  website: true,
  expertise: true,
  collaboration: true,
  experience_years: true,
  reason: true,
  additional_notes: true,
});

export type InsertPartnerApplication = z.infer<
  typeof insertPartnerApplicationSchema
>;
export type PartnerApplication = typeof partnerApplications.$inferSelect;
