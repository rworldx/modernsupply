import { AdminShell } from "@/components/admin/admin-shell";
import { DeliveryManager, type ZoneRow } from "@/components/admin/delivery-manager";
import { db } from "@/lib/db";
import { omanGovernorates } from "@/data/wilayats";
import { getAdminLang } from "@/lib/admin-lang";
import { t as translate } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminDeliveryPage() {
  const lang = await getAdminLang();
  const t = (en: string, ar: string) => translate(lang, en, ar);
  const zones = await db.deliveryZone.findMany();
  const byGov = new Map(zones.map((z) => [z.governorateEn, z]));

  // One row per Oman governorate, whether or not a fee has been set yet.
  const rows: ZoneRow[] = omanGovernorates.map((g) => {
    const z = byGov.get(g.en);
    return {
      governorateEn: g.en,
      governorateAr: g.ar,
      feeOmr: z?.feeOmr ?? null,
      active: z?.active ?? false,
      configured: !!z,
    };
  });

  return (
    <AdminShell
      title={t("Delivery fees", "رسوم التوصيل")}
      subtitle={t(
        "Set the delivery fee per governorate. Governorates without a fee can't be paid online yet — customers there are asked to order via a branch.",
        "حدّد رسوم التوصيل لكل محافظة. المحافظات بدون رسوم لا يمكن الدفع لها أونلاين بعد — يُطلب من عملائها الطلب عبر أحد الفروع.",
      )}
    >
      <DeliveryManager rows={rows} />
    </AdminShell>
  );
}
