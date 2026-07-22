import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

const schema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  phone: z.string().trim().regex(/^\d{8}$/, "Phone must be 8 digits"),
  governorateEn: z.string().min(1),
  governorateAr: z.string().min(1),
  wilayatEn: z.string().min(1),
  wilayatAr: z.string().min(1),
  branchId: z.string().min(1),
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

  try {
    const result = await db.$transaction(async (tx) => {
      // Load products & verify availability.
      const ids = data.items.map((i) => i.id);
      const rows = await tx.product.findMany({ where: { id: { in: ids } } });
      const byId = new Map(rows.map((r) => [r.id, r]));

      const shortages: { id: string; nameEn: string; available: number; requested: number }[] = [];
      for (const item of data.items) {
        const p = byId.get(item.id);
        if (!p || !p.active) {
          shortages.push({ id: item.id, nameEn: p?.nameEn ?? item.id, available: 0, requested: item.quantity });
        } else if (p.stock < item.quantity) {
          shortages.push({ id: item.id, nameEn: p.nameEn, available: p.stock, requested: item.quantity });
        }
      }
      if (shortages.length > 0) {
        return { shortages } as const;
      }

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
          items: {
            create: data.items.map((i) => {
              const p = byId.get(i.id)!;
              return {
                productId: p.id,
                nameEn: p.nameEn,
                nameAr: p.nameAr,
                unitEn: p.unitEn,
                unitAr: p.unitAr,
                quantity: i.quantity,
              };
            }),
          },
        },
        include: { items: true },
      });

      // Decrement stock + audit log.
      for (const i of data.items) {
        await tx.product.update({
          where: { id: i.id },
          data: { stock: { decrement: i.quantity } },
        });
        await tx.stockMovement.create({
          data: { productId: i.id, delta: -i.quantity, reason: "order", note: orderNumber },
        });
      }

      return { order } as const;
    });

    if ("shortages" in result) {
      return NextResponse.json(
        { error: "Some items are no longer available in the requested quantity.", shortages: result.shortages },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { orderNumber: result.order.orderNumber, id: result.order.id },
      { status: 201 },
    );
  } catch (e) {
    console.error("Order creation failed:", e);
    return NextResponse.json({ error: "Could not place order. Please try again." }, { status: 500 });
  }
}
