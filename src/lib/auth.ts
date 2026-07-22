import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "ms_admin_session";

// The dev fallback exists so a fresh clone runs without setup. In production it
// would be a forgeable session key — anyone who read this file could sign an
// admin cookie — so a missing AUTH_SECRET is a hard startup failure instead.
function sessionSecret(): Uint8Array {
  const configured = process.env.AUTH_SECRET;

  if (!configured) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "AUTH_SECRET is not set. Generate one with `openssl rand -base64 32` and set it in the environment before starting the server.",
      );
    }
    return new TextEncoder().encode("insecure-dev-secret-change-me");
  }

  return new TextEncoder().encode(configured);
}

const secret = sessionSecret();

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
    .sign(secret);

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
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}
