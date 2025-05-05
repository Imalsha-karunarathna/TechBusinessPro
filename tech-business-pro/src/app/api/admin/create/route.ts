import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { db } from '@/db';
import { users } from '@/lib/db/tables/users';
import { count } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, name, email } = body;

    if (!username || !password || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const adminCount = await db
      .select({ count: count() })
      .from(users)
      .where(sql`users.role = 'admin'`);

    // Check if admin already exists
    if (adminCount[0].count > 0) {
      return NextResponse.json(
        {
          error:
            'Admin already exists. For security reasons, additional admins must be created by an existing admin.',
        },
        { status: 403 },
      );
    }

    const hashedPassword = await hash(password, 10);

    const result = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
        name,
        email,
        role: 'admin',
        created_at: new Date(),
      })
      .returning();
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { password: _, ...userWithoutPassword } = result[0];

    return NextResponse.json({
      message: 'Admin user created successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 },
    );
  }
}
