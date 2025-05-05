import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const contactInquiries = pgTable('contact_inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  inquiry_type: text('inquiry_type').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  solution_type: text('solution_type'),
  preferred_contact: text('preferred_contact'),
  ai_response: text('ai_response'),
  is_resolved: boolean('is_resolved').default(false).notNull(),
  resolved_by: integer('resolved_by'),
  resolution_notes: text('resolution_notes'),
  resolved_at: timestamp('resolved_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
