'use server';

import PasswordResetEmail from '@/components/email/provider-register-email';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail({
  email,
  resetLink,
  userName,
  companyName = 'Our Platform',
}: {
  email: string;
  resetLink: string;
  userName?: string;
  companyName?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TechMista <info@techmista.com.au>',
      to: email,
      subject: `Reset Your Password for TechMista`,
      react: PasswordResetEmail({
        resetLink,
        userName,
        companyName,
      }),
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
