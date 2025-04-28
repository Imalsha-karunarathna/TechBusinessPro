// import {
//   pgTable,
//   text,
//   serial,
//   integer,
//   boolean,
//   timestamp,
//   jsonb,
//   pgEnum,
// } from "drizzle-orm/pg-core";
// import { createInsertSchema } from "drizzle-zod";
// import { relations } from "drizzle-orm";
// import { z } from "zod";

// // Role enum for user types
// export const userRoleEnum = pgEnum("user_role", [
//   "admin",
//   "solution_provider",
//   "solution_seeker",
// ]);

// // Status enum for application statuses
// export const statusEnum = pgEnum("status", ["pending", "approved", "rejected"]);

// // Conversation status enum
// export const conversationStatusEnum = pgEnum("conversation_status", [
//   "active",
//   "closed",
//   "archived",
// ]);

// // Deal status enum
// export const dealStatusEnum = pgEnum("deal_status", [
//   "proposed",
//   "negotiating",
//   "accepted",
//   "declined",
//   "completed",
// ]);

// // Solution Categories Enum
// export const solutionCategoryEnum = pgEnum("solution_category", [
//   "website_development",
//   "it_security",
//   "crm_systems",
//   "business_applications",
//   "other",
// ]);

// // TABLES DEFINITION
// // First define all tables without relations

// // User schema
// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   username: text("username").notNull().unique(),
//   password: text("password").notNull(),
//   name: text("name").notNull(),
//   email: text("email").notNull(),
//   role: userRoleEnum("role").default("solution_seeker").notNull(),
//   avatar_url: text("avatar_url"),
//   organization_id: integer("organization_id"),
//   is_active: boolean("is_active").default(true).notNull(),
//   last_login: timestamp("last_login"),
//   created_at: timestamp("created_at").defaultNow().notNull(),
// });

// // Solution Providers schema
// export const solutionProviders = pgTable("solution_providers", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull(),
//   description: text("description").notNull(),
//   email: text("email").notNull(),
//   website: text("website"),
//   phone: text("phone"),
//   logo_url: text("logo_url"),
//   regions_served: text("regions_served").array(),
//   verification_status: statusEnum("verification_status")
//     .default("pending")
//     .notNull(),
//   approved_date: timestamp("approved_date"),
//   created_at: timestamp("created_at").defaultNow().notNull(),
// });

// // Solutions schema
// export const solutions = pgTable("solutions", {
//   id: serial("id").primaryKey(),
//   title: text("title").notNull(),
//   description: text("description").notNull(),
//   category: solutionCategoryEnum("category").notNull(),
//   provider_id: integer("provider_id").notNull(),
//   regions: text("regions").array().notNull(),
//   image_url: text("image_url"),
//   features: text("features").array(),
//   pricing_info: text("pricing_info"),
//   is_featured: boolean("is_featured").default(false).notNull(),
//   views_count: integer("views_count").default(0).notNull(),
//   inquiries_count: integer("inquiries_count").default(0).notNull(),
//   created_at: timestamp("created_at").defaultNow().notNull(),
//   updated_at: timestamp("updated_at").defaultNow().notNull(),
// });

// // Partner Applications schema
// export const partnerApplications = pgTable("partner_applications", {
//   id: serial("id").primaryKey(),
//   partner_name: text("partner_name").notNull(),
//   organization_name: text("organization_name").notNull(),
//   email: text("email").notNull(),
//   phone: text("phone"),
//   website: text("website"),
//   expertise: text("expertise").notNull(),
//   collaboration: text("collaboration").notNull(),
//   experience_years: integer("experience_years"),
//   reason: text("reason"),
//   additional_notes: text("additional_notes"),
//   application_status: statusEnum("application_status")
//     .default("pending")
//     .notNull(),
//   reviewer_id: integer("reviewer_id"),
//   review_notes: text("review_notes"),
//   reviewed_at: timestamp("reviewed_at"),
//   created_at: timestamp("created_at").defaultNow().notNull(),
// });

