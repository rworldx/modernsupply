"use client";

import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";

interface AdminLangCtx {
  lang: Lang;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
  toggle: () => void;
  other: Lang;
}

const Ctx = createContext<AdminLangCtx | null>(null);

export function AdminLangProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const toggle = () => {
    const next: Lang = lang === "ar" ? "en" : "ar";
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    // Re-render server components (page titles etc.) in the new language.
    router.refresh();
  };

  const value: AdminLangCtx = {
    lang,
    isRtl: lang === "ar",
    t: (en, ar) => (lang === "ar" ? ar : en),
    toggle,
    other: lang === "ar" ? "en" : "ar",
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdminLang must be used within AdminLangProvider");
  return ctx;
}
