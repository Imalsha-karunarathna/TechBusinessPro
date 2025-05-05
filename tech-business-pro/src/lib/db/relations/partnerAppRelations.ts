import { relations } from 'drizzle-orm';
import { partnerApplications, users } from '../schema';

export const partnerAppRelations = relations(
  partnerApplications,
  ({ one }) => ({
    reviewer: one(users, {
      fields: [partnerApplications.reviewer_id],
      references: [users.id],
      relationName: 'application_reviewer',
    }),
  }),
);
