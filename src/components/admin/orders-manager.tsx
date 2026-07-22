"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Package, Loader2, Save, Phone, MapPin } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { branches } from "@/data/brand";
import { useAdminLang } from "@/context/admin-language";
import { ORDER_STATUSES, STATUS_LABEL, STATUS_STYLE, type OrderStatus } from "@/lib/order-status";
import { cn } from "@/lib/utils";

export interface AdminOrder {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  governorateEn: string;
  wilayatEn: string;
  branchId: string;
  status: string;
  deliveryCompany: string | null;
  deliveryFee: number | null;
  trackingNote: string | null;
  adminNotes: string | null;
  createdAt: string;
  items: { nameEn: string; unitEn: string; quantity: number }[];
}

const branchName = (id: string) => branches.find((b) => b.id === id)?.nameEn ?? id;

export function OrdersManager({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const { t, lang } = useAdminLang();
  const locale = lang === "ar" ? "ar" : "en";
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!q) return true;
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        `${o.firstName} ${o.lastName}`.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    });
  }, [orders, query, filter]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Search order #, name, phone…", "ابحث برقم الطلب أو الاسم أو الهاتف…")} className="ps-9" />
        </div>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          <FilterPill active={filter === "all"} onClick={() => setFilter("all")} label={t("All", "الكل")} count={orders.length} />
          {ORDER_STATUSES.map((s) => {
            const c = orders.filter((o) => o.status === s).length;
            return <FilterPill key={s} active={filter === s} onClick={() => setFilter(s)} label={t(STATUS_LABEL[s].en, STATUS_LABEL[s].ar)} count={c} />;
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface py-20 text-center">
          <Package className="mx-auto h-10 w-10 text-muted" />
          <p className="mt-3 font-medium">{t("No orders found", "لا توجد طلبات")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-start text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 text-start font-medium">{t("Order", "الطلب")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("Customer", "العميل")}</th>
                <th className="hidden px-4 py-3 text-start font-medium md:table-cell">{t("Location", "الموقع")}</th>
                <th className="hidden px-4 py-3 text-start font-medium sm:table-cell">{t("Items", "المنتجات")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("Status", "الحالة")}</th>
                <th className="hidden px-4 py-3 text-start font-medium lg:table-cell">{t("Date", "التاريخ")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((o) => (
                <tr key={o.id} onClick={() => setSelected(o)} className="cursor-pointer transition-colors hover:bg-surface-2">
                  <td className="px-4 py-3 font-mono font-semibold">{o.orderNumber}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{o.firstName} {o.lastName}</div>
                    <div className="text-xs text-muted" dir="ltr">+968 {o.phone}</div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted md:table-cell">{o.governorateEn}, {o.wilayatEn}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1", STATUS_STYLE[o.status as OrderStatus] ?? STATUS_STYLE.pending)}>
                      {t(STATUS_LABEL[o.status as OrderStatus]?.en ?? o.status, STATUS_LABEL[o.status as OrderStatus]?.ar ?? o.status)}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-muted lg:table-cell">{new Date(o.createdAt).toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && <OrderDetail order={selected} onSaved={() => { setSelected(null); router.refresh(); }} />}
      </Sheet>
    </div>
  );
}

function FilterPill({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button onClick={onClick} className={cn("shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors", active ? "bg-primary text-primary-fg" : "bg-surface text-fg/70 ring-1 ring-border hover:bg-surface-2")}>
      {label} <span className="opacity-60">{count}</span>
    </button>
  );
}

function OrderDetail({ order, onSaved }: { order: AdminOrder; onSaved: () => void }) {
  const { t, lang } = useAdminLang();
  const [status, setStatus] = useState<OrderStatus>((order.status as OrderStatus) ?? "pending");
  const [company, setCompany] = useState(order.deliveryCompany ?? "");
  const [fee, setFee] = useState(order.deliveryFee != null ? String(order.deliveryFee) : "");
  const [note, setNote] = useState(order.trackingNote ?? "");
  const [adminNotes, setAdminNotes] = useState(order.adminNotes ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          deliveryCompany: company.trim() || null,
          deliveryFee: fee.trim() ? Number(fee) : null,
          trackingNote: note.trim() || null,
          adminNotes: adminNotes.trim() || null,
        }),
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SheetContent side="end" title={`Order ${order.orderNumber}`} className="w-full max-w-lg p-0">
      <div className="border-b border-border px-6 py-5">
        <p className="font-mono text-lg font-bold">{order.orderNumber}</p>
        <p className="text-sm text-muted">{new Date(order.createdAt).toLocaleString(lang === "ar" ? "ar" : "en")}</p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        <div className="rounded-2xl bg-surface-2 p-4 text-sm">
          <p className="font-semibold">{order.firstName} {order.lastName}</p>
          <p className="mt-1 flex items-center gap-1.5 text-muted" dir="ltr"><Phone className="h-3.5 w-3.5" /> +968 {order.phone}</p>
          <p className="mt-1 flex items-center gap-1.5 text-muted"><MapPin className="h-3.5 w-3.5" /> {order.governorateEn}, {order.wilayatEn} · {branchName(order.branchId)}</p>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{t("Items", "المنتجات")}</h3>
          <ul className="space-y-1.5">
            {order.items.map((i, idx) => (
              <li key={idx} className="flex justify-between gap-2 rounded-lg bg-surface-2 px-3 py-2 text-sm">
                <span className="font-medium">{i.quantity}× {i.nameEn}</span>
                <span className="text-muted">{i.unitEn}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Label>{t("Status", "الحالة")}</Label>
          <div className="flex flex-wrap gap-1.5">
            {ORDER_STATUSES.map((s) => (
              <button key={s} onClick={() => setStatus(s)} className={cn("rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-all", status === s ? STATUS_STYLE[s] + " scale-105" : "bg-surface text-muted ring-border hover:bg-surface-2")}>
                {t(STATUS_LABEL[s].en, STATUS_LABEL[s].ar)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="dc">{t("Delivery company", "شركة التوصيل")}</Label>
            <Input id="dc" value={company} onChange={(e) => setCompany(e.target.value)} placeholder={t("e.g. Aramex", "مثال: أرامكس")} />
          </div>
          <div>
            <Label htmlFor="df">{t("Delivery fee (OMR)", "رسوم التوصيل (ر.ع)")}</Label>
            <Input id="df" inputMode="decimal" value={fee} onChange={(e) => setFee(e.target.value.replace(/[^\d.]/g, ""))} placeholder="0.000" />
          </div>
        </div>

        <div>
          <Label htmlFor="tn">{t("Tracking note (visible to customer)", "ملاحظة التتبّع (يراها العميل)")}</Label>
          <Textarea id="tn" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("e.g. Driver Ahmed, ETA 5pm today", "مثال: السائق أحمد، الوصول 5 مساءً")} className="min-h-16" />
        </div>
        <div>
          <Label htmlFor="an">{t("Internal notes (private)", "ملاحظات داخلية (خاصة)")}</Label>
          <Textarea id="an" value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} className="min-h-16" />
        </div>
      </div>

      <div className="border-t border-border p-4">
        <Button onClick={save} disabled={saving} variant="gold" className="w-full">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {t("Save changes", "حفظ التغييرات")}
        </Button>
      </div>
    </SheetContent>
  );
}
