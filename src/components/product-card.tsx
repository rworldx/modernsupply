"use client";

import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { CatalogProduct } from "@/lib/types";
import { useCart } from "@/context/cart";
import { useLang } from "@/context/language";
import { categoryIcon } from "@/lib/product-visual";
import { stockLevel, stockLabel, STOCK_STYLE } from "@/lib/inventory";
import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";

export function ProductCard({ product, index = 0 }: { product: CatalogProduct; index?: number }) {
  const { t, lang } = useLang();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const Icon = categoryIcon(product.categoryId);
  const level = product.active ? stockLevel(product.stock, product.lowStockThreshold) : "out";
  const style = STOCK_STYLE[level];
  const soldOut = level === "out";

  const onAdd = () => {
    addItem({
      id: product.id,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      unitEn: product.unitEn,
      unitAr: product.unitAr,
      brandId: product.brandId,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
    toast.success(t("Added to your order", "أُضيف إلى طلبك"), {
      description: t(product.nameEn, product.nameAr),
    });
  };

  return (
    <Reveal delay={Math.min(index * 0.02, 0.24)} className="group flex flex-col">
      {/* One neutral tile per product until real photography exists. The icon is
          the category signal; the name does the rest. */}
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-surface">
        <div className="absolute inset-0 grid place-items-center">
          <Icon
            strokeWidth={0.75}
            className={cn(
              "size-20 transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.05]",
              soldOut ? "text-muted/25" : "text-muted/45",
            )}
          />
        </div>
        {soldOut && (
          <div className="absolute inset-x-0 bottom-0 bg-bg/85 py-2 text-center text-[0.75rem] font-medium">
            {t("Out of stock", "غير متوفر")}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <h3 className="text-[0.9375rem] font-medium leading-snug text-fg">
          {t(product.nameEn, product.nameAr)}
        </h3>
        <p className="mt-0.5 text-[0.8125rem] text-muted">{t(product.unitEn, product.unitAr)}</p>

        {/* The exact count only matters when it's running out — "In stock (59)"
            is noise on every card, "Low stock (3)" is a reason to order now. */}
        {!soldOut && (
          <p className={cn("mt-1.5 flex items-center gap-1.5 text-[0.75rem]", style.text)}>
            <span className={cn("size-1.5 rounded-full", style.dot)} aria-hidden />
            {stockLabel(level, lang, level === "low" ? product.stock : undefined)}
          </p>
        )}

        {/* A sold-out product still gets one real next action rather than a
            dead button — the branch can say when it lands. */}
        {soldOut ? (
          <a
            href={`https://wa.me/96893806780?text=${encodeURIComponent(
              `${t("When is this back in stock?", "متى يتوفر هذا مجدداً؟")} ${product.nameEn} — Modern Supply`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-auto inline-flex h-9 items-center justify-center rounded-[var(--radius-pill)] text-[0.8125rem] font-medium",
              "bg-surface text-fg transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)] hover:bg-surface-2",
            )}
          >
            {t("Ask a branch", "اسأل الفرع")}
          </a>
        ) : (
          <button
            onClick={onAdd}
            className={cn(
              "mt-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-[var(--radius-pill)] text-[0.8125rem] font-medium",
              "transition-[background-color,color,transform] duration-[var(--duration-hover)] ease-[var(--ease-out)]",
              "active:scale-[0.97] active:duration-[var(--duration-press)]",
              added ? "bg-accent text-accent-fg" : "bg-surface text-fg hover:bg-surface-2",
            )}
          >
            {added ? (
              <>
                <Check className="size-3.5" />
                {t("Added", "أُضيف")}
              </>
            ) : (
              <>
                <Plus className="size-3.5" />
                {t("Add to order", "أضف للطلب")}
              </>
            )}
          </button>
        )}
      </div>
    </Reveal>
  );
}
