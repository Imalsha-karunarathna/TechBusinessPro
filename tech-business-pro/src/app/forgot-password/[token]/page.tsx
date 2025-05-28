'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Lock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  Home,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  resetForgotPassword,
  validateResetForgotToken,
} from '@/app/actions/forgot-password-action';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Validate token on component mount
  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setIsValidating(false);
        setIsValidToken(false);
        return;
      }

      try {
        const result = await validateResetForgotToken(token);
        setIsValidToken(result.valid);
        setUserEmail(result.email);
      } catch (error) {
        console.error('Token validation error:', error);
        setIsValidToken(false);
      } finally {
        setIsValidating(false);
      }
    }

    validateToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) return;

    try {
      setIsLoading(true);
      const result = await resetForgotPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (result.success) {
        setIsSubmitted(true);
        toast('Password reset successful', {
          description: result.message,
        });
      } else {
        toast('Error', {
          description: result.error || 'Failed to reset password',
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast('Error', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while validating token
  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#3069FE]" />
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-[#3069FE] hover:underline mb-4"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8 rounded-lg">
              <CardTitle className="text-2xl font-bold flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2" />
                Invalid Reset Link
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-4">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Link Expired or Invalid
                </h3>
                <p className="text-gray-600">
                  This password reset link is invalid or has expired. Please
                  request a new password reset link.
                </p>
                <Button
                  onClick={() => router.push('/auth-page')}
                  className="mt-6 bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:opacity-90 text-white cursor-pointer"
                >
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-[#3069FE] hover:underline mb-4"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-lg">
              <CardTitle className="text-2xl font-bold flex items-center">
                <CheckCircle className="h-6 w-6 mr-2" />
                Password Reset Successful
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Password Updated
                </h3>
                <p className="text-gray-600">
                  Your password has been successfully reset. You can now log in
                  with your new password.
                </p>
                <Button
                  onClick={() => router.push('/auth-page')}
                  className="mt-6 bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:opacity-90 text-white cursor-pointer"
                >
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-[#3069FE] hover:underline mb-4"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="inline-flex items-center justify-center h-12 w-12 ml-4 bg-gradient-to-r from-[#3069FE] to-[#42C3EE] rounded-full mb-6">
            <Lock className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          {/* <p className="mt-2 text-gray-600">Enter your new password below</p> */}
          {userEmail && (
            <p className="mt-1 text-sm text-gray-500">for {userEmail}</p>
          )}
        </div>

        <Card className="border-none shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] text-white p-8 rounded-lg">
            <CardTitle className="text-2xl font-bold">
              Create New Password
            </CardTitle>
            <CardDescription className="text-white/90">
              Choose a strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-gray-500" />
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your new password"
                            {...field}
                            disabled={isLoading}
                            className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE] pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-gray-500" />
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your new password"
                            {...field}
                            disabled={isLoading}
                            className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE] pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Make sure your password is at least 6 characters long and
                    contains a mix of letters, numbers, and symbols.
                  </AlertDescription>
                </Alert>

                <Button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:opacity-90 text-white font-medium rounded-md transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Resetting Password...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Reset Password
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
