// 'use server';

// import nodemailer from 'nodemailer';

// // Configure your email transport
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_SERVER_HOST,
//   port: Number(process.env.EMAIL_SERVER_PORT),
//   auth: {
//     user: process.env.EMAIL_SERVER_USER,
//     pass: process.env.EMAIL_SERVER_PASSWORD,
//   },
//   secure: true,
// });

// export async function sendPasswordResetEmail(
//   email: string,
//   name: string,
//   token: string,
// ) {
//   const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

//   const mailOptions = {
//     from: `"Tech Mista" <${process.env.EMAIL_FROM}>`,
//     to: email,
//     subject: 'Welcome to Tech Mista - Set Your Password',
//     text: `
//       Hello ${name},

//       Congratulations! Your application to become a solution provider on Tech Mista has been approved.

//       We've created an account for you. Please set your password by clicking the link below:

//       ${resetUrl}

//       This link will expire in 24 hours.

//       If you have any questions, please contact our support team.

//       Best regards,
//       The Tech Mista Team
//     `,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #4F46E5;">Welcome to Tech Mista!</h2>
//         <p>Hello ${name},</p>
//         <p><strong>Congratulations!</strong> Your application to become a solution provider on Tech Mista has been approved.</p>
//         <p>We've created an account for you. Please set your password by clicking the button below:</p>
//         <div style="text-align: center; margin: 30px 0;">
//           <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Set Your Password</a>
//         </div>
//         <p>Or copy and paste this link in your browser: <a href="${resetUrl}">${resetUrl}</a></p>
//         <p>This link will expire in 24 hours.</p>
//         <p>If you have any questions, please contact our support team.</p>
//         <p>Best regards,<br>The Tech Mista Team</p>
//       </div>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     return { success: true };
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return { success: false, error: 'Failed to send email' };
//   }
// }
