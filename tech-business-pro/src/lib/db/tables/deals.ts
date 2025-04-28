import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { dealStatusEnum } from "./enums";

// Deals between seekers and providers
export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  conversation_id: integer("conversation_id").notNull(),
  seeker_id: integer("seeker_id").notNull(),
  provider_id: integer("provider_id").notNull(),
  solution_id: integer("solution_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  proposed_amount: text("proposed_amount"),
  final_amount: text("final_amount"),
  status: dealStatusEnum("status").default("proposed").notNull(),
  custom_terms: text("custom_terms"),
  proposed_timeline: text("proposed_timeline"),
  finalized_timeline: text("finalized_timeline"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  closed_at: timestamp("closed_at"),
});
