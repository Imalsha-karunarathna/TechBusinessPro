import {
  integer,
  jsonb,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';

// Dashboard statistics
export const statistics = pgTable('statistics', {
  id: serial('id').primaryKey(),
  date: timestamp('date').defaultNow().notNull(),
  visitors_count: integer('visitors_count').default(0).notNull(),
  solutions_views: integer('solutions_views').default(0).notNull(),
  conversations_started: integer('conversations_started').default(0).notNull(),
  deals_proposed: integer('deals_proposed').default(0).notNull(),
  deals_closed: integer('deals_closed').default(0).notNull(),
  new_users: integer('new_users').default(0).notNull(),
  chat_interactions: integer('chat_interactions').default(0).notNull(),
  search_queries: jsonb('search_queries').default({}).notNull(),
});
