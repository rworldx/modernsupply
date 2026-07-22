import type { Lang } from "./i18n";

export type StockLevel = "in" | "low" | "out";

export function stockLevel(stock: number, threshold: number): StockLevel {
  if (stock <= 0) return "out";
  if (stock <= threshold) return "low";
  return "in";
}

/**
 * Tailwind classes for each level. Stock is one of the few places colour carries
 * real meaning, so it keeps its green/amber/red — but muted, and read as a dot
 * plus a line of text rather than a filled badge, so a catalogue grid does not
 * turn into a wall of pills. `bg`/`ring` remain for the admin inventory table.
 */
export const STOCK_STYLE: Record<StockLevel, { dot: string; text: string; bg: string; ring: string }> = {
  in: { dot: "bg-emerald-600 dark:bg-emerald-400", text: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20" },
  low: { dot: "bg-amber-600 dark:bg-amber-400", text: "text-amber-700 dark:text-amber-400", bg: "bg-amber-500/10", ring: "ring-amber-500/20" },
  out: { dot: "bg-red-600 dark:bg-red-400", text: "text-red-700 dark:text-red-400", bg: "bg-red-500/10", ring: "ring-red-500/20" },
};

export function stockLabel(level: StockLevel, lang: Lang, stock?: number): string {
  const ar = lang === "ar";
  switch (level) {
    case "out":
      return ar ? "غير متوفر" : "Out of stock";
    case "low":
      return stock != null
        ? ar ? `كمية محدودة (${stock})` : `Low stock (${stock})`
        : ar ? "كمية محدودة" : "Low stock";
    case "in":
      return stock != null
        ? ar ? `متوفر (${stock})` : `In stock (${stock})`
        : ar ? "متوفر" : "In stock";
  }
}
