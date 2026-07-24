import type { Lang } from "./i18n";

// A discount as the storefront needs it (a plain object safe to pass to client
// components — no Date, no Prisma types).
export interface DiscountRule {
  id: string;
  scope: "brand" | "category" | "product" | "all";
  targetId: string;
  percentOff: number;
  titleEn?: string | null;
  titleAr?: string | null;
  bodyEn?: string | null;
  bodyAr?: string | null;
}

// Narrowest scope wins: a product-specific discount beats a category one, which
// beats a brand one, which beats a site-wide one. So "20% off Cremino" can hold
// generally while one hero SKU is marked down 40%, and the SKU shows 40%.
const SCOPE_RANK: Record<DiscountRule["scope"], number> = {
  product: 3,
  category: 2,
  brand: 1,
  all: 0,
};

export interface Pricing {
  /** Original price in OMR, or null when the product has no price set. */
  base: number | null;
  /** Price after discount; equals base when nothing applies. */
  final: number | null;
  /** Whole-percent reduction applied, 0 when none. */
  percentOff: number;
  /** The rule that applied, for surfacing its announcement. */
  applied: DiscountRule | null;
}

/** Resolve the effective price for one product against the active discount set. */
export function priceFor(
  product: { id: string; brandId: string; categoryId: string; priceOmr: number | null },
  discounts: DiscountRule[],
): Pricing {
  const matching = discounts.filter((d) => {
    switch (d.scope) {
      case "all":
        return true;
      case "brand":
        return d.targetId === product.brandId;
      case "category":
        return d.targetId === product.categoryId;
      case "product":
        return d.targetId === product.id;
    }
  });

  // Best = narrowest scope; ties broken by the larger reduction.
  const applied =
    matching.sort(
      (a, b) => SCOPE_RANK[b.scope] - SCOPE_RANK[a.scope] || b.percentOff - a.percentOff,
    )[0] ?? null;

  const base = product.priceOmr;
  if (base == null || applied == null) {
    return { base, final: base, percentOff: 0, applied: null };
  }

  const final = round3(base * (1 - applied.percentOff / 100));
  return { base, final, percentOff: applied.percentOff, applied };
}

// OMR is quoted to three decimals (1000 baisa = 1 rial), so prices round there.
export function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/** "12.000 OMR" / "١٢٫٠٠٠ ر.ع" — three decimals, localized. */
export function formatOmr(amount: number, lang: Lang): string {
  const n = amount.toLocaleString(lang === "ar" ? "ar-OM" : "en-OM", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  return lang === "ar" ? `${n} ر.ع` : `${n} OMR`;
}

/**
 * Pick the single discount to advertise in the storefront popup: the one with an
 * announcement title and the deepest cut. Returns null when nothing is announced.
 */
export function announcement(discounts: DiscountRule[]): DiscountRule | null {
  return (
    discounts
      .filter((d) => (d.titleEn && d.titleEn.trim()) || (d.titleAr && d.titleAr.trim()))
      .sort((a, b) => b.percentOff - a.percentOff)[0] ?? null
  );
}
