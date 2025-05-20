'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  CheckCircle2,
  User,
  Mail,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { registerAgent } from '@/app/actions/agent-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function RegisterAgentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const result = await registerAgent({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/agent/login');
        }, 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] text-white p-6 rounded-xl">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-800" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl font-bold">
              Become an Agent
            </CardTitle>
            <CardDescription className="text-center text-white text-opacity-90">
              Join our global network of business agents
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-8">
            {success ? (
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <p className="text-green-700">
                  Registration successful! Redirecting to login...
                </p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5 mt-6">
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-[#3069FE] focus:ring-[#3069FE]"
                    placeholder="Username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-[#3069FE] focus:ring-[#3069FE]"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-[#3069FE] focus:ring-[#3069FE]"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-purple-400 focus:ring-[#3069FE]"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:from-[#42C3EE] hover:to-[#3069FE] text-white font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Processing...' : 'Register as Agent'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="p-6 pt-0 text-center">
            <p className="text-sm text-gray-600">
              Already have an agent account?{' '}
              <Link
                href="/agent/login"
                className="font-medium text-[#3069FE] hover:text-[#3069FE] transition-colors"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            By registering, you agree to our{' '}
            <Link href="/terms" className="text-[#3069FE] hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[#3069FE] hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
