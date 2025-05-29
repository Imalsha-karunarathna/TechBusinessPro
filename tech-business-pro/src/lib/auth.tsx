'use client';

import { createContext, type ReactNode, useContext } from 'react';
import {
  useQuery,
  useMutation,
  type UseMutationResult,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '@/app/actions/user-auth';
import {
  AuthResult,
  LoginData,
  RegisterData,
  UserWithoutPassword,
} from './types';

type AuthContextType = {
  user: UserWithoutPassword | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<
    AuthResult<UserWithoutPassword>,
    Error,
    LoginData
  >;
  logoutMutation: UseMutationResult<AuthResult, Error, void>;
  registerMutation: UseMutationResult<
    AuthResult<UserWithoutPassword>,
    Error,
    RegisterData
  >;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery<UserWithoutPassword | null, Error>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loginMutation = useMutation<
    AuthResult<UserWithoutPassword>,
    Error,
    LoginData
  >({
    mutationFn: loginUser,
    onSuccess: (result) => {
      if (result.success && result.user) {
        refetch(); // Refetch user data

        const path =
          result.user.role === 'admin'
            ? '/admin/partner-application'
            : result.user.role === 'solution_provider'
              ? '/solutionProvider'
              : result.user.role === 'solution_seeker'
                ? '/#solutions'
                : result.user.role === 'agent'
                  ? '/agent/dashboard'
                  : '/';

        window.location.href = path;
      } else {
        toast('Login failed', {
          description: result.error || 'Invalid username or password',
        });
      }
    },
    onError: (error: Error) => {
      toast('Login failed', {
        description: error.message || 'Invalid username or password',
      });
    },
  });

  const registerMutation = useMutation<
    AuthResult<UserWithoutPassword>,
    Error,
    RegisterData
  >({
    mutationFn: registerUser,
    onSuccess: (result) => {
      if (result.success) {
        refetch(); // Refetch user data
        toast('Registration successful', {
          description: result.message || 'Your account has been created',
        });
        router.push('/');
      } else {
        toast('Registration failed', {
          description: result.error || 'Could not create account',
        });
      }
    },
    onError: (error: Error) => {
      toast('Registration failed', {
        description: error.message || 'Could not create account',
      });
    },
  });

  const logoutMutation = useMutation<AuthResult, Error, void>({
    mutationFn: logoutUser,
    onSuccess: (result) => {
      if (result.success) {
        refetch(); // This will return null after logout
        toast('Logged out', {
          description: 'You have been logged out successfully',
        });
        router.push('/');
      } else {
        toast('Logout failed', {
          description: result.error || 'Logout failed',
        });
      }
    },
    onError: (error: Error) => {
      toast('Logout failed', {
        description: error.message,
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
