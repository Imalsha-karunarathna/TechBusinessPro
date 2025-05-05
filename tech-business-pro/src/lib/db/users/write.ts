import { users } from '@/lib/db/tables/users';
import type { InsertUser, User } from '@/lib/db/schemas/userSchema';
import { hash } from 'bcryptjs';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

export async function createUser(
  userData: Omit<InsertUser, 'password'> & { password: string },
): Promise<User | null> {
  try {
    // Check if username or email already exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, userData.username || userData.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('Username or email already exists');
    }

    // Hash the password
    const hashedPassword = await hash(userData.password, 10);

    // Insert the new user
    const result = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword,
        created_at: new Date(),
      })
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}
