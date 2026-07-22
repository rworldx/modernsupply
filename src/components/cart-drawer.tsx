"use client";

import Link from "next/link";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart";
import { useLang } from "@/context/language";

export function CartDrawer() {
  const { items, isOpen, setOpen, updateQuantity, removeItem, itemCount } = useCart();
  const { lang, t } = useLang();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="end" title={t("Your order", "طلبك")} className="p-0">
        <div className="flex items-baseline gap-2 border-b border-hairline px-6 py-5 pe-16">
          <h2 className="t-h3">{t("Your order", "طلبك")}</h2>
          {itemCount > 0 && (
            <span className="text-[0.9375rem] tabular-nums text-muted">{itemCount}</span>
          )}
        </div>

        {items.length === 0 ? (
          // An empty screen is an invitation to act, so it carries the action.
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <h3 className="t-h3">{t("Nothing here yet", "لا يوجد شيء بعد")}</h3>
            <p className="text-[0.9375rem] text-muted">
              {t(
                "Add products from any brand catalogue and they collect here.",
                "أضف منتجات من كتالوج أي براند لتتجمع هنا.",
              )}
            </p>
            <Button asChild className="mt-3" onClick={() => setOpen(false)}>
              <Link href={`/${lang}/brands`}>{t("Browse the brands", "تصفح البراندات")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-4 border-b border-hairline py-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.9375rem] font-medium">
                      {t(item.nameEn, item.nameAr)}
                    </p>
                    <p className="mt-0.5 text-[0.8125rem] text-muted">
                      {t(item.unitEn, item.unitAr)}
                    </p>
                    <div className="mt-3 inline-flex items-center rounded-[var(--radius-pill)] bg-surface">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="grid size-9 place-items-center rounded-full text-muted transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)] hover:text-fg"
                        aria-label={t("Decrease quantity", "إنقاص الكمية")}
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-7 text-center font-mono text-[0.875rem] tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="grid size-9 place-items-center rounded-full text-muted transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)] hover:text-fg"
                        aria-label={t("Increase quantity", "زيادة الكمية")}
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="grid size-9 shrink-0 place-items-center rounded-full text-muted transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)] hover:text-fg"
                    aria-label={t("Remove", "إزالة")}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-hairline p-6">
              <Button asChild size="lg" className="w-full" onClick={() => setOpen(false)}>
                <Link href={`/${lang}/order`}>
                  {t("Review your order", "مراجعة طلبك")}
                </Link>
              </Button>
              <p className="mt-3 text-center text-[0.75rem] text-muted">
                {t(
                  "The branch confirms availability and the total before delivery.",
                  "يؤكد الفرع التوفر والإجمالي قبل التوصيل.",
                )}
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
