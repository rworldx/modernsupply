import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { ORDER_STATUSES } from "@/lib/order-status";

const schema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  deliveryCompany: z.string().max(120).nullable().optional(),
  deliveryFee: z.number().min(0).max(9999).nullable().optional(),
  trackingNote: z.string().max(500).nullable().optional(),
  adminNotes: z.string().max(1000).nullable().optional(),
});

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

  try {
    const order = await db.order.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ ok: true, status: order.status });
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
}
