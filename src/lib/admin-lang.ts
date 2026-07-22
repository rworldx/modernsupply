import "server-only";
import { cookies } from "next/headers";
import type { Lang } from "@/lib/i18n";

// Admin uses a cookie-based locale (no URL prefix), shared with the storefront
// via the same NEXT_LOCALE cookie so the choice is consistent.
export async function getAdminLang(): Promise<Lang> {
  const c = await cookies();
  return c.get("NEXT_LOCALE")?.value === "ar" ? "ar" : "en";
}
