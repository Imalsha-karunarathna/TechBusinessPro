import { createInsertSchema } from 'drizzle-zod';

import { z } from 'zod';
import { visitorChats } from '../tables/visitorChats';

export const insertVisitorChatSchema = createInsertSchema(visitorChats).pick({
  visitor_id: true,
  conversation_data: true,
});

export type InsertVisitorChat = z.infer<typeof insertVisitorChatSchema>;
export type VisitorChat = typeof visitorChats.$inferSelect;
