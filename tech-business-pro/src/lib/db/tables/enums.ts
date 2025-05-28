import { pgEnum } from 'drizzle-orm/pg-core';

// Role enum for user types
export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'solution_provider',
  'solution_seeker',
  'agent',
]);

// Status enum for application statuses
export const statusEnum = pgEnum('status', ['pending', 'approved', 'rejected']);

// Conversation status enum
export const conversationStatusEnum = pgEnum('conversation_status', [
  'active',
  'closed',
  'archived',
]);

// Deal status enum
export const dealStatusEnum = pgEnum('deal_status', [
  'proposed',
  'negotiating',
  'accepted',
  'declined',
  'completed',
]);

// Solution Categories Enum
export const solutionCategoryEnum = pgEnum('solution_category', [
  'website_development',
  'it_security',
  'crm_systems',
  'business_applications',
]);
