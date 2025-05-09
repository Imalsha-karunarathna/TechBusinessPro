'use server';

import { validatePasswordResetToken } from '@/lib/tokens';
import { db } from '@/db';
import { users } from '@/lib/db/tables/users';
import { passwordResetTokens } from '@/lib/db/tables/passwordResetTokens';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';

// Validate the reset token
export async function validateToken(token: string) {
  try {
    const result = await validatePasswordResetToken(token);
    return result;
  } catch (error) {
    console.error('Error validating token:', error);
    return { success: false, error: 'Failed to validate token' };
  }
}

// Reset the password
export async function resetPassword(token: string, newPassword: string) {
  try {
    // Validate the token first
    const validation = await validatePasswordResetToken(token);

    if (!validation.success || typeof validation.userId !== 'number') {
      return { success: false, error: 'Invalid user ID' };
    }
    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    // Update the user's password
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, validation.userId));

    // Delete the used token
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, error: 'Failed to reset password' };
  }
}
