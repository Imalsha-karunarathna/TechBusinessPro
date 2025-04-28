import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/auth-page" ||
    path === "/admin-auth-page" ||
    path === "/api/login" ||
    path === "/api/register";

  // Get the session cookie
  const session = request.cookies.get("session")?.value;

  // If the user is not logged in and the path is not public, redirect to login
  if (!session && !isPublicPath) {
    // Redirect admin routes to admin login
    if (path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin-auth-page", request.url));
    }

    // Redirect client routes to client login
    if (path.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth-page", request.url));
    }
  }

  // If the user is logged in and the path is public, redirect to home
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure the paths that should be checked by the middleware
export const config = {
  matcher: [
    "/auth-page",
    "/admin-auth-page",
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/login",
    "/api/register",
  ],
};
