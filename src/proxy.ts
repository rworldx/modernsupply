import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 renamed Middleware → Proxy. Redirects locale-less paths to a
// language prefix (/en or /ar), respecting the NEXT_LOCALE cookie.
const LOCALES = ["en", "ar"] as const;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return NextResponse.next();

  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  const locale = cookie === "ar" ? "ar" : "en";

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip api, admin, static assets, and files with extensions.
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
