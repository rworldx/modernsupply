"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Trash2, Tag, Megaphone, Percent } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brands } from "@/data/brand";
import { categories as staticCategories } from "@/data/products";
import { useAdminLang } from "@/context/admin-language";
import { cn } from "@/lib/utils";

type Scope = "brand" | "category" | "product" | "all";

export interface DiscountRow {
  id: string;
  scope: Scope;
  targetId: string;
  percentOff: number;
  active: boolean;
  titleEn: string | null;
  titleAr: string | null;
  bodyEn: string | null;
  bodyAr: string | null;
}

const stockedBrands = brands.filter((b) => staticCategories.some((c) => c.brandId === b.id));

function targetLabel(scope: Scope, targetId: string): string {
  if (scope === "all") return "Everything";
  if (scope === "brand") return brands.find((b) => b.id === targetId)?.nameEn ?? targetId;
  if (scope === "category") return staticCategories.find((c) => c.id === targetId)?.nameEn ?? targetId;
  return targetId;
}

export function DiscountsManager({ discounts }: { discounts: DiscountRow[] }) {
  const router = useRouter();
  const { t } = useAdminLang();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<DiscountRow | null>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">
          {discounts.length === 0
            ? t("No discounts yet.", "لا توجد خصومات بعد.")
            : t(`${discounts.length} discount(s)`, `${discounts.length} خصم`)}
        </p>
        <Button variant="gold" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> {t("New discount", "خصم جديد")}
        </Button>
      </div>

      {discounts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted">
          <Tag className="mx-auto mb-3 h-8 w-8" />
          <p className="font-medium">{t("Create your first discount", "أنشئ أول خصم")}</p>
          <p className="mx-auto mt-1 max-w-sm text-sm">
            {t(
              "Pick a brand, category, or product and a percentage. Add a headline to also announce it on the storefront.",
              "اختر برانداً أو فئة أو منتجاً ونسبة. أضف عنواناً للإعلان عنه في المتجر أيضاً.",
            )}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {discounts.map((d) => (
            <button
              key={d.id}
              onClick={() => setEditing(d)}
              className={cn(
                "rounded-2xl border bg-surface p-4 text-start shadow-sm transition-all hover:shadow-md",
                d.active ? "border-border" : "border-border opacity-60",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 font-display text-2xl font-bold tabular-nums">
                    <Percent className="h-4 w-4 text-accent" />
                    {d.percentOff}%
                  </p>
                  <p className="mt-1 truncate text-sm font-medium">
                    {t(scopeLabel(d.scope).en, scopeLabel(d.scope).ar)} · {targetLabel(d.scope, d.targetId)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", d.active ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-surface-2 text-muted")}>
                    {d.active ? t("Active", "فعّال") : t("Paused", "متوقف")}
                  </span>
                  {(d.titleEn || d.titleAr) && (
                    <span className="inline-flex items-center gap-1 text-xs text-accent">
                      <Megaphone className="h-3 w-3" /> {t("Announced", "معلن")}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <Sheet open={creating} onOpenChange={setCreating}>
        {creating && <DiscountForm onDone={() => { setCreating(false); router.refresh(); }} />}
      </Sheet>

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && <DiscountForm existing={editing} onDone={() => { setEditing(null); router.refresh(); }} />}
      </Sheet>
    </div>
  );
}

function scopeLabel(scope: Scope): { en: string; ar: string } {
  switch (scope) {
    case "brand": return { en: "Brand", ar: "براند" };
    case "category": return { en: "Category", ar: "فئة" };
    case "product": return { en: "Product", ar: "منتج" };
    case "all": return { en: "Site-wide", ar: "المتجر كامل" };
  }
}

function DiscountForm({ existing, onDone }: { existing?: DiscountRow; onDone: () => void }) {
  const { t } = useAdminLang();
  const isEdit = !!existing;
  const [scope, setScope] = useState<Scope>(existing?.scope ?? "brand");
  const [brandId, setBrandId] = useState(existing?.scope === "brand" ? existing.targetId : stockedBrands[0]?.id ?? "");
  const [categoryId, setCategoryId] = useState(existing?.scope === "category" ? existing.targetId : "");
  const [productId, setProductId] = useState(existing?.scope === "product" ? existing.targetId : "");
  const [percent, setPercent] = useState(String(existing?.percentOff ?? 10));
  const [active, setActive] = useState(existing?.active ?? true);
  const [titleEn, setTitleEn] = useState(existing?.titleEn ?? "");
  const [titleAr, setTitleAr] = useState(existing?.titleAr ?? "");
  const [bodyEn, setBodyEn] = useState(existing?.bodyEn ?? "");
  const [bodyAr, setBodyAr] = useState(existing?.bodyAr ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Categories filtered to the currently-chosen brand keep the list manageable.
  const [catBrand, setCatBrand] = useState(stockedBrands[0]?.id ?? "");
  const catsForBrand = useMemo(() => staticCategories.filter((c) => c.brandId === catBrand), [catBrand]);

  const pct = Number(percent);
  const targetOk =
    scope === "all" ||
    (scope === "brand" && brandId) ||
    (scope === "category" && categoryId) ||
    (scope === "product" && productId.trim());
  const valid = pct >= 1 && pct <= 90 && targetOk;

  const save = async () => {
    if (!valid) return;
    setSaving(true); setMsg(null);

    const announce = {
      titleEn: titleEn.trim() || null,
      titleAr: titleAr.trim() || null,
      bodyEn: bodyEn.trim() || null,
      bodyAr: bodyAr.trim() || null,
    };

    let res: Response;
    if (isEdit) {
      // Scope/target are fixed after creation; only rate, status and copy change.
      res = await fetch(`/api/admin/discounts/${existing!.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ percentOff: pct, active, ...announce }),
      });
    } else {
      const targetId = scope === "brand" ? brandId : scope === "category" ? categoryId : scope === "product" ? productId.trim() : "";
      res = await fetch("/api/admin/discounts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, targetId, percentOff: pct, active, ...announce }),
      });
    }

    setSaving(false);
    if (res.ok) { onDone(); return; }
    const j = await res.json().catch(() => ({}));
    setMsg(j.error ?? t("Could not save.", "تعذّر الحفظ."));
  };

  const del = async () => {
    if (!existing) return;
    if (!confirm(t("Delete this discount?", "حذف هذا الخصم؟"))) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/discounts/${existing.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) onDone(); else setMsg(t("Could not delete.", "تعذّر الحذف."));
  };

  return (
    <SheetContent side="end" title={isEdit ? "Edit discount" : "New discount"} className="w-full max-w-md p-0">
      <div className="flex items-center gap-2 border-b border-border px-6 py-5">
        <Tag className="h-5 w-5 text-accent" />
        <p className="text-lg font-bold">{isEdit ? t("Edit discount", "تعديل الخصم") : t("New discount", "خصم جديد")}</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        {/* Scope is immutable once created: changing what a live discount targets
            silently reprices a different set of products, so edits are rate/copy only. */}
        <div>
          <Label>{t("Applies to", "يُطبّق على")}</Label>
          <Select value={scope} onValueChange={(v) => setScope(v as Scope)} disabled={isEdit}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="brand">{t("A whole brand", "براند كامل")}</SelectItem>
              <SelectItem value="category">{t("A category", "فئة")}</SelectItem>
              <SelectItem value="product">{t("A single product", "منتج واحد")}</SelectItem>
              <SelectItem value="all">{t("Everything (site-wide)", "كل شيء (المتجر كامل)")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!isEdit && scope === "brand" && (
          <div>
            <Label>{t("Brand", "البراند")}</Label>
            <Select value={brandId} onValueChange={setBrandId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{stockedBrands.map((b) => <SelectItem key={b.id} value={b.id}>{b.nameEn}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}

        {!isEdit && scope === "category" && (
          <>
            <div>
              <Label>{t("Brand", "البراند")}</Label>
              <Select value={catBrand} onValueChange={(v) => { setCatBrand(v); setCategoryId(""); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{stockedBrands.map((b) => <SelectItem key={b.id} value={b.id}>{b.nameEn}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("Category", "الفئة")}</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue placeholder={t("Select category", "اختر الفئة")} /></SelectTrigger>
                <SelectContent>{catsForBrand.map((c) => <SelectItem key={c.id} value={c.id}>{t(c.nameEn, c.nameAr)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </>
        )}

        {!isEdit && scope === "product" && (
          <div>
            <Label htmlFor="pid">{t("Product ID", "معرّف المنتج")}</Label>
            <Input id="pid" value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="cr-creams-mango-cream-5kg" />
            <p className="mt-1 text-xs text-muted">{t("The product's id, copied from the Inventory page.", "معرّف المنتج، منسوخ من صفحة المخزون.")}</p>
          </div>
        )}

        {isEdit && (
          <div className="rounded-xl bg-surface-2 px-4 py-3 text-sm">
            <span className="text-muted">{t("Applies to", "يُطبّق على")}: </span>
            <span className="font-medium">{t(scopeLabel(existing!.scope).en, scopeLabel(existing!.scope).ar)} · {targetLabel(existing!.scope, existing!.targetId)}</span>
          </div>
        )}

        <div>
          <Label htmlFor="pc">{t("Percentage off", "نسبة الخصم")}</Label>
          <div className="relative">
            <Input id="pc" inputMode="numeric" value={percent} onChange={(e) => setPercent(e.target.value.replace(/[^\d]/g, ""))} className="pe-8" />
            <Percent className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
          <p className="mt-1 text-xs text-muted">{t("Between 1 and 90.", "بين 1 و 90.")}</p>
        </div>

        <label className="flex items-center justify-between rounded-xl border border-border p-3">
          <span className="font-medium">{t("Active", "فعّال")}</span>
          <button type="button" onClick={() => setActive((v) => !v)} className={cn("relative h-6 w-11 rounded-full transition-colors", active ? "bg-emerald-500" : "bg-border")}>
            <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all", active ? "start-[22px]" : "start-0.5")} />
          </button>
        </label>

        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-accent" />
            <p className="text-sm font-semibold">{t("Announcement (optional)", "الإعلان (اختياري)")}</p>
          </div>
          <p className="mb-3 mt-1 text-xs text-muted">
            {t("Fill a headline to pop up this offer for visitors on the storefront.", "املأ عنواناً لإظهار هذا العرض للزوار في المتجر.")}
          </p>
          <div className="space-y-3">
            <div>
              <Label htmlFor="te">{t("Headline (English)", "العنوان (إنجليزي)")}</Label>
              <Input id="te" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Ramadan offer" />
            </div>
            <div>
              <Label htmlFor="ta">{t("Headline (Arabic)", "العنوان (عربي)")}</Label>
              <Input id="ta" dir="rtl" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} placeholder="عرض رمضان" />
            </div>
            <div>
              <Label htmlFor="be">{t("Details (English)", "التفاصيل (إنجليزي)")}</Label>
              <Input id="be" value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} placeholder="On all Cremino creams, this week only." />
            </div>
            <div>
              <Label htmlFor="ba">{t("Details (Arabic)", "التفاصيل (عربي)")}</Label>
              <Input id="ba" dir="rtl" value={bodyAr} onChange={(e) => setBodyAr(e.target.value)} placeholder="على جميع كريمات كريمينو، هذا الأسبوع فقط." />
            </div>
          </div>
        </div>

        {msg && <p className="text-sm text-rose-600 dark:text-rose-400">{msg}</p>}
      </div>

      <div className="flex gap-2 border-t border-border p-4">
        {isEdit && (
          <Button variant="ghost" onClick={del} disabled={deleting} className="text-rose-600 hover:bg-rose-500/10 dark:text-rose-400">
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        )}
        <Button variant="gold" onClick={save} disabled={!valid || saving} className="flex-1">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? null : <Plus className="h-4 w-4" />}
          {isEdit ? t("Save changes", "حفظ التغييرات") : t("Create discount", "إنشاء الخصم")}
        </Button>
      </div>
    </SheetContent>
  );
}
