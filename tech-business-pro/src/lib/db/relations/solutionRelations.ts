import { relations } from "drizzle-orm";
import { conversations, deals, solutionProviders, solutions } from "../schema";

export const solutionRelations = relations(solutions, ({ one, many }) => ({
  provider: one(solutionProviders, {
    fields: [solutions.provider_id],
    references: [solutionProviders.id],
    relationName: "provider_solutions",
  }),
  conversations: many(conversations, {
    relationName: "solution_conversations",
  }),
  deals: many(deals, { relationName: "solution_deals" }),
}));
