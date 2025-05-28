'use server';

import { db } from '@/db';
import { users } from '@/lib/db/tables/users';
import { eq, and, gt } from 'drizzle-orm';
import { z } from 'zod';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import ForgotPasswordEmail from '@/components/email/forgot-password-email';
import { forgotPasswordResets } from '@/lib/db/schema';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export async function requestForgotPasswordReset(
  formData: ForgotPasswordFormData,
) {
  try {
    // Validate request data
    const result = forgotPasswordSchema.safeParse(formData);
    if (!result.success) {
      return {
        success: false,
        error: 'Invalid email address',
        details: result.error.format(),
      };
    }

    const { email } = result.data;

    // Check if user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Always return success to prevent email enumeration attacks
    // But only send email if user actually exists
    if (user.length > 0) {
      // Generate secure random token
      const token = crypto.randomBytes(32).toString('hex');

      // Set expiration to 1 hour from now
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      // Store reset token in database
      await db.insert(forgotPasswordResets).values({
        email,
        token,
        expires_at: expiresAt,
        used: false,
      });

      // Send password reset email
      await sendPasswordResetEmail(email, token);
    }

    return {
      success: true,
      message:
        "If an account with that email exists, we've sent you a password reset link.",
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    return {
      success: false,
      error: 'An error occurred while processing your request',
    };
  }
}

export async function resetForgotPassword(formData: ResetPasswordFormData) {
  try {
    // Validate request data
    const result = resetPasswordSchema.safeParse(formData);
    if (!result.success) {
      return {
        success: false,
        error: 'Invalid request data',
        details: result.error.format(),
      };
    }

    const { token, password } = result.data;

    // Find valid reset token
    const resetRecord = await db
      .select()
      .from(forgotPasswordResets)
      .where(
        and(
          eq(forgotPasswordResets.token, token),
          eq(forgotPasswordResets.used, false),
          gt(forgotPasswordResets.expires_at, new Date()),
        ),
      )
      .limit(1);

    if (!resetRecord.length) {
      return {
        success: false,
        error: 'Invalid or expired reset token',
      };
    }

    const reset = resetRecord[0];

    // Find the user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, reset.email))
      .limit(1);

    if (!user.length) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password
    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.email, reset.email));

    // Mark reset token as used
    await db
      .update(forgotPasswordResets)
      .set({
        used: true,
      })
      .where(eq(forgotPasswordResets.id, reset.id));

    revalidatePath('/auth');

    return {
      success: true,
      message: 'Your password has been reset successfully',
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: 'An error occurred while resetting your password',
    };
  }
}

export async function validateResetForgotToken(token: string) {
  try {
    const resetRecord = await db
      .select()
      .from(forgotPasswordResets)
      .where(
        and(
          eq(forgotPasswordResets.token, token),
          eq(forgotPasswordResets.used, false),
          gt(forgotPasswordResets.expires_at, new Date()),
        ),
      )
      .limit(1);

    return {
      success: resetRecord.length > 0,
      valid: resetRecord.length > 0,
      email: resetRecord.length > 0 ? resetRecord[0].email : null,
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return {
      success: false,
      valid: false,
      email: null,
    };
  }
}

async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create reset URL
    const resetUrl = `${baseUrl}/forgot-password/${token}`;

    const result = await resend.emails.send({
      from: `TechMista <no-reply@techmista.com.au>`,
      to: email,
      subject: 'Reset Your Password - Tech Mista',
      react: ForgotPasswordEmail({ resetUrl, userEmail: email }),
    });

    console.log('Password reset email sent successfully:', result);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}
