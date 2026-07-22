import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

const schema = z
  .object({
    restock: z.number().int().optional(), // delta added to current stock (can be negative)
    setStock: z.number().int().min(0).optional(), // absolute value
    lowStockThreshold: z.number().int().min(0).max(100000).optional(),
    active: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: "No changes" });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }
  const { restock, setStock, lowStockThreshold, active } = parsed.data;

  try {
    const updated = await db.$transaction(async (tx) => {
      const current = await tx.product.findUnique({ where: { id } });
      if (!current) throw new Error("not_found");

      const data: Record<string, unknown> = {};
      if (lowStockThreshold !== undefined) data.lowStockThreshold = lowStockThreshold;
      if (active !== undefined) data.active = active;

      let newStock = current.stock;
      if (setStock !== undefined) newStock = setStock;
      if (restock !== undefined) newStock = newStock + restock;
      if (newStock < 0) newStock = 0;

      if (setStock !== undefined || restock !== undefined) {
        data.stock = newStock;
        const delta = newStock - current.stock;
        if (delta !== 0) {
          await tx.stockMovement.create({
            data: { productId: id, delta, reason: setStock !== undefined ? "manual" : "restock" },
          });
        }
      }

      return tx.product.update({ where: { id }, data });
    });

    return NextResponse.json({ ok: true, stock: updated.stock, active: updated.active, lowStockThreshold: updated.lowStockThreshold });
  } catch (e) {
    if (e instanceof Error && e.message === "not_found") {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const orderItemCount = await db.orderItem.count({ where: { productId: id } });
  if (orderItemCount > 0) {
    // Preserve order history — delist instead of hard delete.
    return NextResponse.json(
      { error: "has_orders", message: "This product appears in past orders. Delist it instead of deleting." },
      { status: 409 },
    );
  }

  try {
    await db.stockMovement.deleteMany({ where: { productId: id } });
    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
}
