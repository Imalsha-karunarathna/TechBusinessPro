import { Resend } from 'resend';
import { renderAsync } from '@react-email/components';
import React from 'react';
import { AgentWelcomeEmail } from '@/components/email/agent-welcome-email';

const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendSeekerWelcomeEmail(email: string, name: string, username: string) {
//   try {
//     const emailHtml = await renderAsync(React.createElement(SeekerWelcomeEmail, { name, username }))

//     const { data, error } = await resend.emails.send({
//       from: "TechMista <welcome@techmista.com>",
//       to: [email],
//       subject: "Welcome to TechMista - Your Solution Seeker Account is Ready!",
//       html: emailHtml,
//     })

//     if (error) {
//       console.error("Error sending seeker welcome email:", error)
//       throw new Error("Failed to send welcome email")
//     }

//     console.log("Seeker welcome email sent successfully:", data)
//     return { success: true, data }
//   } catch (error) {
//     console.error("Error in sendSeekerWelcomeEmail:", error)
//     throw error
//   }
// }

export async function sendAgentWelcomeEmail(email: string, username: string) {
  try {
    const emailHtml = await renderAsync(
      React.createElement(AgentWelcomeEmail, { username, email }),
    );

    const { data, error } = await resend.emails.send({
      from: `TechMista <no-reply@techmista.com.au>`,
      to: email,
      subject: 'Welcome to TechMista - Your Agent Account is Active!',
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending agent welcome email:', error);
      throw new Error('Failed to send welcome email');
    }

    console.log('Agent welcome email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in sendAgentWelcomeEmail:', error);
    throw error;
  }
}
