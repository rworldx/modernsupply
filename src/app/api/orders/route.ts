import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { quoteOrder } from "@/lib/order-total";

const schema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  phone: z.string().trim().regex(/^\d{8}$/, "Phone must be 8 digits"),
  governorateEn: z.string().min(1),
  governorateAr: z.string().min(1),
  wilayatEn: z.string().min(1),
  wilayatAr: z.string().min(1),
  branchId: z.string().min(1),
  paymentMethod: z.enum(["cod", "card", "applepay"]).default("cod"),
  items: z
    .array(z.object({ id: z.string().min(1), quantity: z.number().int().min(1).max(999) }))
    .min(1),
});

// Human-friendly order number: MS-YYYY-NNNNN (sequential within the year).
async function nextOrderNumber(tx: Prisma.TransactionClient): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `MS-${year}-`;
  const last = await tx.order.findFirst({
    where: { orderNumber: { startsWith: prefix } },
    orderBy: { orderNumber: "desc" },
    select: { orderNumber: true },
  });
  const seq = last ? parseInt(last.orderNumber.slice(prefix.length), 10) + 1 : 1;
  return prefix + String(seq).padStart(5, "0");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Card / Apple Pay need a payment gateway that isn't wired in yet. Fail clearly
  // rather than silently recording an unpaid "card" order. COD is fully live.
  if (data.paymentMethod !== "cod") {
    return NextResponse.json(
      {
        error: "online_payment_unavailable",
        message: "Card and Apple Pay are not available yet. Please choose Cash on Delivery.",
      },
      { status: 503 },
    );
  }

  try {
    const result = await db.$transaction(async (tx) => {
      const quote = await quoteOrder(tx, { items: data.items, governorateEn: data.governorateEn });
      if ("kind" in quote) return { ok: false as const, quoteError: quote };

      const orderNumber = await nextOrderNumber(tx);

      const order = await tx.order.create({
        data: {
          orderNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          governorateEn: data.governorateEn,
          governorateAr: data.governorateAr,
          wilayatEn: data.wilayatEn,
          wilayatAr: data.wilayatAr,
          branchId: data.branchId,
          paymentMethod: "cod",
          paymentStatus: "unpaid", // collected on delivery
          subtotalOmr: quote.subtotalOmr,
          deliveryFee: quote.deliveryFeeOmr,
          totalOmr: quote.totalOmr,
          items: {
            create: quote.lines.map((l) => ({
              productId: l.id,
              nameEn: l.nameEn,
              nameAr: l.nameAr,
              unitEn: l.unitEn,
              unitAr: l.unitAr,
              quantity: l.quantity,
              unitPriceOmr: l.unitPriceOmr,
              lineTotalOmr: l.lineTotalOmr,
            })),
          },
        },
        include: { items: true },
      });

      // Decrement stock + audit log.
      for (const l of quote.lines) {
        await tx.product.update({ where: { id: l.id }, data: { stock: { decrement: l.quantity } } });
        await tx.stockMovement.create({
          data: { productId: l.id, delta: -l.quantity, reason: "order", note: orderNumber },
        });
      }

      return { ok: true as const, order };
    }, {
      // The quote does a few reads (products, discounts, delivery zone) and the
      // write decrements stock per line — over a remote database that can exceed
      // the default 5s interactive-transaction window, so give it more room.
      timeout: 20000,
      maxWait: 10000,
    });

    if (!result.ok) {
      const q = result.quoteError;
      if (q.kind === "shortage") {
        return NextResponse.json(
          { error: "Some items are no longer available in the requested quantity.", shortages: q.shortages },
          { status: 409 },
        );
      }
      if (q.kind === "unpriced") {
        return NextResponse.json(
          { error: "Some items don't have a price yet. Please contact a branch to order them.", items: q.items },
          { status: 409 },
        );
      }
      // no_delivery_zone
      return NextResponse.json(
        {
          error: "We don't deliver online to that governorate yet. Please order via a branch.",
          governorateEn: q.governorateEn,
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        orderNumber: result.order.orderNumber,
        id: result.order.id,
        totalOmr: result.order.totalOmr,
        paymentMethod: result.order.paymentMethod,
      },
      { status: 201 },
    );
  } catch (e) {
    console.error("Order creation failed:", e);
    return NextResponse.json({ error: "Could not place order. Please try again." }, { status: 500 });
  }
}
