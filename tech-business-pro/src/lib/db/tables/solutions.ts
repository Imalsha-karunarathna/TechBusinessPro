import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { solutionCategoryEnum } from './enums';

export const solutions = pgTable('solutions', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: solutionCategoryEnum('category').notNull(),
  provider_id: integer('provider_id').notNull(),
  regions: text('regions').array().notNull(),
  image_url: text('image_url'),
  features: text('features').array(),
  pricing_info: text('pricing_info'),
  is_featured: boolean('is_featured').default(false).notNull(),
  views_count: integer('views_count').default(0).notNull(),
  inquiries_count: integer('inquiries_count').default(0).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
