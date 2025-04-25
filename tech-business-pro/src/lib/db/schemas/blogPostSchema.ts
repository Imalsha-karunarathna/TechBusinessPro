import { createInsertSchema } from "drizzle-zod";

import { z } from "zod";
import { blogPosts } from "../tables/blogPosts";

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  content: true,
  excerpt: true,
  category: true,
  author_id: true,
  author_name: true,
  author_image: true,
  image_url: true,
  is_published: true,
  published_at: true,
  reading_time: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
