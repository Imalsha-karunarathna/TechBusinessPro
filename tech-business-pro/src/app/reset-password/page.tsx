'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateToken, resetPassword } from './actions';

const passwordResetSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Validate the token when the component mounts
  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setError('Missing reset token');
        setIsValidating(false);
        return;
      }

      try {
        const result = await validateToken(token);
        if (result.success) {
          setIsTokenValid(true);
        } else {
          setError(result.error || 'Invalid or expired token');
        }
      } catch (err) {
        setError('An error occurred while validating your token');
      } finally {
        setIsValidating(false);
      }
    }

    checkToken();
  }, [token]);

  const onSubmit = async (data: PasswordResetFormValues) => {
    if (!token) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await resetPassword(token, data.password);

      if (result.success) {
        setSuccess(true);
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/auth?reset=success');
        }, 3000);
      } else {
        setError(result.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred while resetting your password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Validating your request</CardTitle>
            <CardDescription>
              Please wait while we validate your password reset token...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            {isTokenValid
              ? 'Please enter your new password below'
              : 'There was a problem with your reset link'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
              <AlertDescription>
                Your password has been reset successfully! You will be
                redirected to the login page.
              </AlertDescription>
            </Alert>
          )}

          {isTokenValid && !success && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your new password"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your new password"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {!isTokenValid && (
            <Button variant="outline" onClick={() => router.push('/auth')}>
              Back to Login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
