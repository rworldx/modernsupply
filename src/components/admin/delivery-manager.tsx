"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAdminLang } from "@/context/admin-language";
import { cn } from "@/lib/utils";

export interface ZoneRow {
  governorateEn: string;
  governorateAr: string;
  feeOmr: number | null;
  active: boolean;
  configured: boolean;
}

export function DeliveryManager({ rows }: { rows: ZoneRow[] }) {
  const { t } = useAdminLang();
  const configured = rows.filter((r) => r.configured && r.active).length;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm text-muted">
        <Truck className="h-4 w-4" />
        {t(
          `${configured} of ${rows.length} governorates have an active delivery fee`,
          `${configured} من ${rows.length} محافظة لديها رسوم توصيل فعّالة`,
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 text-start font-medium">{t("Governorate", "المحافظة")}</th>
              <th className="px-4 py-3 text-start font-medium">{t("Delivery fee (OMR)", "رسوم التوصيل (ر.ع)")}</th>
              <th className="px-4 py-3 text-end font-medium">{t("Online delivery", "التوصيل أونلاين")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <ZoneEditor key={r.governorateEn} row={r} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ZoneEditor({ row }: { row: ZoneRow }) {
  const { t } = useAdminLang();
  const router = useRouter();
  const [fee, setFee] = useState(row.feeOmr == null ? "" : String(row.feeOmr));
  const [active, setActive] = useState(row.active);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async (nextActive: boolean) => {
    if (fee.trim() === "") return;
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/delivery-zones", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ governorateEn: row.governorateEn, feeOmr: Number(fee), active: nextActive }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      router.refresh();
    }
  };

  return (
    <tr className={cn("transition-colors", !active && "opacity-60")}>
      <td className="px-4 py-3">
        <div className="font-medium">{row.governorateEn}</div>
        <div className="text-xs text-muted" dir="rtl">{row.governorateAr}</div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Input
            inputMode="decimal"
            value={fee}
            onChange={(e) => setFee(e.target.value.replace(/[^\d.]/g, ""))}
            onBlur={() => fee.trim() !== "" && Number(fee) !== row.feeOmr && save(active)}
            placeholder={t("e.g. 2.000", "مثال: 2.000")}
            className="w-32 tabular-nums"
          />
          {saving && <Loader2 className="h-4 w-4 animate-spin text-muted" />}
          {saved && <Check className="h-4 w-4 text-emerald-500" />}
        </div>
      </td>
      <td className="px-4 py-3 text-end">
        <button
          type="button"
          onClick={() => {
            const next = !active;
            setActive(next);
            save(next);
          }}
          disabled={fee.trim() === ""}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors disabled:opacity-40",
            active ? "bg-emerald-500" : "bg-border",
          )}
          aria-label={t("Toggle online delivery", "تبديل التوصيل أونلاين")}
        >
          <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all", active ? "start-[22px]" : "start-0.5")} />
        </button>
      </td>
    </tr>
  );
}
