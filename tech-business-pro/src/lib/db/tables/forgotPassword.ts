import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export const forgotPasswordResets = pgTable('password_resets', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expires_at: timestamp('expires_at').notNull(),
  used: boolean('used').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
