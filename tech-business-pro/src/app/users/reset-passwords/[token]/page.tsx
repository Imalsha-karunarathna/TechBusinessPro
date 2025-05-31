import { verifyResetToken } from '@/app/actions/reset-token';
import { ResetPasswordForm } from './reset-password-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { Shield } from 'lucide-react';

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = await params;
  const { token } = resolvedParams;
  const tokenVerification = await verifyResetToken(token);

  if (!tokenVerification.valid) {
    // Redirect to an error page or home page
    redirect('/users/invalid-token');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md ">
        <Card className="border-transparent  bg-gray-300 shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex justify-center mb-6 ">
              <div className="bg-primary/10 p-3 rounded-full">
                <Shield className="h-10 w-10 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Set Your Credentials
            </CardTitle>
            <CardDescription className="text-center">
              Welcome to our platform! Create your account credentials to get
              started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm
              token={token}
              userId={tokenVerification.userId as number}
              email={tokenVerification.email || ''}
            />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Need help? Contact our support team at info@techmista.com.au
        </p>
      </div>
    </div>
  );
}
