"use client";

import { createContext, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";

interface LanguageCtx {
  lang: Lang;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
  /** Switch language, preserving the current path. */
  switchTo: (lang: Lang) => void;
  other: Lang;
}

const Ctx = createContext<LanguageCtx | null>(null);

export function LanguageProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: Lang) => {
    if (next === lang) return;
    // pathname is like /en/cremino -> /ar/cremino
    const rest = pathname.replace(/^\/(en|ar)(?=\/|$)/, "");
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
    router.push(`/${next}${rest || ""}`);
  };

  const value: LanguageCtx = {
    lang,
    isRtl: lang === "ar",
    t: (en, ar) => (lang === "ar" ? ar : en),
    switchTo,
    other: lang === "ar" ? "en" : "ar",
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
