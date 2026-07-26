import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { omanGovernorates } from "@/data/wilayats";

// One upsert endpoint keyed on the governorate — the set of governorates is
// fixed (from src/data/wilayats.ts), so admins edit fees rather than create rows.
const schema = z.object({
  governorateEn: z.string().min(1),
  feeOmr: z.number().min(0).max(1000),
  active: z.boolean().default(true),
});

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const zones = await db.deliveryZone.findMany();
  return NextResponse.json({ zones });
}

export async function PUT(request: Request) {
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
  const { governorateEn, feeOmr, active } = parsed.data;

  const gov = omanGovernorates.find((g) => g.en === governorateEn);
  if (!gov) {
    return NextResponse.json({ error: "Unknown governorate" }, { status: 400 });
  }

  const zone = await db.deliveryZone.upsert({
    where: { governorateEn },
    update: { feeOmr, active },
    create: { governorateEn, governorateAr: gov.ar, feeOmr, active },
  });

  return NextResponse.json({ ok: true, zone });
}
