import { relations } from "drizzle-orm";
import { contactInquiries, users } from "../schema";

export const contactInquiryRelations = relations(
  contactInquiries,
  ({ one }) => ({
    resolver: one(users, {
      fields: [contactInquiries.resolved_by],
      references: [users.id],
      relationName: "inquiry_resolver",
    }),
  })
);
