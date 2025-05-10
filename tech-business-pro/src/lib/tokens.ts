'use server';

import { db } from '@/db';
import { passwordResetTokens } from '@/lib/db/tables/passwordResetTokens';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

// Function to generate a password reset token
export async function generatePasswordResetToken(userId: number) {
  try {
    // First, delete any existing tokens for this user
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, userId));

    // Generate a unique token
    const token = randomUUID();

    // Set expiry to 24 hours from now
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Store the token in the database
    await db.insert(passwordResetTokens).values({
      token,
      userId,
      expires,
    });

    return token;
  } catch (error) {
    console.error('Error generating password reset token:', error);
    throw error;
  }
}

// Function to validate a password reset token
export async function validatePasswordResetToken(token: string) {
  try {
    const storedToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });

    if (!storedToken) {
      return { success: false, error: 'Invalid token' };
    }

    // Check if token is expired
    if (new Date() > storedToken.expires) {
      // Delete the expired token
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.token, token));

      return { success: false, error: 'Token expired' };
    }

    return { success: true, userId: storedToken.userId };
  } catch (error) {
    console.error('Error validating password reset token:', error);
    return { success: false, error: 'Failed to validate token' };
  }
}
