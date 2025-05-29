'use server';

import { users } from '@/lib/db/tables/users';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/server-auth';
import { db } from '@/db';
import { cookies } from 'next/headers';
export async function getAllUsers() {
  try {
    await requireAdmin();

    const allUsers = await db.query.users.findMany({
      orderBy: (users, { desc }) => [desc(users.created_at)],
    });

    // Remove password from user objects
    return allUsers.map((user) => {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function updateUserStatus(userId: number, isActive: boolean) {
  try {
    await requireAdmin();

    await db
      .update(users)
      .set({ is_active: isActive })
      .where(eq(users.id, userId));

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error updating user status:', error);
    return { success: false, error: 'Failed to update user status' };
  }
}

export async function updateUserRole(userId: number, role: string) {
  try {
    await requireAdmin();

    // Validate role
    if (
      !['admin', 'solution_provider', 'solution_seeker', 'agent'].includes(role)
    ) {
      return { success: false, error: 'Invalid role' };
    }

    await db
      .update(users)
      .set({
        role: role as
          | 'admin'
          | 'solution_provider'
          | 'solution_seeker'
          | 'agent',
      })
      .where(eq(users.id, userId));

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: 'Failed to update user role' };
  }
}

// interface RegisterSeekerData {
//   name: string;
//   username: string;
//   email: string;
//   password: string;
//   acceptPolicy: boolean;
// }

// export async function registerSeeker(data: RegisterSeekerData) {
//   try {
//     console.log('Registering seeker:', { ...data, password: '[REDACTED]' });

//     // Simulate database save
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     // Send welcome email
//     try {
//       await sendSeekerWelcomeEmail(data.email, data.name, data.username);
//     } catch (emailError) {
//       console.error('Failed to send welcome email:', emailError);
//     }

//     return {
//       success: true,
//       message:
//         'Registration successful! Please check your email for a welcome message.',
//     };
//   } catch (error) {
//     console.error('Registration error:', error);
//     return {
//       success: false,
//       error: 'Registration failed. Please try again.',
//     };
//   }
// }

// export async function getCurrentUser() {
//   try {
//     // Get session cookie
//     const cookieStore = cookies(); // no await here
//     const sessionCookie = (await cookieStore).get('session'); // no await here

//     if (!sessionCookie?.value) {
//       return NextResponse.json(null, { status: 401 });
//     }

//     const userId = Number.parseInt(sessionCookie.value, 10);

//     if (isNaN(userId)) {
//       return NextResponse.json(null, { status: 401 });
//     }

//     // Get user data
//     const user = await getUserById(userId);

//     if (!user) {
//       return NextResponse.json(null, { status: 401 });
//     }

//     // Return user data (excluding password)
//     /* eslint-disable @typescript-eslint/no-unused-vars */
//     const { password: _, ...userWithoutPassword } = user;

//     return NextResponse.json(userWithoutPassword);
//   } catch (error) {
//     console.error('Get user error:', error);
//     return NextResponse.json(
//       { error: 'An error occurred while fetching user data' },
//       { status: 500 },
//     );
//   }
// }

export async function setSessionCookie(userId: number) {
  const cookieStore = await cookies();
  cookieStore.set('session', userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
