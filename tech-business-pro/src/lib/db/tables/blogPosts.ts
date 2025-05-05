import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt').notNull(),
  category: text('category').notNull(),
  author_id: integer('author_id').notNull(),
  author_name: text('author_name').notNull(),
  author_image: text('author_image'),
  image_url: text('image_url'),
  is_published: boolean('is_published').default(false).notNull(),
  published_at: timestamp('published_at'),
  reading_time: integer('reading_time').default(5),
  views_count: integer('views_count').default(0).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
