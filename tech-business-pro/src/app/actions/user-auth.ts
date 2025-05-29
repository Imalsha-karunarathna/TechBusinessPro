'use server';

import { cookies } from 'next/headers';
import { validateUserCredentials, getUserById } from '@/lib/db/users/read';
import { createUser } from '@/lib/db/users/write';
import { sendSeekerWelcomeEmail } from './register-email';
import { users } from '@/lib/db/schema';

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return null;
    }

    const userId = Number.parseInt(sessionCookie.value, 10);

    if (isNaN(userId)) {
      return null;
    }

    const user = await getUserById(userId);

    if (!user) {
      return null;
    }

    // Return user data (excluding password)
    /*eslint-disable @typescript-eslint/no-unused-vars */
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export async function loginUser(credentials: {
  username: string;
  password: string;
  isAdmin?: boolean;
}) {
  try {
    const user = await validateUserCredentials(
      credentials.username,
      credentials.password,
    );

    if (!user) {
      throw new Error('Invalid username or password');
    }

    // If isAdmin flag is set, verify the user is actually an admin
    if (credentials.isAdmin && user.role !== 'admin') {
      throw new Error('You do not have administrator privileges');
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('session', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    /*eslint-disable @typescript-eslint/no-unused-vars */
    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

export async function registerUser(data: {
  name: string;
  username: string;
  email: string;
  password: string;
  acceptPolicy: boolean;
}) {
  try {
    if (!data.acceptPolicy) {
      throw new Error('You must accept the policy');
    }

    const result = await createUser({
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
      role: 'solution_seeker',
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    // Set session cookie
    const cookieStore = cookies();
    (await cookieStore).set({
      name: 'session',
      value: users.id.toString(),
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Send welcome email
    try {
      await sendSeekerWelcomeEmail(data.email, data.name, data.username);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    return {
      success: true,
      user: result.user,
      message:
        'Registration successful! Please check your email for a welcome message.',
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Logout failed' };
  }
}
