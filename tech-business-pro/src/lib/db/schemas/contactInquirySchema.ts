import { createInsertSchema } from "drizzle-zod";

import { z } from "zod";
import { contactInquiries } from "../tables/contactInquiries";

export const insertContactInquirySchema = createInsertSchema(
  contactInquiries
).pick({
  name: true,
  email: true,
  phone: true,
  inquiry_type: true,
  subject: true,
  message: true,
  solution_type: true,
  preferred_contact: true,
});

export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
