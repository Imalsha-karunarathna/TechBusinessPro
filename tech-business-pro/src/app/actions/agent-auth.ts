'use server';

import { cookies } from 'next/headers';
import { db } from '@/db';
import { users } from '@/lib/db/tables/users';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import { sendAgentWelcomeEmail } from './register-email';

interface RegisterAgentData {
  username: string;
  email: string;
  password: string;
}

export async function getAgentProfile() {
  try {
    // Get the user ID from the session cookie
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get('session');

    if (!sessionCookie?.value) {
      return { success: false, message: 'Not authenticated' };
    }

    const userId = Number.parseInt(sessionCookie.value);

    // Get the user from the database
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Check if the user is an agent or admin
    if (user.role !== 'agent' && user.role !== 'admin') {
      return { success: false, message: 'Not an agent' };
    }

    // Return the agent profile
    return {
      success: true,
      agent: {
        id: String(user.id),
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
    };
  } catch (error) {
    console.error('Error getting agent profile:', error);
    return { success: false, message: 'Error getting agent profile' };
  }
}

export async function registerAgent(data: RegisterAgentData) {
  try {
    // Check if username or email already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { or, eq }) =>
        or(eq(users.username, data.username), eq(users.email, data.email)),
    });

    if (existingUser) {
      return {
        success: false,
        error: 'Username or email already exists',
      };
    }
    const hashedPassword = await hash(data.password, 10);

    // Insert the new user with agent role
    const result = await db
      .insert(users)
      .values({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        name: data.username, // Use username as name initially
        role: 'agent',
      })
      .returning();

    if (!result || result.length === 0) {
      throw new Error('Failed to create agent');
    }

    try {
      await sendAgentWelcomeEmail(data.email, data.username);
    } catch (emailError) {
      console.error('Failed to send agent welcome email:', emailError);
    }

    return {
      success: true,
      message: 'Agent registration successful! Please check your email',
    };
  } catch (error) {
    console.error('Agent registration error:', error);
    return {
      success: false,
      error: 'Registration failed. Please try again.',
    };
  }
}
