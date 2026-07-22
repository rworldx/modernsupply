"use client";

import { useMemo, useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { DailyPoint } from "@/lib/admin-metrics";
import { t as translate, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Range = "day" | "week" | "month";
type Metric = "orders" | "items";

function groupData(daily: DailyPoint[], range: Range) {
  if (range === "day") {
    return daily.slice(-30).map((d) => ({
      label: new Date(d.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
      orders: d.orders,
      items: d.items,
    }));
  }
  const buckets = new Map<string, { label: string; orders: number; items: number; sort: string }>();
  for (const d of daily) {
    const date = new Date(d.date);
    let key: string, label: string, sort: string;
    if (range === "week") {
      const ws = new Date(date);
      ws.setDate(date.getDate() - date.getDay());
      key = ws.toISOString().slice(0, 10);
      label = ws.toLocaleDateString("en", { month: "short", day: "numeric" });
      sort = key;
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      label = date.toLocaleDateString("en", { month: "short", year: "2-digit" });
      sort = key;
    }
    const b = buckets.get(key) ?? { label, orders: 0, items: 0, sort };
    b.orders += d.orders;
    b.items += d.items;
    buckets.set(key, b);
  }
  return Array.from(buckets.values()).sort((a, b) => a.sort.localeCompare(b.sort));
}

export function SalesChart({ daily, lang = "en" }: { daily: DailyPoint[]; lang?: Lang }) {
  const [range, setRange] = useState<Range>("day");
  const [metric, setMetric] = useState<Metric>("orders");
  const data = useMemo(() => groupData(daily, range), [daily, range]);
  const t = (en: string, ar: string) => translate(lang, en, ar);
  const rangeLabel = range === "day" ? t("day", "اليوم") : range === "week" ? t("week", "الأسبوع") : t("month", "الشهر");

  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">{t("Sales activity", "نشاط المبيعات")}</h2>
          <p className="text-xs text-muted">
            {metric === "orders" ? t("Orders", "الطلبات") : t("Items sold", "المنتجات المباعة")} · {t("by", "حسب")} {rangeLabel}
          </p>
        </div>
        <div className="flex gap-2">
          <Segmented value={metric} onChange={(v) => setMetric(v as Metric)} options={[["orders", t("Orders", "طلبات")], ["items", t("Items", "منتجات")]]} />
          <Segmented value={range} onChange={(v) => setRange(v as Range)} options={[["day", t("Day", "يوم")], ["week", t("Week", "أسبوع")], ["month", t("Month", "شهر")]]} />
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {range === "day" ? (
            <AreaChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-gold-400)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-gold-400)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted)" minTickGap={16} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted)" allowDecimals={false} width={36} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey={metric} stroke="var(--color-gold-400)" strokeWidth={2} fill="url(#g)" />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted)" minTickGap={8} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted)" allowDecimals={false} width={36} />
              <Tooltip content={<ChartTip />} cursor={{ fill: "var(--color-surface-2)" }} />
              <Bar dataKey={metric} fill="var(--color-gold-400)" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChartTip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2 text-sm shadow-lg">
      <p className="font-medium">{label}</p>
      <p className="text-muted">{payload[0].value} {payload[0].dataKey}</p>
    </div>
  );
}

function Segmented({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div className="inline-flex rounded-full border border-border bg-bg p-0.5">
      {options.map(([v, label]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn("rounded-full px-3 py-1 text-xs font-semibold transition-colors", value === v ? "bg-primary text-primary-fg" : "text-muted hover:text-fg")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
