interface SeekerWelcomeEmailProps {
  name: string;
  username: string;
}

export function SeekerWelcomeEmail({
  name,
  username,
}: SeekerWelcomeEmailProps) {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          backgroundColor: '#3069FE',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: 'white', margin: '0', fontSize: '28px' }}>
          Welcome to TechMista!
        </h1>
      </div>

      <div style={{ padding: '40px 20px', backgroundColor: '#ffffff' }}>
        <h2 style={{ color: '#333333', marginBottom: '20px' }}>
          Congratulations, {name}!
        </h2>

        <p
          style={{ color: '#666666', lineHeight: '1.6', marginBottom: '20px' }}
        >
          You have successfully registered as a <strong>Solution Seeker</strong>{' '}
          on TechMista. We&apos;re excited to help you find the perfect
          technology solutions for your business needs.
        </p>

        <div
          style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ color: '#333333', marginTop: '0' }}>
            Your Account Details:
          </h3>
          <p style={{ margin: '5px 0', color: '#666666' }}>
            <strong>Username:</strong> {username}
          </p>
          <p style={{ margin: '5px 0', color: '#666666' }}>
            <strong>Role:</strong> Solution Seeker
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <a
            href="https://www.techmista.com.au/auth-page"
            style={{
              backgroundColor: '#3069FE',
              color: 'white',
              padding: '12px 30px',
              textDecoration: 'none',
              borderRadius: '6px',
              display: 'inline-block',
              fontWeight: 'bold',
            }}
          >
            Login to Your Account
          </a>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#999999', margin: '0', fontSize: '14px' }}>
          If you have any questions, feel free to contact our support team.
        </p>
        <p style={{ color: '#999999', margin: '10px 0 0 0', fontSize: '14px' }}>
          © 2024 TechMista. All rights reserved.
        </p>
      </div>
    </div>
  );
}
