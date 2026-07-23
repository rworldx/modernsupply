import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { fontVars } from "@/lib/fonts";
import { isLang, type Lang, dir } from "@/lib/i18n";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { ThemeScript } from "@/components/theme-toggle";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ar" }];
}

const description =
  "Chocolate, fillings, sauces, syrups and ice cream ingredients — imported, stocked and delivered across the Sultanate of Oman since 2014. Cremino, London Chocolate, Torino, Italian Master and Gusto, from one supplier.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://modernsupply.om"),
  title: {
    default: "Modern Supply — الإمداد العصري",
    template: "%s · Modern Supply",
  },
  description,
  icons: { icon: "/favicon.svg" },
  // No `images` here: opengraph-image.tsx and twitter-image.tsx generate the
  // cards and their og:image/twitter:image tags. File-based metadata overrides
  // this object, so listing an image would only be a second thing to keep in sync.
  openGraph: {
    type: "website",
    siteName: "Modern Supply",
    title: "Modern Supply — الإمداد العصري",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern Supply — الإمداد العصري",
    description,
  },
};

// The browser chrome matches the page canvas in both themes — white on light,
// true black on dark — so the address bar never floats over a mismatched edge.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;

  return (
    <html lang={lang} dir={dir(lang)} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${fontVars} min-h-dvh`}>
        <Providers lang={lang}>
          <a href="#main" className="skip-link">
            {lang === "ar" ? "تخطي إلى المحتوى" : "Skip to content"}
          </a>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
