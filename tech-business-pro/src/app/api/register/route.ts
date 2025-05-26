import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { createUser } from '@/lib/db/users/write';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const userData = result.data;

    // Create user
    const createUserResult = await createUser(userData);

    if (!createUserResult.success) {
      const statusCode =
        createUserResult.error === 'Username or email already exists'
          ? 409
          : 500;
      return NextResponse.json(
        { error: createUserResult.error },
        { status: statusCode },
      );
    }

    // Set session cookie
    const cookieStore = cookies();
    (await cookieStore).set({
      name: 'session',
      value: String(createUserResult.user.id),
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Return user without password
    const { ...userWithoutPassword } = createUserResult.user;

    return NextResponse.json({
      success: true,
      message: createUserResult.message,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 },
    );
  }
}
