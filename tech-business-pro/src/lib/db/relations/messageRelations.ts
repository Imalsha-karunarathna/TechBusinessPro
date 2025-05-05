import { relations } from 'drizzle-orm';
import { conversations, messages, users } from '../schema';

export const messageRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversation_id],
    references: [conversations.id],
    relationName: 'conversation_messages',
  }),
  sender: one(users, {
    fields: [messages.sender_id],
    references: [users.id],
    relationName: 'sender',
  }),
}));
