import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { userRoleEnum } from './enums';

// User schema
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: userRoleEnum('role').default('solution_seeker').notNull(),
  avatar_url: text('avatar_url'),
  organization_id: integer('organization_id'),
  is_active: boolean('is_active').default(true).notNull(),
  last_login: timestamp('last_login'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
