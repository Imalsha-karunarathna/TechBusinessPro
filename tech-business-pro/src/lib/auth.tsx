'use client';

import { createContext, type ReactNode, useContext } from 'react';
import {
  useQuery,
  useMutation,
  type UseMutationResult,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { getQueryFn, apiRequest, queryClient } from '@/lib/queryClient';

import type { User } from './db/schema';
import { toast } from 'sonner';

type LoginData = {
  username: string;
  password: string;
  isAdmin?: boolean;
};

type RegisterData = LoginData & {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ['/api/user'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest('POST', '/api/login', credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      const path =
        user.role === 'admin'
          ? '/admin/partner-application'
          : user.role === 'solution_provider'
            ? '/solutionProvider'
            : user.role === 'solution_seeker'
              ? '/#solutions'
              : user.role === 'agent'
                ? '/agent/dashboard'
                : '/';
      window.location.href = path;
    },

    onError: (error: Error) => {
      toast('Login failed', {
        description: error.message || 'Invalid username or password',
        // variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      const res = await apiRequest('POST', '/api/register', credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(['/api/user'], user);
      toast('Registration successful', {
        description: 'Your account has been created',
      });

      // Redirect to home page after registration
      router.push('/');
    },
    onError: (error: Error) => {
      toast('Registration failed', {
        description: error.message || 'Could not create account',
        // variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/user'], null);
      toast('Logged out', {
        description: 'You have been logged out successfully',
      });

      // Redirect to home page after logout
      router.push('/');
    },
    onError: (error: Error) => {
      toast('Logout failed', {
        description: error.message,
        //  variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
