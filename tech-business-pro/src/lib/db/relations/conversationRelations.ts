import { relations } from 'drizzle-orm';
import { conversations, deals, messages, solutions, users } from '../schema';

export const conversationRelations = relations(
  conversations,
  ({ one, many }) => ({
    solution: one(solutions, {
      fields: [conversations.solution_id],
      references: [solutions.id],
      relationName: 'solution_conversations',
    }),
    seeker: one(users, {
      fields: [conversations.seeker_id],
      references: [users.id],
      relationName: 'seeker_conversations',
    }),
    provider: one(users, {
      fields: [conversations.provider_id],
      references: [users.id],
      relationName: 'provider_conversations',
    }),
    messages: many(messages, { relationName: 'conversation_messages' }),
    deal: many(deals, { relationName: 'conversation_deal' }),
  }),
);
