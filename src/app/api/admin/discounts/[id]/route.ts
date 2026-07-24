import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

const schema = z
  .object({
    percentOff: z.number().int().min(1).max(90).optional(),
    active: z.boolean().optional(),
    titleEn: z.string().trim().max(120).nullish(),
    titleAr: z.string().trim().max(120).nullish(),
    bodyEn: z.string().trim().max(400).nullish(),
    bodyAr: z.string().trim().max(400).nullish(),
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

  // Convert empty announcement strings to null so a cleared field disables the popup.
  const d = parsed.data;
  const data: Record<string, unknown> = {};
  if (d.percentOff !== undefined) data.percentOff = d.percentOff;
  if (d.active !== undefined) data.active = d.active;
  if (d.titleEn !== undefined) data.titleEn = d.titleEn || null;
  if (d.titleAr !== undefined) data.titleAr = d.titleAr || null;
  if (d.bodyEn !== undefined) data.bodyEn = d.bodyEn || null;
  if (d.bodyAr !== undefined) data.bodyAr = d.bodyAr || null;

  try {
    const updated = await db.discount.update({ where: { id }, data });
    return NextResponse.json({ ok: true, discount: updated });
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await db.discount.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
}
