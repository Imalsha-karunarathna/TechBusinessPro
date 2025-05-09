import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface PasswordResetEmailProps {
  resetLink: string;
  userName?: string;
  companyName?: string;
}

export const PasswordResetEmail = ({
  resetLink,
  userName = 'there',
  companyName = 'Our Platform',
}: PasswordResetEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <Html>
      <Head />
      <Preview>Reset your password for TechMista</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white p-8 rounded-lg shadow-sm my-8 mx-auto">
            <Heading className="text-2xl font-bold text-gray-800 mb-2">
              Password Reset
            </Heading>
            <Text className="text-gray-600 mb-4">Hi {userName},</Text>
            <Text className="text-gray-600 mb-4">
              We received a request to reset your password for your account at{' '}
              TechMista. Use the button below to set up a new password. This
              link is valid for the next 24 hours.
            </Text>
            <Section className="text-center mb-8">
              <Button
                className="bg-blue-500 px-6 py-3 rounded-md text-white font-medium"
                href={resetLink}
              >
                Reset Your Password
              </Button>
            </Section>
            <Text className="text-gray-600 mb-4">
              If you didn't request this password reset, you can safely ignore
              this email.
            </Text>
            <Text className="text-gray-600 mb-4">
              For security reasons, this link will expire in 24 hours. If you
              need a new password reset link, please make another request.
            </Text>
            <Hr className="border-gray-200 my-6" />
            <Text className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} TechMista. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetEmail;
