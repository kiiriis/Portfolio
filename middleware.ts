import { NextResponse, type NextRequest } from "next/server";

// Lightweight gate: redirects unauthenticated page requests to /login and 401s
// admin API calls early. Full cryptographic verification happens server-side in
// lib/session.ts (admin layout + every /api/admin route call requireAdmin()).
const SESSION_COOKIE = "portfolio_admin";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login endpoint must stay reachable while logged out.
  if (pathname === "/api/admin/login") return NextResponse.next();

  const hasSession = req.cookies.has(SESSION_COOKIE);
  if (hasSession) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
