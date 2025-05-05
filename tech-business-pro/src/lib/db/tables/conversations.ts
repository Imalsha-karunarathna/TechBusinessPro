import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { conversationStatusEnum } from './enums';

// Conversations between solution seekers and providers
export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  solution_id: integer('solution_id').notNull(),
  seeker_id: integer('seeker_id').notNull(),
  provider_id: integer('provider_id').notNull(),
  status: conversationStatusEnum('status').default('active').notNull(),
  subject: text('subject').notNull(),
  last_message_at: timestamp('last_message_at').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
