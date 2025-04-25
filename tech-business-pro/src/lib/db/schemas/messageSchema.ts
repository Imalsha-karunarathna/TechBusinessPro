import { createInsertSchema } from "drizzle-zod";

import { z } from "zod";
import { messages } from "../tables/messages";

export const insertMessageSchema = createInsertSchema(messages).pick({
  conversation_id: true,
  sender_id: true,
  content: true,
  attachments: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