// // Contact Inquiries schema
// export const contactInquiries = pgTable("contact_inquiries", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull(),
//   email: text("email").notNull(),
//   phone: text("phone"),
//   inquiry_type: text("inquiry_type").notNull(),
//   subject: text("subject").notNull(),
//   message: text("message").notNull(),
//   solution_type: text("solution_type"),
//   preferred_contact: text("preferred_contact"),
//   ai_response: text("ai_response"),
//   is_resolved: boolean("is_resolved").default(false).notNull(),
//   resolved_by: integer("resolved_by"),
//   resolution_notes: text("resolution_notes"),
//   resolved_at: timestamp("resolved_at"),
//   created_at: timestamp("created_at").defaultNow().notNull(),
// });

// // Blog Posts schema
// export const blogPosts = pgTable("blog_posts", {
//   id: serial("id").primaryKey(),
//   title: text("title").notNull(),
//   content: text("content").notNull(),
//   excerpt: text("excerpt").notNull(),
//   category: text("category").notNull(),
//   author_id: integer("author_id").notNull(),
//   author_name: text("author_name").notNull(),
//   author_image: text("author_image"),
//   image_url: text("image_url"),
//   is_published: boolean("is_published").default(false).notNull(),
//   published_at: timestamp("published_at"),
//   reading_time: integer("reading_time").default(5),
//   views_count: integer("views_count").default(0).notNull(),
//   created_at: timestamp("created_at").defaultNow().notNull(),
//   updated_at: timestamp("updated_at").defaultNow().notNull(),
// });

// // Conversations between solution seekers and providers
// export const conversations = pgTable("conversations", {
//   id: serial("id").primaryKey(),
//   solution_id: integer("solution_id").notNull(),
//   seeker_id: integer("seeker_id").notNull(),
//   provider_id: integer("provider_id").notNull(),
//   status: conversationStatusEnum("status").default("active").notNull(),
//   subject: text("subject").notNull(),
//   last_message_at: timestamp("last_message_at").defaultNow().notNull(),
//   created_at: timestamp("created_at").defaultNow().notNull(),
// });

// // Messages in conversations
// export const messages = pgTable("messages", {
//   id: serial("id").primaryKey(),
//   conversation_id: integer("conversation_id").notNull(),
//   sender_id: integer("sender_id").notNull(),
//   content: text("content").notNull(),
//   attachments: text("attachments").array(),
//   is_read: boolean("is_read").default(false).notNull(),
//   created_at: timestamp("created_at").defaultNow().notNull(),
// });

// // Deals between seekers and providers
// export const deals = pgTable("deals", {
//   id: serial("id").primaryKey(),
//   conversation_id: integer("conversation_id").notNull(),
//   seeker_id: integer("seeker_id").notNull(),
//   provider_id: integer("provider_id").notNull(),
//   solution_id: integer("solution_id").notNull(),
//   title: text("title").notNull(),
//   description: text("description").notNull(),
//   proposed_amount: text("proposed_amount"),
//   final_amount: text("final_amount"),
//   status: dealStatusEnum("status").default("proposed").notNull(),
//   custom_terms: text("custom_terms"),
//   proposed_timeline: text("proposed_timeline"),
//   finalized_timeline: text("finalized_timeline"),
//   created_at: timestamp("created_at").defaultNow().notNull(),
//   updated_at: timestamp("updated_at").defaultNow().notNull(),
//   closed_at: timestamp("closed_at"),
// });

// // Website visitor chats
// export const visitorChats = pgTable("visitor_chats", {
//   id: serial("id").primaryKey(),
//   visitor_id: text("visitor_id").notNull(),
//   is_active: boolean("is_active").default(true).notNull(),
//   conversation_data: jsonb("conversation_data").notNull(),
//   created_at: timestamp("created_at").defaultNow().notNull(),
//   updated_at: timestamp("updated_at").defaultNow().notNull(),
// });

// // Dashboard statistics
// export const statistics = pgTable("statistics", {
//   id: serial("id").primaryKey(),
//   date: timestamp("date").defaultNow().notNull(),
//   visitors_count: integer("visitors_count").default(0).notNull(),
//   solutions_views: integer("solutions_views").default(0).notNull(),
//   conversations_started: integer("conversations_started").default(0).notNull(),
//   deals_proposed: integer("deals_proposed").default(0).notNull(),
//   deals_closed: integer("deals_closed").default(0).notNull(),
//   new_users: integer("new_users").default(0).notNull(),
//   chat_interactions: integer("chat_interactions").default(0).notNull(),
//   search_queries: jsonb("search_queries").default({}).notNull(),
// });

