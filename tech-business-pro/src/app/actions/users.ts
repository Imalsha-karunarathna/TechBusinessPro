'use server';

import { users } from '@/lib/db/tables/users';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/server-auth';
import { db } from '@/db';

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
    if (!['admin', 'solution_provider', 'solution_seeker'].includes(role)) {
      return { success: false, error: 'Invalid role' };
    }

    await db
      .update(users)
      .set({ role: role as 'admin' | 'solution_provider' | 'solution_seeker' })
      .where(eq(users.id, userId));

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: 'Failed to update user role' };
  }
}
