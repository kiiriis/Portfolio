import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "portfolio_admin";

export interface SessionData {
  admin?: boolean;
}

export const sessionOptions: SessionOptions = {
  // Must be >= 32 chars. A dev fallback keeps local runs working without .env.
  password:
    process.env.SESSION_SECRET ||
    "dev-only-insecure-session-secret-change-me-please",
  cookieName: SESSION_COOKIE,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 days
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session.admin === true;
}

/** Returns a 401 Response if the caller is not an authenticated admin, else null. */
export async function requireAdmin(): Promise<Response | null> {
  if (await isAdmin()) return null;
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

/** Constant-time password comparison (hash to equal length first). */
export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
