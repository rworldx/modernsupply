import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { quoteOrder } from "@/lib/order-total";

// Public: given a cart + governorate, return the authoritative price breakdown
// so the checkout can show subtotal / delivery / total before the order is placed.
export const dynamic = "force-dynamic";

const schema = z.object({
  governorateEn: z.string().min(1),
  items: z
    .array(z.object({ id: z.string().min(1), quantity: z.number().int().min(1).max(999) }))
    .min(1),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const quote = await quoteOrder(db, parsed.data);
  if ("kind" in quote) {
    // A quote can legitimately fail (out of stock, an unpriced item, or a
    // governorate with no delivery price yet). Surface it so the UI can explain.
    return NextResponse.json({ error: quote }, { status: 409 });
  }
  return NextResponse.json({ quote });
}
