import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { brands } from "@/data/brand";
import { categories } from "@/data/products";

const schema = z
  .object({
    scope: z.enum(["brand", "category", "product", "all"]),
    targetId: z.string().trim().max(120).default(""),
    percentOff: z.number().int().min(1).max(90),
    active: z.boolean().default(true),
    titleEn: z.string().trim().max(120).nullish(),
    titleAr: z.string().trim().max(120).nullish(),
    bodyEn: z.string().trim().max(400).nullish(),
    bodyAr: z.string().trim().max(400).nullish(),
  })
  .refine((d) => d.scope === "all" || d.targetId.length > 0, {
    message: "targetId is required unless scope is 'all'",
    path: ["targetId"],
  });

/** Validate that targetId names something real for its scope. */
async function targetExists(scope: string, targetId: string): Promise<boolean> {
  switch (scope) {
    case "all":
      return true;
    case "brand":
      return brands.some((b) => b.id === targetId);
    case "category":
      return categories.some((c) => c.id === targetId);
    case "product":
      return (await db.product.count({ where: { id: targetId } })) > 0;
    default:
      return false;
  }
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const discounts = await db.discount.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ discounts });
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
  const d = parsed.data;
  const targetId = d.scope === "all" ? "" : d.targetId;

  if (!(await targetExists(d.scope, targetId))) {
    return NextResponse.json({ error: "Unknown target for scope" }, { status: 400 });
  }

  const created = await db.discount.create({
    data: {
      scope: d.scope,
      targetId,
      percentOff: d.percentOff,
      active: d.active,
      titleEn: d.titleEn || null,
      titleAr: d.titleAr || null,
      bodyEn: d.bodyEn || null,
      bodyAr: d.bodyAr || null,
    },
  });

  return NextResponse.json({ ok: true, discount: created }, { status: 201 });
}
