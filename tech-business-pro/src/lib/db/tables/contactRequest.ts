import { DocumentInfo } from '@/lib/types';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const contactRequests = pgTable('contact_requests', {
  id: serial('id').primaryKey(),
  provider_id: integer('provider_id').notNull(),
  provider_name: text('provider_name').notNull(),
  seeker_id: integer('seeker_id').notNull(),
  seeker_name: text('seeker_name').notNull(),
  seeker_email: text('seeker_email').notNull(),
  requirements: text('requirements').notNull(),
  preferred_date: varchar('preferred_date', { length: 30 }).notNull(),
  preferred_time_slot: varchar('preferred_time_slot', { length: 50 }).notNull(),
  urgency: varchar('urgency', { length: 10 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  company_name: varchar('company_name', { length: 100 }),
  budget: varchar('budget', { length: 50 }),
  additional_info: text('additional_info'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  notes: text('notes'),
  read: boolean('read').default(false).notNull(),
  documents: jsonb('documents').$type<DocumentInfo[]>(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type ContactRequest = typeof contactRequests.$inferSelect;
