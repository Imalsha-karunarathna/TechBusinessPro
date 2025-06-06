import { users } from '@/lib/db/tables/users';
import { eq } from 'drizzle-orm';
import type { User } from '@/lib/db/schemas/userSchema';
import { db } from '@/db';
import { compare } from 'bcryptjs';

export async function getUserById(id: number): Promise<User | null> {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

export async function getUserByUsername(
  username: string,
): Promise<User | null> {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

export async function validateUserCredentials(
  username: string,
  password: string,
): Promise<User | null> {
  try {
    const user = await getUserByUsername(username);

    if (!user) {
      return null;
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    await db
      .update(users)
      .set({ last_login: new Date() })
      .where(eq(users.id, user.id));

    return user;
  } catch (error) {
    console.error('Error validating user credentials:', error);
    return null;
  }
}

export async function getAllUsers() {
  try {
    const allUsers = await db.query.users.findMany({
      orderBy: (users, { desc }) => [desc(users.created_at)],
    });

    // Remove password from user objects
    return allUsers.map((user) => {
      /*eslint-disable @typescript-eslint/no-unused-vars */
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}
