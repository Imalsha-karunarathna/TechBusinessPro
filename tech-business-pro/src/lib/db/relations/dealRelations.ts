import { relations } from 'drizzle-orm';
import { conversations, deals, solutions, users } from '../schema';

export const dealRelations = relations(deals, ({ one }) => ({
  conversation: one(conversations, {
    fields: [deals.conversation_id],
    references: [conversations.id],
    relationName: 'conversation_deal',
  }),
  seeker: one(users, {
    fields: [deals.seeker_id],
    references: [users.id],
    relationName: 'seeker_deals',
  }),
  provider: one(users, {
    fields: [deals.provider_id],
    references: [users.id],
    relationName: 'provider_deals',
  }),
  solution: one(solutions, {
    fields: [deals.solution_id],
    references: [solutions.id],
    relationName: 'solution_deals',
  }),
}));
