import "server-only";
import { db } from "@/lib/db";
import type { DiscountRule } from "@/lib/pricing";

/** All active discounts as plain rules, safe to hand to client components. */
export async function getActiveDiscounts(): Promise<DiscountRule[]> {
  const rows = await db.discount.findMany({ where: { active: true } });
  return rows.map((d) => ({
    id: d.id,
    scope: d.scope as DiscountRule["scope"],
    targetId: d.targetId,
    percentOff: d.percentOff,
    titleEn: d.titleEn,
    titleAr: d.titleAr,
    bodyEn: d.bodyEn,
    bodyAr: d.bodyAr,
  }));
}
