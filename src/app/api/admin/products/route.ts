import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { categories } from "@/data/products";

const schema = z.object({
  categoryId: z.string().min(1),
  nameEn: z.string().trim().min(1).max(120),
  nameAr: z.string().trim().min(1).max(120),
  stock: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).max(100000).default(10),
});

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40) || "item";
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

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
  const { categoryId, nameEn, nameAr, stock, lowStockThreshold } = parsed.data;

  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }

  const base = `${categoryId}-${slugify(nameEn)}`;
  let id = base;
  for (let n = 1; await db.product.findUnique({ where: { id } }); n++) {
    id = `${base}-${n}`;
  }

  const created = await db.product.create({
    data: {
      id,
      brandId: cat.brandId,
      categoryId: cat.id,
      nameEn,
      nameAr,
      unitEn: cat.unitEn,
      unitAr: cat.unitAr,
      stock,
      lowStockThreshold,
      active: true,
    },
  });
  if (stock > 0) {
    await db.stockMovement.create({ data: { productId: id, delta: stock, reason: "manual", note: "created" } });
  }

  return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
}
