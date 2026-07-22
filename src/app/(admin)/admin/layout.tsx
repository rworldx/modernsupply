import type { Metadata } from "next";
import "../../globals.css";
import { fontVars } from "@/lib/fonts";
import { ThemeScript } from "@/context/theme";
import { ThemeProvider } from "@/context/theme";
import { AdminLangProvider } from "@/context/admin-language";
import { getAdminLang } from "@/lib/admin-lang";

export const metadata: Metadata = {
  title: "Admin · Modern Supply",
  robots: { index: false, follow: false },
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getAdminLang();
  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${fontVars} min-h-dvh bg-bg text-fg`}>
        <ThemeProvider>
          <AdminLangProvider lang={lang}>{children}</AdminLangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
