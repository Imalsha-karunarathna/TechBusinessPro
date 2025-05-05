import { createInsertSchema } from 'drizzle-zod';
import { users } from '../schema';
import { z } from 'zod';

// CREATE INSERT SCHEMAS AND TYPES
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  role: true,
  avatar_url: true,
  organization_id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
