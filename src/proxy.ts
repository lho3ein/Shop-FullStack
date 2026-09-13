import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get(
    process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token"
  );

  const { pathname } = request.nextUrl;

  // Protected routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/admin")
  ) {
    if (!sessionToken) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url)
      );
    }
  }

  // Redirect logged-in users away from auth pages
  if ((pathname.startsWith("/login") || pathname.startsWith("/register")) && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/checkout", "/admin/:path*", "/login", "/register"],
};