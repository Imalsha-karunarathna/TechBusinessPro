import { relations } from "drizzle-orm";
import { solutionProviders, solutions, users } from "../schema";

export const solutionProviderRelations = relations(
  solutionProviders,
  ({ many }) => ({
    solutions: many(solutions, { relationName: "provider_solutions" }),
    users: many(users, { relationName: "provider_users" }),
  })
);
