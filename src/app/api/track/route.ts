import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Look up an order by orderNumber + phone (acts as a shared secret; no accounts).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("order")?.trim() ?? "";
  const phone = searchParams.get("phone")?.trim() ?? "";

  if (!orderNumber || !phone) {
    return NextResponse.json({ error: "Missing order number or phone" }, { status: 400 });
  }

  const order = await db.order.findFirst({
    where: { orderNumber, phone },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Only expose customer-safe fields (no adminNotes).
  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    firstName: order.firstName,
    governorateEn: order.governorateEn,
    governorateAr: order.governorateAr,
    wilayatEn: order.wilayatEn,
    wilayatAr: order.wilayatAr,
    branchId: order.branchId,
    deliveryCompany: order.deliveryCompany,
    deliveryFee: order.deliveryFee,
    trackingNote: order.trackingNote,
    items: order.items.map((i) => ({
      nameEn: i.nameEn, nameAr: i.nameAr, unitEn: i.unitEn, unitAr: i.unitAr, quantity: i.quantity,
    })),
  });
}
