import { type NextRequest, NextResponse } from "next/server";
import { validateUserCredentials } from "@/lib/db/users/read";
import { z } from "zod";
import { cookies } from "next/headers";

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  isAdmin: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { username, password, isAdmin } = result.data;

    // Validate credentials
    const user = await validateUserCredentials(username, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // If isAdmin flag is set, verify the user is actually an admin
    if (isAdmin && user.role !== "admin") {
      return NextResponse.json(
        { error: "You do not have administrator privileges" },
        { status: 403 }
      );
    }

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { password: _, ...userWithoutPassword } = user;

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

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
