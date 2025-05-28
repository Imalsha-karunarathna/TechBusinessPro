'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Mail, ArrowLeft, CheckCircle, Loader2, Home } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  type ForgotPasswordFormData,
  requestForgotPasswordReset,
} from '@/app/actions/forgot-password-action';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      const result = await requestForgotPasswordReset(data);

      if (result.success) {
        setIsSubmitted(true);
        toast('Email sent', {
          description: result.message,
        });
      } else {
        toast('Error', {
          description: result.error || 'Failed to send reset email',
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast('Error', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <CardHeader className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] text-white p-8">
              <CardTitle className="text-2xl font-bold flex items-center">
                <CheckCircle className="h-6 w-6 mr-2" />
                Check Your Email
              </CardTitle>
              <CardDescription className="text-white/90">
                We&apos;ve sent you a password reset link
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Email Sent Successfully
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  If an account with that email exists, we&apos;ve sent you a
                  password reset link. Please check your email and follow the
                  instructions to reset your password.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-blue-800">
                    <strong>Didn&apos;t receive the email?</strong> Check your
                    spam folder or try again in a few minutes.
                  </p>
                </div>
                <Button
                  onClick={() => (window.location.href = '/auth')}
                  variant="outline"
                  className="mt-6"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-r from-[#3069FE] to-[#42C3EE] rounded-full mb-6">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-gray-600">
            Enter your email address and we&apos;ll send you a reset link
          </p>
        </div>

        <Card className="border-none shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] text-white p-8 rounded-xl">
            <CardTitle className="text-2xl font-bold">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-white/90">
              Enter your email address and we&apos;ll send you a reset link
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          {...field}
                          disabled={isLoading}
                          className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:opacity-90 text-white font-medium rounded-md transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending Reset Link...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Reset Link
                      </div>
                    )}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => (window.location.href = '/auth')}
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
