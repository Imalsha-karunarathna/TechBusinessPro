import { createInsertSchema } from "drizzle-zod";

import { z } from "zod";
import { deals } from "../tables/deals";

export const insertDealSchema = createInsertSchema(deals).pick({
  conversation_id: true,
  seeker_id: true,
  provider_id: true,
  solution_id: true,
  title: true,
  description: true,
  proposed_amount: true,
  status: true,
  custom_terms: true,
  proposed_timeline: true,
});

export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof deals.$inferSelect;
