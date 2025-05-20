'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertTriangle,
  Key,
  UserPlus,
  LogIn,
  Home,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    acceptPolicy: z.boolean().refine((val) => val === true, {
      message: 'You must accept the policy.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('login');
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const registered = searchParams.get('registered');

  // Set active tab to login if user just registered
  useEffect(() => {
    if (registered) {
      setActiveTab('login');
    }
  }, [registered]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptPolicy: false,
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Omit confirmPassword as it's not needed for the API
    /*eslint-disable @typescript-eslint/no-unused-vars */
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  // If user is already logged in, redirect to appropriate page
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'admin') {
        router.push('/admin/partner-application');
      } else if (user.role === 'solution_provider') {
        router.push('/solutionProvider');
      } else {
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, don't render the form
  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-primary-600 to-primary-700 flex-col justify-center p-16 text-black">
        <h1 className="text-4xl font-bold mb-6">Welcome to Tech Mista</h1>
        <p className="text-xl mb-8">
          Your gateway to finding the perfect tech solutions for your business
          needs.
        </p>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Find Solutions</h3>
              <p className="text-black text-opacity-80">
                Browse our curated collection of technology solutions to address
                your business challenges.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Connect with Providers</h3>
              <p className="text-black text-opacity-80">
                Directly connect with solution providers who specialize in your
                specific needs.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Secure and Trusted</h3>
              <p className="text-black text-opacity-80">
                All solution providers are vetted and verified to ensure quality
                and reliability.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mb-4 text-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-[#3069FE] hover:underline"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>
            <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-r from-[#3069FE] to-[#42C3EE] rounded-full mb-6">
              <User className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-gray-600">
              {activeTab === 'login'
                ? 'Sign in to access your account'
                : 'Join our community of tech solution seekers'}
            </p>
          </div>

          {error && (
            <Alert
              variant="destructive"
              className="mb-6 bg-red-50 border border-red-200 text-red-800"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>
                {error === 'unauthorized'
                  ? 'You need to be logged in to access that page.'
                  : error === 'admin_required'
                    ? 'You need administrator privileges to access that page.'
                    : 'An error occurred. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {registered && (
            <Alert className="mb-6 bg-green-50 border border-green-200 text-green-800">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              <AlertDescription>
                Registration successful! Please sign in with your new account.
              </AlertDescription>
            </Alert>
          )}

          <Card className="border-none shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <Tabs
                defaultValue="login"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 rounded-none">
                  <TabsTrigger
                    value="login"
                    className="py-4 data-[state=active]:bg-white  data-[state=active]:text-[#3069FE] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#3069FE] rounded-lg cursor-pointer"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="py-4 data-[state=active]:bg-white data-[state=active]:text-[#3069FE] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#3069FE] rounded-lg cursor-pointer"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </TabsTrigger>
                </TabsList>

                <div className="p-6">
                  <TabsContent value="login" className="mt-0">
                    <Form {...loginForm}>
                      <form
                        onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                Username
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your username"
                                  {...field}
                                  disabled={loginMutation.isPending}
                                  className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel className="flex items-center gap-2">
                                  <Key className="h-4 w-4 text-gray-500" />
                                  Password
                                </FormLabel>
                                <a
                                  href="#"
                                  className="text-sm text-[#3069FE] hover:text-[#3069FE]"
                                >
                                  Forgot password?
                                </a>
                              </div>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  {...field}
                                  disabled={loginMutation.isPending}
                                  className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full py-6 cursor-pointer mt-6 bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:from-[#42C3EE] hover:to-[#3069FE] text-white font-medium rounded-md transition-all duration-200"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <div className="flex items-center justify-center">
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Signing in...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <LogIn className="h-5 w-5 mr-2" />
                              Sign in
                            </div>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  <TabsContent value="register" className="mt-0">
                    <Form {...registerForm}>
                      <form
                        onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={registerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                Full Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your full name"
                                  {...field}
                                  disabled={registerMutation.isPending}
                                  className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                Username
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Choose a username"
                                  {...field}
                                  disabled={registerMutation.isPending}
                                  className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="Enter your email"
                                  {...field}
                                  disabled={registerMutation.isPending}
                                  className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-gray-500" />
                                Password
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Create a password"
                                  {...field}
                                  disabled={registerMutation.isPending}
                                  className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-gray-500" />
                                Confirm Password
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Confirm your password"
                                  {...field}
                                  disabled={registerMutation.isPending}
                                  className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="acceptPolicy"
                          render={({ field }) => (
                            <FormItem className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg mt-6">
                              <div className="flex items-center h-5">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-[#3069FE] border-gray-300 rounded focus:ring-[#3069FE]"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  id="acceptPolicy"
                                />
                              </div>
                              <div className="flex-2 min-w-0">
                                <FormLabel
                                  htmlFor="acceptPolicy"
                                  className="text-sm text-gray-700 font-normal !mt-0 flex flex-wrap items-center whitespace-nowrap"
                                >
                                  I confirm that I have read, understood and
                                  accept the terms and conditions in the
                                  <a
                                    href="/privacy-policy"
                                    target="_blank"
                                    className="text-[#3069FE] underline hover:text-[#3069FE]"
                                    rel="noreferrer"
                                  >
                                    Privacy Policy
                                  </a>
                                </FormLabel>
                                <FormMessage className="text-red-500 mt-1" />
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full py-6 mt-6 cursor-pointer bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:from-[#42C3EE] hover:to-[#3069FE] text-white font-medium rounded-md transition-all duration-200"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <div className="flex items-center justify-center ">
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Creating account...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center ">
                              <UserPlus className="h-5 w-5 mr-2" />
                              Create account
                            </div>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          <div className="mt-8 text-center rounded text-sm text-gray-500">
            <p>
              {activeTab === 'login'
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                type="button"
                onClick={() =>
                  setActiveTab(activeTab === 'login' ? 'register' : 'login')
                }
                className="text-[#3069FE] hover:text-[#3069FE] font-medium "
              >
                {activeTab === 'login' ? 'Register' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
