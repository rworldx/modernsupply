"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/cart";
import { useLang } from "@/context/language";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { lang, t, switchTo, other, isRtl } = useLang();
  const { itemCount, setOpen } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile panel when the route changes. Adjusting state during render
  // is React's documented alternative to an effect for "reset when a prop
  // changes": React discards this render and redoes it before touching the DOM,
  // so the panel never paints open on the new page the way an effect would let it.
  const [panelPath, setPanelPath] = useState(pathname);
  if (pathname !== panelPath) {
    setPanelPath(pathname);
    setMenuOpen(false);
  }

  // Lock the page while the mobile panel covers it.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // Named for their contents, not for vague umbrellas.
  const nav = [
    { href: `/${lang}`, label: t("Home", "الرئيسية") },
    { href: `/${lang}/brands`, label: t("Brands", "البراندات") },
    { href: `/${lang}/track`, label: t("Track order", "تتبع الطلب") },
    { href: `/${lang}/about`, label: t("About", "من نحن") },
    { href: `/${lang}/contact`, label: t("Contact", "تواصل") },
  ];

  const isActive = (href: string) =>
    href === `/${lang}` ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-[var(--z-sticky)]">
      {/* Translucent chrome with content scrolling underneath. The hairline is a
          scroll-edge effect — it only exists once something is behind the bar. */}
      <div
        className={cn(
          "chrome border-b transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)]",
          scrolled ? "border-hairline" : "border-transparent",
        )}
      >
        <div className="rail flex h-12 items-center gap-6">
          <Link
            href={`/${lang}`}
            className="shrink-0 text-[1.0625rem] font-semibold tracking-[-0.02em] text-fg"
          >
            {t("Modern Supply", "الإمداد العصري")}
          </Link>

          <nav className="mx-auto hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "text-[0.8125rem] transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)]",
                  isActive(item.href) ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-1 md:ms-0">
            <button
              onClick={() => switchTo(other)}
              className="hidden rounded-full px-3 py-1.5 text-[0.8125rem] text-muted transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)] hover:text-fg sm:block"
              lang={other}
            >
              {t("العربية", "English")}
            </button>

            <ThemeToggle label={t("Appearance", "المظهر")} />

            <button
              onClick={() => setOpen(true)}
              className="relative grid size-9 place-items-center rounded-full text-fg/80 transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)] hover:text-fg"
              aria-label={t("Open your order", "فتح طلبك")}
            >
              <ShoppingBag className="size-[1.125rem]" strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -end-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 font-mono text-[0.625rem] font-medium tabular-nums text-accent-fg">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-full text-fg/80 transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)] hover:text-fg md:hidden"
              aria-label={t("Menu", "القائمة")}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="size-5" strokeWidth={1.5} />
              ) : (
                <Menu className="size-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel. Links stagger in behind the sheet so the list reads as
          arriving in order rather than appearing all at once. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="chrome fixed inset-x-0 bottom-0 top-12 z-[var(--z-overlay)] overflow-y-auto md:hidden"
          >
            <nav className="rail flex flex-col py-3">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.32,
                    delay: 0.04 + i * 0.035,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "block border-b border-hairline py-4 text-[1.375rem] font-medium tracking-[-0.02em]",
                      isActive(item.href) ? "text-fg" : "text-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <button
                onClick={() => switchTo(other)}
                className={cn(
                  "py-4 text-[1.375rem] font-medium tracking-[-0.02em] text-muted",
                  isRtl ? "text-right" : "text-left",
                )}
                lang={other}
              >
                {t("العربية", "English")}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
