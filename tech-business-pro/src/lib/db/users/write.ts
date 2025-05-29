import { users } from '@/lib/db/tables/users';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { hash } from 'bcryptjs';
import { getUserByUsername, getUserByEmail } from './read';

interface CreateUserData {
  name: string;
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'solution_provider' | 'solution_seeker' | 'agent';
}

export async function createUser(userData: CreateUserData) {
  try {
    // Check if username or email already exists
    const existingUser = await getUserByUsername(userData.username);
    if (existingUser) {
      return { success: false, error: 'Username already exists' };
    }

    const existingEmail = await getUserByEmail(userData.email);
    if (existingEmail) {
      return { success: false, error: 'Email already exists' };
    }

    // Hash password
    const hashedPassword = await hash(userData.password, 12);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'solution_seeker',
        is_active: true,
        created_at: new Date(),
      })
      .returning();
    /*eslint-disable @typescript-eslint/no-unused-vars */
    const { password, ...userWithoutPassword } = newUser;

    return {
      success: true,
      user: userWithoutPassword,
      message: 'User created successfully',
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

export async function updateUserStatus(userId: number, isActive: boolean) {
  try {
    await db
      .update(users)
      .set({ is_active: isActive })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error('Error updating user status:', error);
    return { success: false, error: 'Failed to update user status' };
  }
}

export async function updateUserRole(userId: number, role: string) {
  try {
    // Validate role
    if (
      !['admin', 'solution_provider', 'solution_seeker', 'agent'].includes(role)
    ) {
      return { success: false, error: 'Invalid role' };
    }

    await db
      .update(users)
      .set({
        role: role as
          | 'admin'
          | 'solution_provider'
          | 'solution_seeker'
          | 'agent',
      })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: 'Failed to update user role' };
  }
}
