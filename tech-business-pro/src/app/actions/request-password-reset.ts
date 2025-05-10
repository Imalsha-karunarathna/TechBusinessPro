'use server';

import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from '@/db';
import { passwordResetTokens, users } from '@/lib/db/schema';
import { sendPasswordResetEmail } from './email';

export async function requestPasswordReset(email: string) {
  try {
    // Find the user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return { success: true };
    }

    // Generate a new token
    const token = randomUUID();

    // Set expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Delete any existing tokens for this user
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user.id));

    // Create a new token
    await db.insert(passwordResetTokens).values({
      token,
      userId: user.id,
      expires: expiresAt,
    });

    // Generate the full reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // Send the password reset email
    await sendPasswordResetEmail({
      email: user.email,
      resetLink: resetUrl,
      userName: user.name || undefined,
    });

    return { success: true };
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
