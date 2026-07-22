"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ClipboardList, Boxes, LogOut, ExternalLink, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAdminLang } from "@/context/admin-language";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, t, toggle } = useAdminLang();

  const links = [
    { href: "/admin", label: t("Dashboard", "لوحة التحكم"), icon: LayoutDashboard, exact: true },
    { href: "/admin/orders", label: t("Orders", "الطلبات"), icon: ClipboardList },
    { href: "/admin/inventory", label: t("Inventory", "المخزون"), icon: Boxes },
  ];

  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 font-display text-sm font-black text-choc-950">M</span>
          <span className="hidden font-display font-bold sm:block">{t("Admin", "الإدارة")}</span>
        </Link>

        <nav className="mx-auto flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-4",
                active(l.href, l.exact) ? "bg-primary text-primary-fg" : "text-fg/70 hover:bg-surface-2",
              )}
            >
              <l.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{l.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={toggle}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-fg/70 transition-colors hover:bg-surface-2"
            aria-label={t("Switch language", "تبديل اللغة")}
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{t("العربية", "English")}</span>
          </button>
          <a href={`/${lang}`} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm text-fg/70 hover:bg-surface-2 sm:flex">
            <ExternalLink className="h-4 w-4" /> {t("Store", "المتجر")}
          </a>
          <ThemeToggle label={t("Toggle theme", "تبديل السمة")} />
          <button onClick={logout} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-500/10 dark:text-rose-400">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t("Logout", "خروج")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
