import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Only protect dashboard routes
  if (!pathname.startsWith("/dashboard")) return NextResponse.next();

  // Check if session cookie exists
  const sessionCookie = req.cookies.get("session")?.value;

  if (!sessionCookie) {
    // No session, redirect to login
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `from=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  // Session exists, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"]
};
