import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { statusEnum } from './enums';

export const solutionProviders = pgTable('solution_providers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  email: text('email').notNull(),
  website: text('website'),
  phone: text('phone'),
  logo_url: text('logo_url'),
  regions_served: text('regions_served').array(),
  verification_status: statusEnum('verification_status')
    .default('pending')
    .notNull(),
  approved_date: timestamp('approved_date'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  user_id: integer('user_id').notNull().unique(),
  application_id: integer('application_id'),
});
