"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Loader2, Save, Trash2, PackagePlus, Boxes, AlertTriangle, XCircle, CheckCircle2, EyeOff } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brands } from "@/data/brand";
import { categories as staticCategories } from "@/data/products";
import { useAdminLang } from "@/context/admin-language";
import { stockLevel, STOCK_STYLE, type StockLevel } from "@/lib/inventory";
import { cn } from "@/lib/utils";

export interface InventoryRow {
  id: string;
  nameEn: string;
  nameAr: string;
  brandId: string;
  brandName: string;
  brandNameAr: string;
  categoryId: string;
  categoryName: string;
  categoryNameAr: string;
  unitEn: string;
  stock: number;
  lowStockThreshold: number;
  active: boolean;
}

const stockedBrands = brands.filter((b) => staticCategories.some((c) => c.brandId === b.id));

export function InventoryManager({ products }: { products: InventoryRow[] }) {
  const router = useRouter();
  const { t } = useAdminLang();
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<string>("all");
  const [level, setLevel] = useState<StockLevel | "all" | "delisted">("all");
  const [selected, setSelected] = useState<InventoryRow | null>(null);
  const [adding, setAdding] = useState(false);

  const levelOf = (p: InventoryRow): StockLevel => (p.active ? stockLevel(p.stock, p.lowStockThreshold) : "out");

  const counts = useMemo(() => {
    let inS = 0, low = 0, out = 0, delisted = 0;
    for (const p of products) {
      if (!p.active) { delisted++; continue; }
      const l = stockLevel(p.stock, p.lowStockThreshold);
      if (l === "in") inS++; else if (l === "low") low++; else out++;
    }
    return { inS, low, out, delisted };
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (brand !== "all" && p.brandId !== brand) return false;
      if (level === "delisted" && p.active) return false;
      if (level !== "all" && level !== "delisted" && (!p.active || stockLevel(p.stock, p.lowStockThreshold) !== level)) return false;
      if (!q) return true;
      return p.nameEn.toLowerCase().includes(q) || p.nameAr.includes(query.trim()) || p.categoryName.toLowerCase().includes(q);
    });
  }, [products, query, brand, level]);

  return (
    <div>
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard icon={CheckCircle2} tone="text-emerald-500" label={t("In stock", "متوفر")} value={counts.inS} onClick={() => setLevel("in")} active={level === "in"} />
        <SummaryCard icon={AlertTriangle} tone="text-amber-500" label={t("Low stock", "منخفض")} value={counts.low} onClick={() => setLevel("low")} active={level === "low"} />
        <SummaryCard icon={XCircle} tone="text-rose-500" label={t("Out of stock", "نفد")} value={counts.out} onClick={() => setLevel("out")} active={level === "out"} />
        <SummaryCard icon={EyeOff} tone="text-muted" label={t("Delisted", "مخفي")} value={counts.delisted} onClick={() => setLevel("delisted")} active={level === "delisted"} />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Search products…", "ابحث عن منتجات…")} className="ps-9" />
        </div>
        <div className="sm:w-48">
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All brands", "كل البراندات")}</SelectItem>
              {stockedBrands.map((b) => <SelectItem key={b.id} value={b.id}>{b.nameEn}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {level !== "all" && (
          <Button variant="ghost" size="sm" onClick={() => setLevel("all")}>{t("Clear filter", "مسح التصفية")}</Button>
        )}
        <Button variant="gold" className="sm:ms-auto" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" /> {t("Add product", "إضافة منتج")}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 text-start font-medium">{t("Product", "المنتج")}</th>
              <th className="hidden px-4 py-3 text-start font-medium md:table-cell">{t("Brand", "البراند")}</th>
              <th className="hidden px-4 py-3 text-start font-medium lg:table-cell">{t("Category", "الفئة")}</th>
              <th className="px-4 py-3 text-end font-medium">{t("Stock", "المخزون")}</th>
              <th className="px-4 py-3 text-start font-medium">{t("Status", "الحالة")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="py-16 text-center text-muted"><Boxes className="mx-auto mb-2 h-8 w-8" />{t("No products match.", "لا توجد منتجات مطابقة.")}</td></tr>
            ) : filtered.map((p) => {
              const l = levelOf(p);
              const s = STOCK_STYLE[l];
              return (
                <tr key={p.id} onClick={() => setSelected(p)} className={cn("cursor-pointer transition-colors hover:bg-surface-2", !p.active && "opacity-55")}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.nameEn}</div>
                    <div className="text-xs text-muted" dir="rtl">{p.nameAr}</div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted md:table-cell">{p.brandName}</td>
                  <td className="hidden px-4 py-3 text-muted lg:table-cell">{t(p.categoryName, p.categoryNameAr)}</td>
                  <td className="px-4 py-3 text-end font-bold tabular-nums">{p.stock}</td>
                  <td className="px-4 py-3">
                    {p.active ? (
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1", s.bg, s.text, s.ring)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
                        {l === "in" ? t("In stock", "متوفر") : l === "low" ? t("Low", "منخفض") : t("Out", "نفد")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted">
                        <EyeOff className="h-3 w-3" /> {t("Delisted", "مخفي")}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && <EditProduct product={selected} onDone={() => { setSelected(null); router.refresh(); }} />}
      </Sheet>

      <Sheet open={adding} onOpenChange={setAdding}>
        {adding && <AddProduct onDone={() => { setAdding(false); router.refresh(); }} />}
      </Sheet>
    </div>
  );
}

function SummaryCard({ icon: Icon, tone, label, value, onClick, active }: { icon: React.ElementType; tone: string; label: string; value: number; onClick: () => void; active: boolean }) {
  return (
    <button onClick={onClick} className={cn("rounded-2xl border bg-surface p-4 text-start shadow-sm transition-all hover:shadow-md", active ? "border-accent ring-2 ring-accent/30" : "border-border")}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{label}</span>
        <Icon className={cn("h-4 w-4", tone)} />
      </div>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
    </button>
  );
}

function EditProduct({ product, onDone }: { product: InventoryRow; onDone: () => void }) {
  const { t } = useAdminLang();
  const [restock, setRestock] = useState("");
  const [setStock, setSetStock] = useState("");
  const [threshold, setThreshold] = useState(String(product.lowStockThreshold));
  const [active, setActive] = useState(product.active);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const projected = (() => {
    let s = product.stock;
    if (setStock.trim()) s = Number(setStock);
    if (restock.trim()) s += Number(restock);
    return Math.max(0, s);
  })();

  const save = async () => {
    setSaving(true); setMsg(null);
    const body: Record<string, unknown> = { lowStockThreshold: Number(threshold), active };
    if (setStock.trim()) body.setStock = Number(setStock);
    if (restock.trim()) body.restock = Number(restock);
    const res = await fetch(`/api/admin/products/${product.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    if (res.ok) onDone(); else setMsg(t("Could not save changes.", "تعذّر حفظ التغييرات."));
  };

  const del = async () => {
    if (!confirm(t(`Delete "${product.nameEn}"? This cannot be undone.`, `حذف "${product.nameEn}"؟ لا يمكن التراجع.`))) return;
    setDeleting(true); setMsg(null);
    const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) { onDone(); return; }
    const j = await res.json().catch(() => ({}));
    setMsg(j.message ?? t("Could not delete. Try delisting instead.", "تعذّر الحذف. جرّب الإخفاء بدلاً من ذلك."));
  };

  return (
    <SheetContent side="end" title={product.nameEn} className="w-full max-w-md p-0">
      <div className="border-b border-border px-6 py-5">
        <p className="text-lg font-bold">{product.nameEn}</p>
        <p className="text-sm text-muted" dir="rtl">{product.nameAr}</p>
        <p className="mt-1 text-xs text-muted">{product.brandName} · {t(product.categoryName, product.categoryNameAr)} · {product.unitEn}</p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        <div className="rounded-2xl bg-surface-2 p-4 text-center">
          <p className="text-xs text-muted">{t("Current stock", "المخزون الحالي")}</p>
          <p className="font-display text-4xl font-bold">{product.stock}</p>
          {(restock.trim() || setStock.trim()) && (
            <p className="mt-1 text-sm text-accent">→ {t("becomes", "يصبح")} {projected}</p>
          )}
        </div>

        <div>
          <Label htmlFor="rs">{t("Add to stock (restock)", "إضافة للمخزون (تخزين)")}</Label>
          <Input id="rs" inputMode="numeric" value={restock} onChange={(e) => setRestock(e.target.value.replace(/[^\d-]/g, ""))} placeholder={t("e.g. 50", "مثال: 50")} />
          <p className="mt-1 text-xs text-muted">{t("Adds to the current count. Use a negative number to correct down.", "يُضاف إلى العدد الحالي. استخدم رقماً سالباً للتصحيح للأسفل.")}</p>
        </div>

        <div>
          <Label htmlFor="ss">{t("Or set exact stock", "أو حدّد المخزون بالضبط")}</Label>
          <Input id="ss" inputMode="numeric" value={setStock} onChange={(e) => setSetStock(e.target.value.replace(/[^\d]/g, ""))} placeholder={t(`Currently ${product.stock}`, `حالياً ${product.stock}`)} />
        </div>

        <div>
          <Label htmlFor="th">{t("Low-stock threshold", "حد المخزون المنخفض")}</Label>
          <Input id="th" inputMode="numeric" value={threshold} onChange={(e) => setThreshold(e.target.value.replace(/[^\d]/g, ""))} />
          <p className="mt-1 text-xs text-muted">{t("At or below this, the item shows yellow “Low stock”.", "عند هذا الحد أو أقل، يظهر المنتج باللون الأصفر «منخفض».")}</p>
        </div>

        <label className="flex items-center justify-between rounded-xl border border-border p-3">
          <span>
            <span className="font-medium">{t("Listed in store", "معروض في المتجر")}</span>
            <span className="block text-xs text-muted">{t("Turn off to hide from customers (delist).", "أطفئه لإخفائه عن العملاء.")}</span>
          </span>
          <button type="button" onClick={() => setActive((v) => !v)} className={cn("relative h-6 w-11 rounded-full transition-colors", active ? "bg-emerald-500" : "bg-border")}>
            <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all", active ? "start-[22px]" : "start-0.5")} />
          </button>
        </label>

        {msg && <p className="text-sm text-rose-600 dark:text-rose-400">{msg}</p>}
      </div>

      <div className="flex gap-2 border-t border-border p-4">
        <Button variant="ghost" onClick={del} disabled={deleting} className="text-rose-600 hover:bg-rose-500/10 dark:text-rose-400">
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
        <Button variant="gold" onClick={save} disabled={saving} className="flex-1">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {t("Save", "حفظ")}
        </Button>
      </div>
    </SheetContent>
  );
}

function AddProduct({ onDone }: { onDone: () => void }) {
  const { t } = useAdminLang();
  const [brandId, setBrandId] = useState(stockedBrands[0]?.id ?? "");
  const [categoryId, setCategoryId] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [stock, setStock] = useState("0");
  const [threshold, setThreshold] = useState("10");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const brandCats = staticCategories.filter((c) => c.brandId === brandId);
  const valid = brandId && categoryId && nameEn.trim() && nameAr.trim();

  const save = async () => {
    if (!valid) return;
    setSaving(true); setMsg(null);
    const res = await fetch("/api/admin/products", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, nameEn: nameEn.trim(), nameAr: nameAr.trim(), stock: Number(stock) || 0, lowStockThreshold: Number(threshold) || 10 }),
    });
    setSaving(false);
    if (res.ok) onDone(); else setMsg(t("Could not create product.", "تعذّر إنشاء المنتج."));
  };

  return (
    <SheetContent side="end" title="Add product" className="w-full max-w-md p-0">
      <div className="flex items-center gap-2 border-b border-border px-6 py-5">
        <PackagePlus className="h-5 w-5 text-accent" />
        <p className="text-lg font-bold">{t("Add product", "إضافة منتج")}</p>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        <div>
          <Label>{t("Brand", "البراند")}</Label>
          <Select value={brandId} onValueChange={(v) => { setBrandId(v); setCategoryId(""); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{stockedBrands.map((b) => <SelectItem key={b.id} value={b.id}>{b.nameEn}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>{t("Category", "الفئة")}</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger><SelectValue placeholder={t("Select category", "اختر الفئة")} /></SelectTrigger>
            <SelectContent>{brandCats.map((c) => <SelectItem key={c.id} value={c.id}>{t(c.nameEn, c.nameAr)}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="ne">{t("Name (English)", "الاسم (إنجليزي)")}</Label>
          <Input id="ne" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="na">{t("Name (Arabic)", "الاسم (عربي)")}</Label>
          <Input id="na" dir="rtl" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="st">{t("Initial stock", "المخزون الأولي")}</Label>
            <Input id="st" inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value.replace(/[^\d]/g, ""))} />
          </div>
          <div>
            <Label htmlFor="th2">{t("Low threshold", "حد الانخفاض")}</Label>
            <Input id="th2" inputMode="numeric" value={threshold} onChange={(e) => setThreshold(e.target.value.replace(/[^\d]/g, ""))} />
          </div>
        </div>
        {msg && <p className="text-sm text-rose-600 dark:text-rose-400">{msg}</p>}
      </div>
      <div className="border-t border-border p-4">
        <Button variant="gold" className="w-full" onClick={save} disabled={!valid || saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {t("Create product", "إنشاء المنتج")}
        </Button>
      </div>
    </SheetContent>
  );
}
