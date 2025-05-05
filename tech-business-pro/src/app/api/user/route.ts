import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById } from '@/lib/db/users/read';

export async function GET() {
  try {
    // Get session cookie
    const cookieStore = cookies(); // no await here
    const sessionCookie = (await cookieStore).get('session'); // no await here

    if (!sessionCookie?.value) {
      return NextResponse.json(null, { status: 401 });
    }

    const userId = Number.parseInt(sessionCookie.value, 10);

    if (isNaN(userId)) {
      return NextResponse.json(null, { status: 401 });
    }

    // Get user data
    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json(null, { status: 401 });
    }

    // Return user data (excluding password)
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching user data' },
      { status: 500 },
    );
  }
}
