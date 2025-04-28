"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminAuthPage() {
  const { user, loginMutation, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    // Add admin role to login request
    loginMutation.mutate({
      ...data,
      isAdmin: true,
    });
  };

  // If user is already logged in and is admin, redirect to admin dashboard
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "admin") {
        router.push("/admin/partner-application");
      } else {
        // If user is logged in but not admin, redirect to home
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  // If user is already authenticated, don't render the form
  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-gray-800 to-gray-900 flex-col justify-center p-16 text-white">
        <h1 className="text-4xl font-bold mb-6">Admin Portal</h1>
        <p className="text-xl mb-8">
          Manage partner applications, users, and system settings.
        </p>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Manage Applications</h3>
              <p className="text-white text-opacity-80">
                Review and process partner applications efficiently.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">User Management</h3>
              <p className="text-white text-opacity-80">
                Oversee user accounts and permissions across the platform.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Secure Administration</h3>
              <p className="text-white text-opacity-80">
                Access advanced controls with enhanced security protocols.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center mb-4">
              <div className="h-10 w-10 bg-gray-800 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xl">TM</span>
              </div>
              <span className="ml-3 text-2xl font-bold">Tech Mista</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="mt-2 text-gray-600">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {error === "unauthorized"
                  ? "You need to be logged in to access that page."
                  : error === "admin_required"
                  ? "You need administrator privileges to access that page."
                  : "An error occurred. Please try again."}
              </AlertDescription>
            </Alert>
          )}

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
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your admin username"
                        {...field}
                        disabled={loginMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={loginMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-6 bg-gray-800 text-white hover:bg-gray-700"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Not an administrator?{" "}
              <a href="/" className="text-gray-700 hover:underline font-medium">
                Return to main site
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
