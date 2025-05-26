import { users } from '@/lib/db/tables/users';
import type { InsertUser, User } from '@/lib/db/schemas/userSchema';
import { hash } from 'bcryptjs';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { sendSeekerWelcomeEmail } from '@/app/actions/register-email';

type CreateUserResult =
  | {
      success: true;
      message: string;
      user: User;
    }
  | {
      success: false;
      error: string;
    };

export async function createUser(
  userData: Omit<InsertUser, 'password'> & { password: string },
): Promise<CreateUserResult> {
  try {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, userData.username || userData.email));

    if (existingUser.length > 0) {
      return {
        success: false,
        error: 'Username or email already exists',
      };
    }

    const hashedPassword = await hash(userData.password, 10);

    const result = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword,
        created_at: new Date(),
      })
      .returning();

    if (!result || result.length === 0) {
      throw new Error('Failed to create user');
    }

    const newUser = result[0];

    // Send welcome email (don't fail registration if email fails)
    try {
      await sendSeekerWelcomeEmail(
        userData.email,
        userData.name,
        userData.username,
      );
    } catch (emailError) {
      console.error('Failed to send seeker welcome email:', emailError);
    }

    return {
      success: true,
      message:
        'Seeker registration successful! Please check your email for a welcome message.',
      user: newUser,
    };
  } catch (error) {
    console.error('Seeker registration error:', error);
    return {
      success: false,
      error: 'Registration failed. Please try again.',
    };
  }
}
