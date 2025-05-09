import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function InvalidTokenPage() {
  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md ">
        {' '}
        <Card className="border-transparent  bg-gray-300 shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle>Invalid or Expired Token</CardTitle>
            <CardDescription>
              The password reset link you used is either invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="mb-6 text-center">
              Please contact support if you need assistance with your account.
            </p>
            <Button asChild className="bg-blue-500">
              <Link href="/" className="text-white hover:bg-blue-600">
                Return to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
