import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { statusEnum } from './enums';
import { solutionProviders } from './solutionProviders';
import { users } from './users';
import { relations } from 'drizzle-orm';

export const providerExpertise = pgTable('provider_expertise', {
  id: serial('id').primaryKey(),
  provider_id: integer('provider_id')
    .notNull()
    .references(() => solutionProviders.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  status: statusEnum('status').default('pending').notNull(),
  reviewer_id: integer('reviewer_id').references(() => users.id),
  review_notes: text('review_notes'),
  reviewed_at: timestamp('reviewed_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Add relations
export const providerExpertiseRelations = relations(
  providerExpertise,
  ({ one }) => ({
    provider: one(solutionProviders, {
      fields: [providerExpertise.provider_id],
      references: [solutionProviders.id],
    }),
    reviewer: one(users, {
      fields: [providerExpertise.reviewer_id],
      references: [users.id],
    }),
  }),
);
