"use client";

import { Toaster } from "sonner";
import type { Lang } from "@/lib/i18n";
import { LanguageProvider } from "@/context/language";
import { CartProvider } from "@/context/cart";
import { ThemeProvider } from "@/context/theme";

export function Providers({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  // Theme is independent of language — it owns only <html data-theme>.
  return (
    <ThemeProvider>
      <LanguageProvider lang={lang}>
        <CartProvider>
          {children}
          <Toaster
            position={lang === "ar" ? "top-left" : "top-right"}
            richColors
            toastOptions={{ style: { fontFamily: "inherit" } }}
          />
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
