'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { updateUserCredentials } from '@/app/actions/reset-token';
import { User, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ResetPasswordFormProps {
  token: string;
  userId: number;
  email: string;
}

export function ResetPasswordForm({ userId, email }: ResetPasswordFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors] = useState<{
    username?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const router = useRouter();

  const validateForm = () => {
    const newErrors: {
      username?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return Object.keys(newErrors).length === 0;
  };

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(Math.min(strength, 5));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateUserCredentials(userId, username, password);

      if (result.success) {
        toast('Account created successfully!', {
          description: 'Your credentials have been set. You can now log in.',
        });

        // Redirect to login page
        router.push('/');
      } else {
        throw new Error(result.error || 'Failed to update credentials');
      }
    } catch (error) {
      console.error('Error updating credentials:', error);
      toast('Error', {
        description:
          'There was a problem setting your credentials. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></div>
          <Input
            id="email"
            value={email}
            disabled
            className="pl-10 bg-muted/50"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          This is your registered email address
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium">
          Username
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <User className="h-4 w-4" />
          </div>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            autoComplete="username"
            className={cn(
              'pl-10',
              errors.username && 'border-red-500 focus-visible:ring-red-500',
            )}
          />
        </div>
        {errors.username && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3" />
            {errors.username}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock className="h-4 w-4" />
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Create a password"
            autoComplete="new-password"
            className={cn(
              'pl-10',
              errors.password && 'border-red-500 focus-visible:ring-red-500',
            )}
          />
        </div>

        {/* Password strength meter */}
        {password && (
          <div className="space-y-1">
            <div className="flex gap-1 h-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={cn(
                    'h-full flex-1 rounded-full transition-all duration-300',
                    passwordStrength >= level
                      ? passwordStrength < 3
                        ? 'bg-red-500'
                        : passwordStrength < 5
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      : 'bg-muted',
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {passwordStrength < 3
                ? 'Weak password'
                : passwordStrength < 5
                  ? 'Good password'
                  : 'Strong password'}
            </p>
          </div>
        )}

        {errors.password && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3" />
            {errors.password}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-sm font-medium">
          Confirm Password
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <CheckCircle className="h-4 w-4" />
          </div>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            autoComplete="new-password"
            className={cn(
              'pl-10',
              errors.confirmPassword &&
                'border-red-500 focus-visible:ring-red-500',
            )}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3" />
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full mt-6 transition-all duration-300 hover:scale-[1.02] bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"
        disabled={isSubmitting}
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Setting up your account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
}
