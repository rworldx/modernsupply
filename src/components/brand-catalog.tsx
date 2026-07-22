"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import type { CatalogProduct } from "@/lib/types";
import { useLang } from "@/context/language";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Cat {
  id: string;
  nameEn: string;
  nameAr: string;
  count: number;
}

export function BrandCatalog({
  products,
  categories,
}: {
  products: CatalogProduct[];
  categories: Cat[];
}) {
  const { t } = useLang();
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (active !== "all" && p.categoryId !== active) return false;
      if (!q) return true;
      return (
        p.nameEn.toLowerCase().includes(q) ||
        p.nameAr.includes(query.trim()) ||
        p.categoryNameEn.toLowerCase().includes(q)
      );
    });
  }, [products, active, query]);

  const activeName =
    active === "all"
      ? t("All products", "كل المنتجات")
      : (() => {
          const c = categories.find((x) => x.id === active);
          return c ? t(c.nameEn, c.nameAr) : t("All products", "كل المنتجات");
        })();

  return (
    <div>
      {/* Filter bar: category rail on one line, search on the trailing edge. */}
      <div className="sticky top-12 z-[var(--z-sticky)] -mx-5 mb-10 border-b border-hairline bg-bg/85 px-5 backdrop-blur-xl sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:gap-6">
          {/* 17 categories don't fit on one line at any width, so the rail
              scrolls and the trailing edge fades — the cut reads as "there is
              more" instead of as a clipped element. */}
          <div className="no-scrollbar -mx-5 flex gap-6 overflow-x-auto px-5 [mask-image:linear-gradient(to_right,transparent_0,black_1.25rem,black_calc(100%-2rem),transparent_100%)] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-1 lg:px-0 lg:[mask-image:linear-gradient(to_right,black_calc(100%-3rem),transparent_100%)] rtl:[mask-image:linear-gradient(to_left,transparent_0,black_1.25rem,black_calc(100%-2rem),transparent_100%)] rtl:lg:[mask-image:linear-gradient(to_left,black_calc(100%-3rem),transparent_100%)]">
            <Tab
              active={active === "all"}
              onClick={() => setActive("all")}
              label={t("All", "الكل")}
              count={products.length}
            />
            {categories.map((c) => (
              <Tab
                key={c.id}
                active={active === c.id}
                onClick={() => setActive(c.id)}
                label={t(c.nameEn, c.nameAr)}
                count={c.count}
              />
            ))}
          </div>

          <div className="relative shrink-0 lg:w-72">
            <Search
              strokeWidth={1.5}
              className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Search this catalogue", "ابحث في هذا الكتالوج")}
              aria-label={t("Search this catalogue", "ابحث في هذا الكتالوج")}
              className={cn(
                "h-10 w-full rounded-[var(--radius-pill)] border border-transparent bg-surface ps-10 pe-9 text-[0.9375rem]",
                "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)]",
                "placeholder:text-muted focus-visible:border-fg/25 focus-visible:outline-none",
              )}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label={t("Clear search", "مسح البحث")}
                className="absolute end-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-fg"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mx-auto max-w-sm py-24 text-center">
          <h3 className="t-h3">{t("Nothing matches that", "لا توجد نتائج مطابقة")}</h3>
          <p className="mt-2 text-[0.9375rem] text-muted">
            {t(
              `No product in ${activeName} matches “${query}”.`,
              `لا يوجد منتج في ${activeName} يطابق «${query}».`,
            )}
          </p>
          <Button
            variant="surface"
            className="mt-6"
            onClick={() => {
              setQuery("");
              setActive("all");
            }}
          >
            {t("Show all products", "عرض كل المنتجات")}
          </Button>
        </div>
      ) : (
        /* No layout animation on the grid itself: with 64 products a container
           layout transition animates height, which is a layout property and
           janks on mid-range phones. The only thing that moves between filters
           is the tab underline, and that one is worth it. */
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Underlined tab, the way a store's category rail reads — not a pill. */
function Tab({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative shrink-0 whitespace-nowrap pb-1 text-[0.9375rem]",
        "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)]",
        active ? "text-fg" : "text-muted hover:text-fg",
      )}
    >
      {label}
      <span className="ms-1.5 text-[0.75rem] tabular-nums text-muted">{count}</span>
      {active && (
        <motion.span
          layoutId="catalogue-tab"
          className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-fg"
          transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
        />
      )}
    </button>
  );
}
