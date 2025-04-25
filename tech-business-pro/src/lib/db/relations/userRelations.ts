import { relations } from "drizzle-orm";
import {
  blogPosts,
  contactInquiries,
  conversations,
  deals,
  messages,
  partnerApplications,
  solutionProviders,
  users,
} from "../schema";

export const userRelations = relations(users, ({ one, many }) => ({
  organization: one(solutionProviders, {
    fields: [users.organization_id],
    references: [solutionProviders.id],
    relationName: "user_organization",
  }),
  sentMessages: many(messages, { relationName: "sender" }),
  seekerDeals: many(deals, { relationName: "seeker_deals" }),
  providerDeals: many(deals, { relationName: "provider_deals" }),
  seekerConversations: many(conversations, {
    relationName: "seeker_conversations",
  }),
  providerConversations: many(conversations, {
    relationName: "provider_conversations",
  }),
  authoredPosts: many(blogPosts, { relationName: "post_author" }),
  resolvedInquiries: many(contactInquiries, {
    relationName: "inquiry_resolver",
  }),
  reviewedApplications: many(partnerApplications, {
    relationName: "application_reviewer",
  }),
}));
