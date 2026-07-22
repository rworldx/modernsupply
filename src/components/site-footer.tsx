"use client";

import Link from "next/link";
import { Instagram } from "@/components/icons";
import { useLang } from "@/context/language";
import { company, brands, branches } from "@/data/brand";

// Small type, wide gutters, hairline rules. The footer is a directory, so it is
// set as one: four columns of plain links with nothing decorating them.
export function SiteFooter() {
  const { lang, t } = useLang();
  const year = new Date().getFullYear();

  const columns = [
    {
      heading: t("Brands", "البراندات"),
      links: brands.map((b) => ({ label: b.nameEn, href: `/${lang}/${b.id}` })),
    },
    {
      heading: t("Branches", "الفروع"),
      links: branches.map((b) => ({
        label: t(b.nameEn, b.nameAr),
        href: b.mapUrl,
        external: true,
      })),
    },
    {
      heading: t("Ordering", "الطلبات"),
      links: [
        { label: t("Track your order", "تتبع طلبك"), href: `/${lang}/track` },
        { label: t("Review your order", "مراجعة طلبك"), href: `/${lang}/order` },
        {
          label: t("Order on WhatsApp", "اطلب عبر واتساب"),
          href: "https://wa.me/96893806780",
          external: true,
        },
      ],
    },
    {
      heading: t("Company", "الشركة"),
      links: [
        { label: t("About us", "من نحن"), href: `/${lang}/about` },
        { label: t("Contact & branches", "تواصل والفروع"), href: `/${lang}/contact` },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-hairline bg-surface">
      <div className="rail py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.heading}>
              <h2 className="mb-3 text-[0.8125rem] font-semibold text-fg">{col.heading}</h2>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.8125rem] text-muted transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)] hover:text-fg"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[0.8125rem] text-muted transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)] hover:text-fg"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.75rem] text-muted">
            © {year} {t(company.nameEn, company.nameAr)}.{" "}
            {t("All rights reserved.", "جميع الحقوق محفوظة.")}
          </p>
          <div className="flex items-center gap-5 text-[0.75rem] text-muted">
            <span>{t("Sultanate of Oman", "سلطنة عُمان")}</span>
            <a
              href={company.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)] hover:text-fg"
            >
              <Instagram className="size-3.5" />@{company.instagramHandle}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
