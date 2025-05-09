'use server';

import { eq } from 'drizzle-orm';
import { randomBytes, randomUUID } from 'crypto';
import { hash } from 'bcryptjs';
import { db } from '@/db';
import { passwordResetTokens, users } from '@/lib/db/schema';
import { sendPasswordResetEmail } from './email';

// Function to generate a random username based on email
function generateRandomUsername(email: string): string {
  const prefix = email.split('@')[0];
  const randomSuffix = randomBytes(4).toString('hex');
  return `${prefix}_${randomSuffix}`;
}

// Function to generate a random password
function generateRandomPassword(): string {
  return randomBytes(12).toString('hex');
}

// Function to create a user and generate a reset token
export async function createUserWithResetToken(
  email: string,
  name: string,
  organizationName: string,
) {
  try {
    // Generate random username and password
    const username = generateRandomUsername(email);
    const randomPassword = generateRandomPassword();

    // Hash the password for storage
    const hashedPassword = await hash(randomPassword, 10);

    // Create the user
    const [newUser] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
        name,
        email,
        role: 'solution_provider',
        is_active: true,
      })
      .returning({ id: users.id });

    if (!newUser) {
      throw new Error('Failed to create user');
    }

    const token = randomUUID();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.insert(passwordResetTokens).values({
      token,
      userId: newUser.id,
      expires: expiresAt,
    });

    // Generate the full reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/users/reset-passwords/${token}`;

    // Send the password reset email
    await sendPasswordResetEmail({
      email,
      resetLink: resetUrl,
      userName: name,
      companyName: organizationName,
    });

    console.log('Reset URL:', resetUrl);
    return {
      success: true,
      userId: newUser.id,
      resetUrl,
    };
  } catch (error) {
    console.error('Error creating user with reset token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function verifyResetToken(token: string) {
  try {
    // First, find the token
    const resetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });

    if (!resetToken) {
      return { valid: false, error: 'Invalid token' };
    }

    if (new Date(resetToken.expires) < new Date()) {
      return { valid: false, error: 'Token has expired' };
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, resetToken.userId),
      columns: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return { valid: false, error: 'User not found' };
    }

    return {
      valid: true,
      userId: resetToken.userId,
      email: user.email,
    };
  } catch (error) {
    console.error('Error verifying reset token:', error);
    return { valid: false, error: 'Error verifying token' };
  }
}

// Function to update user credentials
export async function updateUserCredentials(
  userId: number,
  username: string,
  password: string,
) {
  try {
    // Hash the new password
    const hashedPassword = await hash(password, 10);

    // Update the user
    await db
      .update(users)
      .set({
        username,
        password: hashedPassword,
      })
      .where(eq(users.id, userId));

    // Delete the used token
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, userId));

    return { success: true };
  } catch (error) {
    console.error('Error updating user credentials:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
