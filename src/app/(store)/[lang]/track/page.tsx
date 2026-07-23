"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { useLang } from "@/context/language";
import { branches } from "@/data/brand";
import { TRACK_STEPS, statusLabel } from "@/lib/order-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TrackedOrder {
  orderNumber: string;
  status: string;
  createdAt: string;
  firstName: string;
  governorateEn: string; governorateAr: string;
  wilayatEn: string; wilayatAr: string;
  branchId: string;
  deliveryCompany: string | null;
  deliveryFee: number | null;
  trackingNote: string | null;
  items: { nameEn: string; nameAr: string; unitEn: string; unitAr: string; quantity: number }[];
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="py-28 text-center text-muted">Loading…</div>}>
      <TrackInner />
    </Suspense>
  );
}

function TrackInner() {
  const { t, lang } = useLang();
  const reduce = useReducedMotion();
  const sp = useSearchParams();

  const [order, setOrder] = useState(sp.get("order") ?? "");
  const [phone, setPhone] = useState(sp.get("phone") ?? "");
  // Arriving from the confirmation link means a lookup starts immediately, so the
  // very first render is already the loading one — no effect needed to say so.
  const [loading, setLoading] = useState(() => Boolean(sp.get("order") && sp.get("phone")));
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TrackedOrder | null>(null);

  // Just the request: no state touched, so it is safe to start from an effect.
  const request = useCallback(
    async (o: string, p: string): Promise<{ data: TrackedOrder } | { error: string }> => {
      try {
        const res = await fetch(
          `/api/track?order=${encodeURIComponent(o.trim())}&phone=${encodeURIComponent(p.trim())}`,
        );
        if (res.status === 404) {
          return {
            error: t(
              "No order matches that number and phone. Check both against the confirmation message.",
              "لا يوجد طلب يطابق هذا الرقم والهاتف. تحقق منهما في رسالة التأكيد.",
            ),
          };
        }
        if (!res.ok) {
          return { error: t("Something went wrong. Please try again.", "حدث خطأ. حاول مرة أخرى.") };
        }
        return { data: await res.json() };
      } catch {
        return {
          error: t(
            "Network error. Check your connection and try again.",
            "خطأ في الشبكة. تحقق من اتصالك وحاول مرة أخرى.",
          ),
        };
      }
    },
    [t],
  );

  const apply = useCallback((result: { data: TrackedOrder } | { error: string }) => {
    if ("error" in result) {
      setError(result.error);
      setData(null);
    } else {
      setData(result.data);
      setError(null);
    }
    setLoading(false);
  }, []);

  const lookup = useCallback(
    async (o: string, p: string) => {
      if (!o.trim() || !p.trim()) return;
      setLoading(true);
      setError(null);
      setData(null);
      apply(await request(o, p));
    },
    [apply, request],
  );

  // Auto-lookup when arriving from the order confirmation link. The state lands
  // in the fetch's continuation rather than in the effect body, so this cannot
  // cascade an extra render pass before the browser paints.
  useEffect(() => {
    const o = sp.get("order");
    const p = sp.get("phone");
    if (!o || !p) return;
    let live = true;
    request(o, p).then((result) => {
      if (live) apply(result);
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const branch = data ? branches.find((b) => b.id === data.branchId) : null;
  const cancelled = data?.status === "cancelled";
  const currentStep = data ? TRACK_STEPS.indexOf(data.status as never) : -1;

  return (
    <div className="rail-narrow py-16 md:py-24">
      <h1 className="t-display">{t("Track an order", "تتبع طلباً")}</h1>
      <p className="t-lead mt-5">
        {t(
          "Your order number is in the confirmation we sent — it looks like MS-2026-00001.",
          "رقم طلبك موجود في رسالة التأكيد التي أرسلناها — بصيغة MS-2026-00001.",
        )}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup(order, phone);
        }}
        className="mt-10 rounded-[var(--radius-xl)] border border-hairline bg-surface p-6 sm:p-7"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="ord">{t("Order number", "رقم الطلب")}</Label>
            <Input
              id="ord"
              value={order}
              onChange={(e) => setOrder(e.target.value.toUpperCase())}
              placeholder="MS-2026-00001"
              className="bg-bg font-mono"
            />
          </div>
          <div>
            <Label htmlFor="tph">{t("Phone", "الهاتف")}</Label>
            <Input
              id="tph"
              inputMode="numeric"
              maxLength={8}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="9XXXXXXX"
              className="bg-bg font-mono tabular-nums"
            />
          </div>
        </div>
        <Button type="submit" size="lg" className="mt-5 w-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? t("Looking up", "جارٍ البحث") : t("Track order", "تتبع الطلب")}
        </Button>
        {error && (
          <p role="alert" className="mt-4 text-[0.875rem] text-red-700 dark:text-red-400">
            {error}
          </p>
        )}
      </form>

      {data && (
        <motion.section
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="mt-8 rounded-[var(--radius-xl)] border border-hairline p-6 sm:p-7"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-hairline pb-5">
            <p className="font-mono text-[1.3125rem] font-medium tabular-nums">
              {data.orderNumber}
            </p>
            <p className={cn("text-[0.9375rem]", cancelled ? "text-red-700 dark:text-red-400" : "text-fg")}>
              {statusLabel(data.status, lang)}
            </p>
          </div>

          {cancelled ? (
            <p className="pt-5 text-[0.9375rem] text-muted">
              {t(
                "This order was cancelled. The branch can tell you why and re-place it for you.",
                "تم إلغاء هذا الطلب. يمكن للفرع إخبارك بالسبب وإعادة تقديمه نيابةً عنك.",
              )}
            </p>
          ) : (
            <ol className="pt-5">
              {TRACK_STEPS.map((step, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                return (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex flex-col items-center">
                      <span
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded-full",
                          done || active ? "bg-fg text-bg" : "border border-border",
                        )}
                      >
                        {(done || active) && <Check className="size-3" strokeWidth={3} />}
                      </span>
                      {i < TRACK_STEPS.length - 1 && (
                        <span
                          className={cn(
                            "my-1 h-6 w-px",
                            i < currentStep ? "bg-fg" : "bg-border",
                          )}
                        />
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-[0.9375rem] leading-5",
                        active ? "font-medium text-fg" : done ? "text-fg" : "text-muted",
                      )}
                    >
                      {statusLabel(step, lang)}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}

          {(data.deliveryCompany || data.trackingNote || data.deliveryFee != null) && (
            <div className="mt-6 space-y-1.5 border-t border-hairline pt-5 text-[0.9375rem]">
              {data.deliveryCompany && (
                <p>
                  <span className="text-muted">{t("Delivery", "التوصيل")}: </span>
                  {data.deliveryCompany}
                  {data.deliveryFee != null && (
                    <span className="tabular-nums"> — {data.deliveryFee.toFixed(3)} OMR</span>
                  )}
                </p>
              )}
              {data.trackingNote && <p className="text-muted">{data.trackingNote}</p>}
            </div>
          )}

          <div className="mt-6 border-t border-hairline pt-5">
            <p className="text-[0.875rem] text-muted">
              {t(data.governorateEn, data.governorateAr)} — {t(data.wilayatEn, data.wilayatAr)}
              {branch && <span> · {t(branch.nameEn, branch.nameAr)}</span>}
            </p>
            <ul className="mt-4 space-y-2">
              {data.items.map((it, idx) => (
                <li key={idx} className="flex justify-between gap-4 text-[0.9375rem]">
                  <span>
                    <span className="font-mono tabular-nums text-muted">{it.quantity}×</span>{" "}
                    {t(it.nameEn, it.nameAr)}
                  </span>
                  <span className="shrink-0 text-muted">{t(it.unitEn, it.unitAr)}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>
      )}
    </div>
  );
}
