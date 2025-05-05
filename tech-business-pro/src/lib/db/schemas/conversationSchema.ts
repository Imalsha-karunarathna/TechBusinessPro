import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { conversations } from '../tables/conversations';

export const insertConversationSchema = createInsertSchema(conversations).pick({
  solution_id: true,
  seeker_id: true,
  provider_id: true,
  subject: true,
  status: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