// // NOW DEFINE RELATIONS AFTER ALL TABLES ARE DEFINED

// // User relations
// export const userRelations = relations(users, ({ one, many }) => ({
//   organization: one(solutionProviders, {
//     fields: [users.organization_id],
//     references: [solutionProviders.id],
//     relationName: "user_organization",
//   }),
//   sentMessages: many(messages, { relationName: "sender" }),
//   seekerDeals: many(deals, { relationName: "seeker_deals" }),
//   providerDeals: many(deals, { relationName: "provider_deals" }),
//   seekerConversations: many(conversations, {
//     relationName: "seeker_conversations",
//   }),
//   providerConversations: many(conversations, {
//     relationName: "provider_conversations",
//   }),
//   authoredPosts: many(blogPosts, { relationName: "post_author" }),
//   resolvedInquiries: many(contactInquiries, {
//     relationName: "inquiry_resolver",
//   }),
//   reviewedApplications: many(partnerApplications, {
//     relationName: "application_reviewer",
//   }),
// }));

// // Solution Provider relations
// export const solutionProviderRelations = relations(
//   solutionProviders,
//   ({ many }) => ({
//     solutions: many(solutions, { relationName: "provider_solutions" }),
//     users: many(users, { relationName: "provider_users" }),
//   })
// );

// // Solution relations
// export const solutionRelations = relations(solutions, ({ one, many }) => ({
//   provider: one(solutionProviders, {
//     fields: [solutions.provider_id],
//     references: [solutionProviders.id],
//     relationName: "provider_solutions",
//   }),
//   conversations: many(conversations, {
//     relationName: "solution_conversations",
//   }),
//   deals: many(deals, { relationName: "solution_deals" }),
// }));

// // Partner Application relations
// export const partnerAppRelations = relations(
//   partnerApplications,
//   ({ one }) => ({
//     reviewer: one(users, {
//       fields: [partnerApplications.reviewer_id],
//       references: [users.id],
//       relationName: "application_reviewer",
//     }),
//   })
// );

// // Contact Inquiry relations
// export const contactInquiryRelations = relations(
//   contactInquiries,
//   ({ one }) => ({
//     resolver: one(users, {
//       fields: [contactInquiries.resolved_by],
//       references: [users.id],
//       relationName: "inquiry_resolver",
//     }),
//   })
// );

// // Blog Post relations
// export const blogPostRelations = relations(blogPosts, ({ one }) => ({
//   author: one(users, {
//     fields: [blogPosts.author_id],
//     references: [users.id],
//     relationName: "post_author",
//   }),
// }));

// // Conversation relations
// export const conversationRelations = relations(
//   conversations,
//   ({ one, many }) => ({
//     solution: one(solutions, {
//       fields: [conversations.solution_id],
//       references: [solutions.id],
//       relationName: "solution_conversations",
//     }),
//     seeker: one(users, {
//       fields: [conversations.seeker_id],
//       references: [users.id],
//       relationName: "seeker_conversations",
//     }),
//     provider: one(users, {
//       fields: [conversations.provider_id],
//       references: [users.id],
//       relationName: "provider_conversations",
//     }),
//     messages: many(messages, { relationName: "conversation_messages" }),
//     deal: many(deals, { relationName: "conversation_deal" }),
//   })
// );

// // Message relations
// export const messageRelations = relations(messages, ({ one }) => ({
//   conversation: one(conversations, {
//     fields: [messages.conversation_id],
//     references: [conversations.id],
//     relationName: "conversation_messages",
//   }),
//   sender: one(users, {
//     fields: [messages.sender_id],
//     references: [users.id],
//     relationName: "sender",
//   }),
// }));

