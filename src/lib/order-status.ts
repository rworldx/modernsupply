import type { Lang } from "./i18n";

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABEL: Record<OrderStatus, { en: string; ar: string }> = {
  pending: { en: "Pending", ar: "قيد المراجعة" },
  confirmed: { en: "Confirmed", ar: "مؤكد" },
  preparing: { en: "Preparing", ar: "قيد التحضير" },
  out_for_delivery: { en: "Out for delivery", ar: "قيد التوصيل" },
  delivered: { en: "Delivered", ar: "تم التوصيل" },
  cancelled: { en: "Cancelled", ar: "ملغى" },
};

// Ordered steps shown on the customer tracking timeline (cancelled is separate).
export const TRACK_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

export const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
  confirmed: "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-500/20",
  preparing: "bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-violet-500/20",
  out_for_delivery: "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20",
  delivered: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20",
};

export function statusLabel(status: string, lang: Lang): string {
  const s = (ORDER_STATUSES as readonly string[]).includes(status)
    ? (status as OrderStatus)
    : "pending";
  return lang === "ar" ? STATUS_LABEL[s].ar : STATUS_LABEL[s].en;
}

export function isStatus(x: string): x is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(x);
}
