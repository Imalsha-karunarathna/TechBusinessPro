interface AgentWelcomeEmailProps {
  username: string;
  email: string;
}

export function AgentWelcomeEmail({ username, email }: AgentWelcomeEmailProps) {
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
          backgroundColor: '#42C3EE',
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
          Congratulations on becoming an Agent!
        </h2>

        <p
          style={{ color: '#666666', lineHeight: '1.6', marginBottom: '20px' }}
        >
          You have successfully registered as an <strong>Agent</strong> on
          TechMista. You&apos;re now part of our exclusive network of
          professionals who connect businesses with the right technology
          solutions.
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
            Your Agent Account Details:
          </h3>
          <p style={{ margin: '5px 0', color: '#666666' }}>
            <strong>Username:</strong> {username}
          </p>
          <p style={{ margin: '5px 0', color: '#666666' }}>
            <strong>Email:</strong> {email}
          </p>
          <p style={{ margin: '5px 0', color: '#666666' }}>
            <strong>Role:</strong> Agent
          </p>
        </div>
        <div
          style={{
            backgroundColor: '#e3f2fd',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px',
          }}
        >
          <h4 style={{ color: '#1976d2', marginTop: '0' }}>Next Steps:</h4>
          <p style={{ color: '#666666', margin: '0' }}>
            Your agent account is now active. Login to access your dashboard and
            start connecting businesses with solutions.
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <a
            href="https://www.techmista.com.au/auth-page"
            style={{
              backgroundColor: '#42C3EE',
              color: 'white',
              padding: '12px 30px',
              textDecoration: 'none',
              borderRadius: '6px',
              display: 'inline-block',
              fontWeight: 'bold',
            }}
          >
            Access Agent Dashboard
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
          Need help getting started? Contact our agent support team.
        </p>
        <p style={{ color: '#999999', margin: '10px 0 0 0', fontSize: '14px' }}>
          © 2024 TechMista. All rights reserved.
        </p>
      </div>
    </div>
  );
}