// // Deal relations
// export const dealRelations = relations(deals, ({ one }) => ({
//   conversation: one(conversations, {
//     fields: [deals.conversation_id],
//     references: [conversations.id],
//     relationName: "conversation_deal",
//   }),
//   seeker: one(users, {
//     fields: [deals.seeker_id],
//     references: [users.id],
//     relationName: "seeker_deals",
//   }),
//   provider: one(users, {
//     fields: [deals.provider_id],
//     references: [users.id],
//     relationName: "provider_deals",
//   }),
//   solution: one(solutions, {
//     fields: [deals.solution_id],
//     references: [solutions.id],
//     relationName: "solution_deals",
//   }),
// }));

// // CREATE INSERT SCHEMAS AND TYPES
// export const insertUserSchema = createInsertSchema(users).pick({
//   username: true,
//   password: true,
//   name: true,
//   email: true,
//   role: true,
//   avatar_url: true,
//   organization_id: true,
// });

// export type InsertUser = z.infer<typeof insertUserSchema>;
// export type User = typeof users.$inferSelect;

// export const insertSolutionProviderSchema = createInsertSchema(
//   solutionProviders
// ).pick({
//   name: true,
//   description: true,
//   email: true,
//   website: true,
//   phone: true,
//   logo_url: true,
//   regions_served: true,
//   verification_status: true,
// });

// export type InsertSolutionProvider = z.infer<
//   typeof insertSolutionProviderSchema
// >;
// export type SolutionProvider = typeof solutionProviders.$inferSelect;

// export const insertSolutionSchema = createInsertSchema(solutions).pick({
//   title: true,
//   description: true,
//   category: true,
//   provider_id: true,
//   regions: true,
//   image_url: true,
//   features: true,
//   pricing_info: true,
//   is_featured: true,
// });

// export type InsertSolution = z.infer<typeof insertSolutionSchema>;
// export type Solution = typeof solutions.$inferSelect;

// export const insertPartnerApplicationSchema = createInsertSchema(
//   partnerApplications
// ).pick({
//   partner_name: true,
//   organization_name: true,
//   email: true,
//   phone: true,
//   website: true,
//   expertise: true,
//   collaboration: true,
//   experience_years: true,
//   reason: true,
//   additional_notes: true,
// });

// export type InsertPartnerApplication = z.infer<
//   typeof insertPartnerApplicationSchema
// >;
// export type PartnerApplication = typeof partnerApplications.$inferSelect;

// export const insertContactInquirySchema = createInsertSchema(
//   contactInquiries
// ).pick({
//   name: true,
//   email: true,
//   phone: true,
//   inquiry_type: true,
//   subject: true,
//   message: true,
//   solution_type: true,
//   preferred_contact: true,
// });

// export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
// export type ContactInquiry = typeof contactInquiries.$inferSelect;

// export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
//   title: true,
//   content: true,
//   excerpt: true,
//   category: true,
//   author_id: true,
//   author_name: true,
//   author_image: true,
//   image_url: true,
//   is_published: true,
//   published_at: true,
//   reading_time: true,
// });

// export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
// export type BlogPost = typeof blogPosts.$inferSelect;

// export const insertConversationSchema = createInsertSchema(conversations).pick({
//   solution_id: true,
//   seeker_id: true,
//   provider_id: true,
//   subject: true,
//   status: true,
// });

// export type InsertConversation = z.infer<typeof insertConversationSchema>;
// export type Conversation = typeof conversations.$inferSelect;

// export const insertMessageSchema = createInsertSchema(messages).pick({
//   conversation_id: true,
//   sender_id: true,
//   content: true,
//   attachments: true,
// });

// export type InsertMessage = z.infer<typeof insertMessageSchema>;
// export type Message = typeof messages.$inferSelect;

// export const insertDealSchema = createInsertSchema(deals).pick({
//   conversation_id: true,
//   seeker_id: true,
//   provider_id: true,
//   solution_id: true,
//   title: true,
//   description: true,
//   proposed_amount: true,
//   status: true,
//   custom_terms: true,
//   proposed_timeline: true,
// });

// export type InsertDeal = z.infer<typeof insertDealSchema>;
// export type Deal = typeof deals.$inferSelect;

// export const insertVisitorChatSchema = createInsertSchema(visitorChats).pick({
//   visitor_id: true,
//   conversation_data: true,
// });

// export type InsertVisitorChat = z.infer<typeof insertVisitorChatSchema>;
// export type VisitorChat = typeof visitorChats.$inferSelect;
