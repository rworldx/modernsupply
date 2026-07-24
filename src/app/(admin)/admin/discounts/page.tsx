import { AdminShell } from "@/components/admin/admin-shell";
import { DiscountsManager, type DiscountRow } from "@/components/admin/discounts-manager";
import { db } from "@/lib/db";
import { getAdminLang } from "@/lib/admin-lang";
import { t as translate } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminDiscountsPage() {
  const lang = await getAdminLang();
  const t = (en: string, ar: string) => translate(lang, en, ar);
  const rows = await db.discount.findMany({ orderBy: { createdAt: "desc" } });

  const discounts: DiscountRow[] = rows.map((d) => ({
    id: d.id,
    scope: d.scope as DiscountRow["scope"],
    targetId: d.targetId,
    percentOff: d.percentOff,
    active: d.active,
    titleEn: d.titleEn,
    titleAr: d.titleAr,
    bodyEn: d.bodyEn,
    bodyAr: d.bodyAr,
  }));

  return (
    <AdminShell
      title={t("Discounts", "الخصومات")}
      subtitle={t(
        "Reduce prices by brand, category, or product — and announce an offer on the storefront.",
        "خفّض الأسعار حسب البراند أو الفئة أو المنتج — وأعلن عن عرض في المتجر.",
      )}
    >
      <DiscountsManager discounts={discounts} />
    </AdminShell>
  );
}
