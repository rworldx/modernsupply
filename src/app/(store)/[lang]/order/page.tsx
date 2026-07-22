"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, Minus, Trash2, Check, Loader2 } from "lucide-react";
import { useCart } from "@/context/cart";
import { useLang } from "@/context/language";
import { branches } from "@/data/brand";
import { omanGovernorates } from "@/data/wilayats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const orderBranches = branches.filter((b) => b.whatsapp);

export default function OrderPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const { t, isRtl } = useLang();
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const reduce = useReducedMotion();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [govIdx, setGovIdx] = useState<string>("");
  const [wilayat, setWilayat] = useState<string>("");
  const [branchId, setBranchId] = useState<string>("muscat-khoud");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const gov = govIdx !== "" ? omanGovernorates[Number(govIdx)] : null;
  const wilayatObj = gov?.wilayats.find((w) => w.en === wilayat) ?? null;
  const branch = orderBranches.find((b) => b.id === branchId) ?? orderBranches[0];

  const valid =
    firstName.trim() &&
    lastName.trim() &&
    /^\d{8}$/.test(phone) &&
    gov &&
    wilayatObj &&
    branch &&
    items.length > 0;

  const buildWhatsApp = (orderNumber: string) => {
    const lines = items.map(
      (i) => `• ${i.quantity}× ${t(i.nameEn, i.nameAr)} — ${t(i.unitEn, i.unitAr)}`,
    );
    const msg =
      `${t("New order", "طلب جديد")} — Modern Supply\n` +
      `${t("Order no.", "رقم الطلب")}: ${orderNumber}\n` +
      `--------------------------------\n` +
      `${t("Name", "الاسم")}: ${firstName} ${lastName}\n` +
      `${t("Phone", "الهاتف")}: +968 ${phone}\n` +
      `${t("Location", "الموقع")}: ${t(gov!.en, gov!.ar)} — ${t(wilayatObj!.en, wilayatObj!.ar)}\n` +
      `${t("Branch", "الفرع")}: ${t(branch!.nameEn, branch!.nameAr)}\n\n` +
      `${t("Items", "المنتجات")}:\n${lines.join("\n")}\n\n` +
      `${t("Please confirm availability and total.", "يرجى تأكيد التوفر والإجمالي.")}`;
    return `https://wa.me/${branch!.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  const submit = async () => {
    if (!valid) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone,
          governorateEn: gov!.en,
          governorateAr: gov!.ar,
          wilayatEn: wilayatObj!.en,
          wilayatAr: wilayatObj!.ar,
          branchId: branch!.id,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 409 && json.shortages) {
          const names = json.shortages.map((s: { nameEn: string; available: number }) => `${s.nameEn} (${s.available})`).join(", ");
          setError(t(`Some items ran low: ${names}. Please adjust quantities.`, `نفدت كمية بعض المنتجات: ${names}. يرجى تعديل الكميات.`));
        } else {
          setError(json.error ?? t("Something went wrong.", "حدث خطأ ما."));
        }
        return;
      }
      // success — open WhatsApp then clear
      const link = buildWhatsApp(json.orderNumber);
      window.open(link, "_blank");
      clearCart();
      setSuccess(json.orderNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(t("Network error. Please try again.", "خطأ في الشبكة. حاول مرة أخرى."));
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Success ----
  if (success) {
    return (
      <div className="rail-narrow flex flex-col items-center py-28 text-center">
        <motion.span
          initial={reduce ? false : { scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          className="grid size-16 place-items-center rounded-full bg-accent text-accent-fg"
        >
          <Check className="size-8" strokeWidth={2} />
        </motion.span>
        <h1 className="t-h1 mt-8">{t("Order placed", "تم تقديم الطلب")}</h1>
        <p className="t-lead mt-4 max-w-[46ch]">
          {t("Your reference is", "رقمك المرجعي هو")}{" "}
          <span className="font-mono font-medium tabular-nums text-fg">{success}</span>.{" "}
          {t(
            "We opened WhatsApp so you can send it to the branch — they confirm availability and the total from there.",
            "فتحنا واتساب لإرساله إلى الفرع — ومن هناك يؤكدون التوفر والإجمالي.",
          )}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href={`/${lang}/track?order=${success}&phone=${phone}`}>
              {t("Track this order", "تتبع هذا الطلب")}
            </Link>
          </Button>
          <Button asChild size="lg" variant="surface">
            <Link href={`/${lang}/brands`}>{t("Keep browsing", "متابعة التصفح")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ---- Empty ----
  if (items.length === 0) {
    return (
      <div className="rail-narrow flex flex-col items-center py-28 text-center">
        <h1 className="t-h1">{t("Your order is empty", "طلبك فارغ")}</h1>
        <p className="t-lead mt-4 max-w-[42ch]">
          {t(
            "Add products from any brand catalogue and they collect here, ready to send to a branch.",
            "أضف منتجات من كتالوج أي براند لتتجمع هنا وتصبح جاهزة للإرسال إلى فرع.",
          )}
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href={`/${lang}/brands`}>{t("Browse the brands", "تصفح البراندات")}</Link>
        </Button>
      </div>
    );
  }

  // ---- Checkout ----
  return (
    <div className="rail py-16 md:py-20">
      <h1 className="t-display">{t("Review your order", "مراجعة طلبك")}</h1>
      <p className="t-lead mt-5 max-w-[54ch]">
        {t(
          "Nothing is charged here. The branch confirms availability and the total, then arranges delivery to your wilayat.",
          "لا يتم تحصيل أي مبلغ هنا. يؤكد الفرع التوفر والإجمالي ثم ينسّق التوصيل إلى ولايتك.",
        )}
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_25rem] lg:gap-16">
        {/* Items */}
        <div>
          <h2 className="t-h3 flex items-baseline gap-2">
            {t("Items", "المنتجات")}
            <span className="text-[0.9375rem] font-normal tabular-nums text-muted">
              {items.length}
            </span>
          </h2>
          <ul className="mt-6 border-t border-hairline">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 border-b border-hairline py-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[1.0625rem] font-medium">
                    {t(item.nameEn, item.nameAr)}
                  </p>
                  <p className="mt-0.5 text-[0.875rem] text-muted">
                    {t(item.unitEn, item.unitAr)}
                  </p>
                </div>
                <div className="inline-flex shrink-0 items-center rounded-[var(--radius-pill)] bg-surface">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="grid size-9 place-items-center rounded-full text-muted hover:text-fg"
                    aria-label={t("Decrease quantity", "إنقاص الكمية")}
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-7 text-center font-mono text-[0.875rem] tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="grid size-9 place-items-center rounded-full text-muted hover:text-fg"
                    aria-label={t("Increase quantity", "زيادة الكمية")}
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:text-fg"
                  aria-label={t("Remove", "إزالة")}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Delivery details */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-[var(--radius-xl)] border border-hairline bg-surface p-6 sm:p-7">
            <h2 className="t-h3">{t("Delivery details", "بيانات التوصيل")}</h2>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="fn">{t("First name", "الاسم الأول")}</Label>
                <Input
                  id="fn"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  className="bg-bg"
                />
              </div>
              <div>
                <Label htmlFor="ln">{t("Last name", "اسم العائلة")}</Label>
                <Input
                  id="ln"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  className="bg-bg"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="ph">{t("Phone", "الهاتف")}</Label>
              <div className="flex items-center gap-2" dir="ltr">
                <span className="grid h-12 shrink-0 place-items-center rounded-[var(--radius-md)] border border-border bg-bg px-3 font-mono text-[0.9375rem] text-muted">
                  +968
                </span>
                <Input
                  id="ph"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={8}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  placeholder="9XXXXXXX"
                  aria-describedby="ph-hint"
                  className={`bg-bg font-mono tabular-nums ${isRtl ? "text-left" : ""}`}
                />
              </div>
              {/* Validate inline, next to where the action happens. */}
              <p
                id="ph-hint"
                className={`mt-1.5 text-[0.8125rem] ${
                  phone && !/^\d{8}$/.test(phone) ? "text-red-600 dark:text-red-400" : "text-muted"
                }`}
              >
                {phone && !/^\d{8}$/.test(phone)
                  ? t("A phone number in Oman has 8 digits.", "رقم الهاتف في عُمان مكوّن من 8 أرقام.")
                  : t("8 digits, no country code.", "8 أرقام، بدون رمز الدولة.")}
              </p>
            </div>

            <div className="mt-4">
              <Label>{t("Governorate", "المحافظة")}</Label>
              <Select
                value={govIdx}
                onValueChange={(v) => {
                  setGovIdx(v);
                  setWilayat("");
                }}
              >
                <SelectTrigger className="bg-bg">
                  <SelectValue placeholder={t("Select governorate", "اختر المحافظة")} />
                </SelectTrigger>
                <SelectContent>
                  {omanGovernorates.map((g, i) => (
                    <SelectItem key={g.en} value={String(i)}>
                      {t(g.en, g.ar)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <Label>{t("Wilayat", "الولاية")}</Label>
              <Select value={wilayat} onValueChange={setWilayat} disabled={!gov}>
                <SelectTrigger className="bg-bg">
                  <SelectValue
                    placeholder={
                      gov
                        ? t("Select wilayat", "اختر الولاية")
                        : t("Pick a governorate first", "اختر المحافظة أولاً")
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {gov?.wilayats.map((w) => (
                    <SelectItem key={w.en} value={w.en}>
                      {t(w.en, w.ar)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <Label>{t("Fulfilling branch", "الفرع المنفّذ")}</Label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger className="bg-bg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {orderBranches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {t(b.nameEn, b.nameAr)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-[var(--radius-md)] bg-red-500/10 p-3 text-[0.875rem] text-red-700 dark:text-red-400"
              >
                {error}
              </p>
            )}

            <Button
              onClick={submit}
              disabled={!valid || submitting}
              size="lg"
              className="mt-6 w-full"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting
                ? t("Placing order", "جارٍ تقديم الطلب")
                : t("Place order", "تقديم الطلب")}
            </Button>
            <p className="mt-3 text-center text-[0.75rem] text-muted">
              {t(
                "Opens WhatsApp so you can send the order to the branch.",
                "يفتح واتساب لإرسال الطلب إلى الفرع.",
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
