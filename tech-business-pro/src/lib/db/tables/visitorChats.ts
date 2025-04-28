import {
  boolean,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Website visitor chats
export const visitorChats = pgTable("visitor_chats", {
  id: serial("id").primaryKey(),
  visitor_id: text("visitor_id").notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  conversation_data: jsonb("conversation_data").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
