import "server-only";
import { db } from "@/lib/db";
import { getActiveDiscounts } from "@/lib/discounts";
import { priceFor, round3 } from "@/lib/pricing";

export interface OrderLine {
  id: string;
  nameEn: string;
  nameAr: string;
  unitEn: string;
  unitAr: string;
  quantity: number;
  unitPriceOmr: number;
  lineTotalOmr: number;
}

export type QuoteError =
  | { kind: "shortage"; shortages: { id: string; nameEn: string; available: number; requested: number }[] }
  | { kind: "unpriced"; items: { id: string; nameEn: string }[] }
  | { kind: "no_delivery_zone"; governorateEn: string };

export interface Quote {
  lines: OrderLine[];
  subtotalOmr: number;
  deliveryFeeOmr: number;
  totalOmr: number;
}

/**
 * Authoritative money math for an order. Prices, discounts and the delivery fee
 * are read from the database here — never from the request — so a tampered
 * client cannot change what it is charged. Runs inside the caller's transaction
 * so stock/price reads are consistent with the write that follows.
 *
 * Returns a Quote on success, or a typed error the caller turns into a 4xx.
 */
export async function quoteOrder(
  tx: { product: typeof db.product; deliveryZone: typeof db.deliveryZone },
  input: { items: { id: string; quantity: number }[]; governorateEn: string },
): Promise<Quote | QuoteError> {
  const ids = input.items.map((i) => i.id);
  const [rows, discounts, zone] = await Promise.all([
    tx.product.findMany({ where: { id: { in: ids } } }),
    getActiveDiscounts(),
    tx.deliveryZone.findUnique({ where: { governorateEn: input.governorateEn } }),
  ]);
  const byId = new Map(rows.map((r) => [r.id, r]));

  // 1. Availability.
  const shortages: { id: string; nameEn: string; available: number; requested: number }[] = [];
  for (const item of input.items) {
    const p = byId.get(item.id);
    if (!p || !p.active) {
      shortages.push({ id: item.id, nameEn: p?.nameEn ?? item.id, available: 0, requested: item.quantity });
    } else if (p.stock < item.quantity) {
      shortages.push({ id: item.id, nameEn: p.nameEn, available: p.stock, requested: item.quantity });
    }
  }
  if (shortages.length > 0) return { kind: "shortage", shortages };

  // 2. Every ordered item must have a price, or we cannot charge for it.
  const unpriced: { id: string; nameEn: string }[] = [];
  const lines: OrderLine[] = [];
  for (const item of input.items) {
    const p = byId.get(item.id)!;
    const pricing = priceFor(
      { id: p.id, brandId: p.brandId, categoryId: p.categoryId, priceOmr: p.priceOmr },
      discounts,
    );
    if (pricing.final == null) {
      unpriced.push({ id: p.id, nameEn: p.nameEn });
      continue;
    }
    const unit = pricing.final;
    lines.push({
      id: p.id,
      nameEn: p.nameEn,
      nameAr: p.nameAr,
      unitEn: p.unitEn,
      unitAr: p.unitAr,
      quantity: item.quantity,
      unitPriceOmr: unit,
      lineTotalOmr: round3(unit * item.quantity),
    });
  }
  if (unpriced.length > 0) return { kind: "unpriced", items: unpriced };

  // 3. Delivery fee for the governorate.
  if (!zone || !zone.active) {
    return { kind: "no_delivery_zone", governorateEn: input.governorateEn };
  }

  const subtotalOmr = round3(lines.reduce((s, l) => s + l.lineTotalOmr, 0));
  const deliveryFeeOmr = round3(zone.feeOmr);
  const totalOmr = round3(subtotalOmr + deliveryFeeOmr);

  return { lines, subtotalOmr, deliveryFeeOmr, totalOmr };
}
