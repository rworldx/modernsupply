import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "ms_admin_session";

let cachedSecret: Uint8Array | undefined;

/**
 * The signing key for the admin session cookie.
 *
 * Resolved lazily, on first use, and never at module load. Next.js evaluates
 * route modules during the build's page-data collection step, where runtime
 * secrets are legitimately absent — throwing there fails the build rather than
 * catching a real misconfiguration.
 *
 * The dev fallback lets a fresh clone run without setup. Shipping that fallback
 * to production would publish a forgeable session key: the repo is public, so
 * anyone could read the string and sign themselves an admin cookie. In
 * production a missing AUTH_SECRET is therefore a hard failure at request time.
 */
function sessionSecret(): Uint8Array {
  if (cachedSecret) return cachedSecret;

  const configured = process.env.AUTH_SECRET;

  if (!configured) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "AUTH_SECRET is not set. Generate one with `openssl rand -base64 32` and set it in the deployment environment.",
      );
    }
    cachedSecret = new TextEncoder().encode("insecure-dev-secret-change-me");
    return cachedSecret;
  }

  cachedSecret = new TextEncoder().encode(configured);
  return cachedSecret;
}

/** Verify a username/password against the server-side env credentials. */
export function checkCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME ?? "";
  const p = process.env.ADMIN_PASSWORD ?? "";
  // constant-ish comparison; credentials never leave the server
  return username === u && password === p && u.length > 0 && p.length > 0;
}

export async function createSession(): Promise<void> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(sessionSecret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** Redirect to the login page unless authenticated. Use in guarded admin pages. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

/** Returns true if the current request carries a valid admin session. */
export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}
