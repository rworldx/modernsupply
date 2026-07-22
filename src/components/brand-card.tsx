"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { Brand } from "@/data/brand";
import { useLang } from "@/context/language";
import { accent } from "@/lib/brand-accents";
import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";

/**
 * A row in the brand index — the signature element of the site.
 *
 * Seven brands used to be seven shadowed cards with blurred colour washes, which
 * gave every brand the same weight and told a buyer nothing. As rows they read as
 * what they are: a directory. The brand name is set at display scale, the counts
 * sit in tabular figures on the trailing edge, and a hairline separates each row.
 */
export function BrandCard({
  brand,
  productCount,
  categoryCount,
  index = 0,
}: {
  brand: Brand;
  productCount: number;
  categoryCount: number;
  index?: number;
}) {
  const { lang, t, isRtl } = useLang();
  const Chevron = isRtl ? ChevronLeft : ChevronRight;
  const a = accent(brand.accent);

  const isPlaceholder = brand.originEn === "Coming Soon";
  const isStocked = brand.hasProducts && productCount > 0;

  const status = isPlaceholder
    ? t("Coming soon", "قريباً")
    : isStocked
      ? `${productCount} ${t("products", "منتج")} · ${categoryCount} ${t("categories", "فئة")}`
      : t("Catalogue in preparation", "الكتالوج قيد التجهيز");

  const body = (
    <div
      className={cn(
        "group flex items-center gap-4 border-b border-hairline py-6 sm:gap-6 sm:py-7",
        isPlaceholder && "opacity-55",
      )}
    >
      {/* Brand marks are Latin trademarks — the monogram is always Latin. */}
      <span
        aria-hidden
        className={cn(
          "grid size-12 shrink-0 place-items-center rounded-[var(--radius-md)] text-[1.375rem] font-semibold tracking-[-0.03em] sm:size-14",
          a.soft,
          a.text,
        )}
      >
        {brand.nameEn.charAt(0)}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="t-h2 text-fg">{brand.nameEn}</span>
          {/* Placeholders have no origin yet; "Coming Soon" already says that on
              the trailing edge, so it isn't repeated here. */}
          {!isPlaceholder && (
            <span className="text-[0.9375rem] text-muted">
              {t(brand.originEn, brand.originAr)}
            </span>
          )}
        </span>
        <span className="mt-1 block truncate text-[0.9375rem] text-muted">
          {t(brand.descriptionEn, brand.descriptionAr)}
        </span>
      </span>

      <span className="hidden shrink-0 text-[0.8125rem] tabular-nums text-muted lg:block">
        {status}
      </span>

      {!isPlaceholder && (
        <Chevron
          aria-hidden
          strokeWidth={1.5}
          className={cn(
            "size-5 shrink-0 text-muted",
            "transition-transform duration-[var(--duration-hover)] ease-[var(--ease-out)]",
            isRtl ? "group-hover:-translate-x-1" : "group-hover:translate-x-1",
          )}
        />
      )}
    </div>
  );

  return (
    <li>
      <Reveal delay={Math.min(index * 0.05, 0.3)}>
        {isPlaceholder ? (
          body
        ) : (
          <Link
            href={`/${lang}/${brand.id}`}
            className="block rounded-[var(--radius-sm)] focus-visible:outline-offset-4"
          >
            {body}
          </Link>
        )}
      </Reveal>
    </li>
  );
}
