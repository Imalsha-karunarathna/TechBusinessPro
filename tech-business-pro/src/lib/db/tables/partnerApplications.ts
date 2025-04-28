import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { statusEnum } from "./enums";

export const partnerApplications = pgTable("partner_applications", {
  id: serial("id").primaryKey(),
  partner_name: text("partner_name").notNull(),
  organization_name: text("organization_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  website: text("website"),
  expertise: text("expertise").notNull(),
  collaboration: text("collaboration").notNull(),
  experience_years: integer("experience_years"),
  reason: text("reason"),
  additional_notes: text("additional_notes"),
  application_status: statusEnum("application_status")
    .default("pending")
    .notNull(),
  reviewer_id: integer("reviewer_id"),
  review_notes: text("review_notes"),
  reviewed_at: timestamp("reviewed_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
