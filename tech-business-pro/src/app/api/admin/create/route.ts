import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/db";
import { users } from "@/lib/db/tables/users";
import { count } from "drizzle-orm"; // Import count for SQL functions
import { sql } from "drizzle-orm"; // Import sql for writing raw queries

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, name, email } = body;

    if (!username || !password || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Corrected query to count the number of admin users
    const adminCount = await db
      .select({ count: count() }) // Count the number of matching rows
      .from(users) // From the users table
      .where(sql`users.role = 'admin'`); // Filter by role using sql

    // Check if admin already exists
    if (adminCount[0].count > 0) {
      return NextResponse.json(
        {
          error:
            "Admin already exists. For security reasons, additional admins must be created by an existing admin.",
        },
        { status: 403 }
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
        role: "admin",
        created_at: new Date(),
      })
      .returning();

    const { password: _, ...userWithoutPassword } = result[0];

    return NextResponse.json({
      message: "Admin user created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}
