import type * as React from 'react';

interface ForgotPasswordEmailProps {
  resetUrl: string;
  userEmail: string;
}

export const ForgotPasswordEmail = ({
  resetUrl,
  userEmail,
}: ForgotPasswordEmailProps) => (
  <div
    style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
    }}
  >
    {/* Header */}
    <div
      style={{
        background: 'linear-gradient(135deg, #3069FE 0%, #42C3EE 100%)',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: 'white', margin: '0', fontSize: '28px' }}>
        Tech Mista
      </h1>
      <p style={{ color: 'white', margin: '5px 0 0 0', opacity: '0.9' }}>
        Your Technology Solutions Partner
      </p>
    </div>

    {/* Main Content */}
    <div style={{ padding: '40px 30px', background: '#ffffff' }}>
      <h2 style={{ color: '#333', marginBottom: '20px', fontSize: '24px' }}>
        Reset Your Password
      </h2>

      <p
        style={{
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '20px',
          fontSize: '16px',
        }}
      >
        Hello,
      </p>

      <p
        style={{
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '20px',
          fontSize: '16px',
        }}
      >
        We received a request to reset the password for your Tech Mista account
        ({userEmail}). If you didn&apos;t make this request, you can safely
        ignore this email.
      </p>

      <p
        style={{
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '30px',
          fontSize: '16px',
        }}
      >
        To reset your password, click the button below:
      </p>

      {/* CTA Button */}
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <a
          href={resetUrl}
          style={{
            background: 'linear-gradient(135deg, #3069FE 0%, #42C3EE 100%)',
            color: 'white',
            padding: '16px 32px',
            textDecoration: 'none',
            borderRadius: '8px',
            display: 'inline-block',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 4px 12px rgba(48, 105, 254, 0.3)',
          }}
        >
          Reset Password
        </a>
      </div>

      {/* Alternative Link */}
      <div
        style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
        }}
      >
        <p style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>
          If the button doesn&apos;t work, copy and paste this link into your
          browser:
        </p>
        <p
          style={{
            color: '#3069FE',
            wordBreak: 'break-all',
            margin: '0',
            fontSize: '14px',
            fontFamily: 'monospace',
          }}
        >
          {resetUrl}
        </p>
      </div>

      {/* Security Notice */}
      {/* <div
        style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px',
        }}
      >
        <p style={{ color: '#856404', margin: '0', fontSize: '14px' }}>
          <strong>Security Notice:</strong> This link will expire in 1 hour for
          your security. If you need a new reset link, please visit our login
          page and click "Forgot Password" again.
        </p>
      </div> */}

      <p style={{ color: '#999', fontSize: '14px', lineHeight: '1.5' }}>
        If you&apos;re having trouble with your account, please contact our
        support team at{' '}
        <a href="mailto:info@techmista.com.au" style={{ color: '#3069FE' }}>
          info@techmista.com.au
        </a>
      </p>
    </div>

    {/* Footer */}
    <div
      style={{
        background: '#333',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
        © 2024 Tech Mista. All rights reserved.
      </p>
      <p style={{ margin: '0', fontSize: '12px', opacity: '0.8' }}>
        This email was sent to {userEmail}. If you didn&apos;t request this,
        please ignore this email.
      </p>
    </div>
  </div>
);

export default ForgotPasswordEmail;
