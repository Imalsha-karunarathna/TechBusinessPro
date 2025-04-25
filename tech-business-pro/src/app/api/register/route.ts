import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { z } from "zod";
import { createUser } from "@/lib/db/users/write";

const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  name: z.string().min(2),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 }
      );
    }

    const userData = result.data;

    try {
      // Create user
      const user = await createUser(userData);

      if (!user) {
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }

      // Set session cookie
      const cookieStore = cookies();
      (await cookieStore).set({
        name: "session",
        value: String(user.id),
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      // Return user data (excluding password)
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json(userWithoutPassword);
    } catch (error: any) {
      if (error.message === "Username or email already exists") {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
      throw error;
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
