import Link from "next/link";
import { ClipboardList, Clock, PackageCheck, AlertTriangle, XCircle, Boxes, TrendingUp } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { SalesChart } from "@/components/admin/sales-chart";
import { getDashboardMetrics } from "@/lib/admin-metrics";
import { getAdminLang } from "@/lib/admin-lang";
import { t as translate } from "@/lib/i18n";
import { STATUS_LABEL, STATUS_STYLE, ORDER_STATUSES } from "@/lib/order-status";
import { getBrand } from "@/data/brand";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [m, lang] = await Promise.all([getDashboardMetrics(), getAdminLang()]);
  const t = (en: string, ar: string) => translate(lang, en, ar);

  const cards = [
    { label: t("Active orders", "طلبات جارية"), value: m.activeOrders, icon: ClipboardList, tone: "text-sky-500" },
    { label: t("Total orders", "إجمالي الطلبات"), value: m.totalOrders, icon: TrendingUp, tone: "text-emerald-500" },
    { label: t("Low stock", "مخزون منخفض"), value: m.lowStock, icon: AlertTriangle, tone: "text-amber-500" },
    { label: t("Out of stock", "نفد المخزون"), value: m.outOfStock, icon: XCircle, tone: "text-rose-500" },
  ];

  return (
    <AdminShell title={t("Dashboard", "لوحة التحكم")} subtitle={t("Sales activity, orders, and inventory health at a glance.", "نشاط المبيعات والطلبات وحالة المخزون في لمحة.")}>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">{c.label}</span>
              <c.icon className={cn("h-5 w-5", c.tone)} />
            </div>
            <p className="mt-2 font-display text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <SalesChart daily={m.daily} lang={lang} />

        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-bold">{t("Orders by status", "الطلبات حسب الحالة")}</h2>
          <ul className="space-y-2">
            {ORDER_STATUSES.map((s) => (
              <li key={s} className="flex items-center justify-between">
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1", STATUS_STYLE[s])}>
                  {t(STATUS_LABEL[s].en, STATUS_LABEL[s].ar)}
                </span>
                <span className="font-semibold tabular-nums">{m.byStatus[s]}</span>
              </li>
            ))}
          </ul>
          <Link href="/admin/orders" className="mt-4 inline-flex text-sm font-semibold text-accent hover:underline">
            {t("Manage orders", "إدارة الطلبات")} →
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
            <Boxes className="h-5 w-5 text-accent" /> {t("Inventory", "المخزون")}
          </h2>
          <dl className="space-y-3 text-sm">
            <Row label={t("Total products", "إجمالي المنتجات")} value={m.totalProducts} />
            <Row label={t("Listed", "معروضة")} value={m.activeProducts} icon={<PackageCheck className="h-4 w-4 text-emerald-500" />} />
            <Row label={t("Low stock", "مخزون منخفض")} value={m.lowStock} icon={<AlertTriangle className="h-4 w-4 text-amber-500" />} />
            <Row label={t("Out of stock", "نفد المخزون")} value={m.outOfStock} icon={<XCircle className="h-4 w-4 text-rose-500" />} />
            <Row label={t("Total units in stock", "إجمالي الوحدات بالمخزون")} value={m.totalUnits.toLocaleString()} />
          </dl>
          <Link href="/admin/inventory" className="mt-4 inline-flex text-sm font-semibold text-accent hover:underline">
            {t("Manage inventory", "إدارة المخزون")} →
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
            <Clock className="h-5 w-5 text-amber-500" /> {t("Needs restocking", "بحاجة لإعادة تخزين")}
          </h2>
          {m.lowStockItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">{t("Everything is well stocked. 🎉", "كل المنتجات متوفرة بكميات جيدة. 🎉")}</p>
          ) : (
            <ul className="divide-y divide-border">
              {m.lowStockItems.map((it) => (
                <li key={it.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{it.nameEn}</p>
                    <p className="text-xs text-muted">{getBrand(it.brandId).nameEn}</p>
                  </div>
                  <span className={cn("ms-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1", it.stock <= 0 ? "bg-rose-500/10 text-rose-500 ring-rose-500/20" : "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400")}>
                    {it.stock}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function Row({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="flex items-center gap-2 text-muted">{icon}{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
