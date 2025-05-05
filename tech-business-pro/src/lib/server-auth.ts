import { cookies } from 'next/headers';
import { getUserById } from '@/lib/db/users/read';
import { redirect } from 'next/navigation';

export async function auth() {
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get('session');

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const userId = Number.parseInt(sessionCookie.value, 10);
    if (isNaN(userId)) {
      return null;
    }

    const user = await getUserById(userId);
    if (!user) {
      return null;
    }

    return {
      user: {
        ...user,
        isAdmin: user.role === 'admin',
      },
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
}

export async function requireAuth(
  redirectTo = '/auth-page?error=unauthorized',
) {
  const session = await auth();

  if (!session?.user) {
    redirect(redirectTo);
  }

  return session;
}

export async function requireAdmin(
  redirectTo = '/admin-auth-page?error=admin_required',
) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect(redirectTo);
  }

  return session;
}
