import { relations } from "drizzle-orm";
import { blogPosts, users } from "../schema";

export const blogPostRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.author_id],
    references: [users.id],
    relationName: "post_author",
  }),
}));
