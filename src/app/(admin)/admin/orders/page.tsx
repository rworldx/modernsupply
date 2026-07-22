import { AdminShell } from "@/components/admin/admin-shell";
import { OrdersManager, type AdminOrder } from "@/components/admin/orders-manager";
import { db } from "@/lib/db";
import { getAdminLang } from "@/lib/admin-lang";
import { t as translate } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const lang = await getAdminLang();
  const t = (en: string, ar: string) => translate(lang, en, ar);
  const rows = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const orders: AdminOrder[] = rows.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    firstName: o.firstName,
    lastName: o.lastName,
    phone: o.phone,
    governorateEn: o.governorateEn,
    wilayatEn: o.wilayatEn,
    branchId: o.branchId,
    status: o.status,
    deliveryCompany: o.deliveryCompany,
    deliveryFee: o.deliveryFee,
    trackingNote: o.trackingNote,
    adminNotes: o.adminNotes,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((i) => ({ nameEn: i.nameEn, unitEn: i.unitEn, quantity: i.quantity })),
  }));

  return (
    <AdminShell
      title={t("Orders", "الطلبات")}
      subtitle={t(`${orders.length} order${orders.length === 1 ? "" : "s"} · track delivery and update status`, `${orders.length} طلب · تتبّع التوصيل وحدّث الحالة`)}
    >
      <OrdersManager orders={orders} />
    </AdminShell>
  );
}
