"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, Minus, Trash2, Check, Loader2, Banknote, CreditCard, Apple } from "lucide-react";
import { useCart } from "@/context/cart";
import { useLang } from "@/context/language";
import { branches } from "@/data/brand";
import { omanGovernorates } from "@/data/wilayats";
import { formatOmr } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const orderBranches = branches.filter((b) => b.whatsapp);

// Card / Apple Pay light up here the moment the Thawani gateway is wired in.
// Until then they show as "Coming soon" and only Cash on Delivery is selectable.
const ONLINE_PAYMENTS_ENABLED = false;

type PaymentMethod = "cod" | "card" | "applepay";

interface Quote {
  lines: { id: string; nameEn: string; nameAr: string; quantity: number; unitPriceOmr: number; lineTotalOmr: number }[];
  subtotalOmr: number;
  deliveryFeeOmr: number;
  totalOmr: number;
}

export default function OrderPage({ params }: { params: Promise<{ lang: string }> }) {
  use(params); // route param; the typed locale comes from the language context
  const { t, isRtl, lang } = useLang();
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const reduce = useReducedMotion();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [govIdx, setGovIdx] = useState<string>("");
  const [wilayat, setWilayat] = useState<string>("");
  const [branchId, setBranchId] = useState<string>("muscat-khoud");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ orderNumber: string; total: number | null } | null>(null);

  // Live price quote — recomputed server-side whenever the cart or governorate
  // changes. `priced` false means at least one item has no price yet (or the
  // governorate has no delivery fee), so we fall back to the WhatsApp-quote flow.
  // State is only set in the fetch continuation, never synchronously in the
  // effect body, so it can't cascade an extra render before paint.
  const [quote, setQuote] = useState<Quote | null>(null);

  const gov = govIdx !== "" ? omanGovernorates[Number(govIdx)] : null;
  const wilayatObj = gov?.wilayats.find((w) => w.en === wilayat) ?? null;
  const branch = orderBranches.find((b) => b.id === branchId) ?? orderBranches[0];
  // Gate on `gov` too: a stale quote from a previous governorate must not count
  // as priced once the governorate is cleared.
  const priced = quote != null && gov != null;

  useEffect(() => {
    if (!gov || items.length === 0) return;
    let live = true;
    fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        governorateEn: gov.en,
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
      }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => live && setQuote(j?.quote ?? null)) // any failure → unpriced → WhatsApp fallback
      .catch(() => live && setQuote(null));
    return () => {
      live = false;
    };
  }, [gov, items]);

  const valid =
    firstName.trim() &&
    lastName.trim() &&
    /^\d{8}$/.test(phone) &&
    gov &&
    wilayatObj &&
    branch &&
    items.length > 0;

  const buildWhatsApp = (orderNumber: string) => {
    const lines = items.map((i) => {
      const priceLine = quote?.lines.find((l) => l.id === i.id);
      const money = priceLine ? ` — ${formatOmr(priceLine.lineTotalOmr, lang)}` : "";
      return `• ${i.quantity}× ${t(i.nameEn, i.nameAr)} — ${t(i.unitEn, i.unitAr)}${money}`;
    });
    const totals = quote
      ? `\n${t("Subtotal", "المجموع الفرعي")}: ${formatOmr(quote.subtotalOmr, lang)}\n` +
        `${t("Delivery", "التوصيل")}: ${formatOmr(quote.deliveryFeeOmr, lang)}\n` +
        `${t("Total", "الإجمالي")}: ${formatOmr(quote.totalOmr, lang)}\n` +
        `${t("Payment", "الدفع")}: ${t("Cash on Delivery", "الدفع عند الاستلام")}`
      : `\n${t("Please confirm availability and total.", "يرجى تأكيد التوفر والإجمالي.")}`;
    const msg =
      `${t("New order", "طلب جديد")} — Modern Supply\n` +
      `${t("Order no.", "رقم الطلب")}: ${orderNumber}\n` +
      `--------------------------------\n` +
      `${t("Name", "الاسم")}: ${firstName} ${lastName}\n` +
      `${t("Phone", "الهاتف")}: +968 ${phone}\n` +
      `${t("Location", "الموقع")}: ${t(gov!.en, gov!.ar)} — ${t(wilayatObj!.en, wilayatObj!.ar)}\n` +
      `${t("Branch", "الفرع")}: ${t(branch!.nameEn, branch!.nameAr)}\n\n` +
      `${t("Items", "المنتجات")}:\n${lines.join("\n")}\n${totals}`;
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
          paymentMethod: "cod",
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 409 && json.shortages) {
          const names = json.shortages
            .map((s: { nameEn: string; available: number }) => `${s.nameEn} (${s.available})`)
            .join(", ");
          setError(t(`Some items ran low: ${names}. Please adjust quantities.`, `نفدت كمية بعض المنتجات: ${names}. يرجى تعديل الكميات.`));
        } else {
          setError(json.error ?? t("Something went wrong.", "حدث خطأ ما."));
        }
        return;
      }
      const link = buildWhatsApp(json.orderNumber);
      window.open(link, "_blank");
      clearCart();
      setSuccess({ orderNumber: json.orderNumber, total: json.totalOmr ?? null });
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
          <span className="font-mono font-medium tabular-nums text-fg">{success.orderNumber}</span>.{" "}
          {success.total != null
            ? t(
                `Pay ${success.total.toFixed(3)} OMR in cash on delivery. We opened WhatsApp so you can send it to the branch.`,
                `ادفع ${success.total.toFixed(3)} ر.ع نقداً عند الاستلام. فتحنا واتساب لإرساله إلى الفرع.`,
              )
            : t(
                "We opened WhatsApp so you can send it to the branch — they confirm availability and the total from there.",
                "فتحنا واتساب لإرساله إلى الفرع — ومن هناك يؤكدون التوفر والإجمالي.",
              )}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href={`/${lang}/track?order=${success.orderNumber}&phone=${phone}`}>
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
        {priced
          ? t(
              "Choose how you'd like to pay. Delivery is arranged to your wilayat.",
              "اختر طريقة الدفع المناسبة. يُنسّق التوصيل إلى ولايتك.",
            )
          : t(
              "The branch confirms availability and the total, then arranges delivery to your wilayat.",
              "يؤكد الفرع التوفر والإجمالي ثم ينسّق التوصيل إلى ولايتك.",
            )}
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_25rem] lg:gap-16">
        {/* Items */}
        <div>
          <h2 className="t-h3 flex items-baseline gap-2">
            {t("Items", "المنتجات")}
            <span className="text-[0.9375rem] font-normal tabular-nums text-muted">{items.length}</span>
          </h2>
          <ul className="mt-6 border-t border-hairline">
            {items.map((item) => {
              const line = quote?.lines.find((l) => l.id === item.id);
              return (
                <li key={item.id} className="flex items-center gap-4 border-b border-hairline py-5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[1.0625rem] font-medium">{t(item.nameEn, item.nameAr)}</p>
                    <p className="mt-0.5 text-[0.875rem] text-muted">{t(item.unitEn, item.unitAr)}</p>
                    {line && (
                      <p className="mt-1 font-mono text-[0.8125rem] tabular-nums text-muted">
                        {formatOmr(line.lineTotalOmr, lang)}
                      </p>
                    )}
                  </div>
                  <div className="inline-flex shrink-0 items-center rounded-[var(--radius-pill)] bg-surface">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="grid size-9 place-items-center rounded-full text-muted hover:text-fg"
                      aria-label={t("Decrease quantity", "إنقاص الكمية")}
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-7 text-center font-mono text-[0.875rem] tabular-nums">{item.quantity}</span>
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
              );
            })}
          </ul>
        </div>

        {/* Delivery details + payment */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-[var(--radius-xl)] border border-hairline bg-surface p-6 sm:p-7">
            <h2 className="t-h3">{t("Delivery details", "بيانات التوصيل")}</h2>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="fn">{t("First name", "الاسم الأول")}</Label>
                <Input id="fn" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" className="bg-bg" />
              </div>
              <div>
                <Label htmlFor="ln">{t("Last name", "اسم العائلة")}</Label>
                <Input id="ln" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" className="bg-bg" />
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
              <p
                id="ph-hint"
                className={`mt-1.5 text-[0.8125rem] ${phone && !/^\d{8}$/.test(phone) ? "text-red-600 dark:text-red-400" : "text-muted"}`}
              >
                {phone && !/^\d{8}$/.test(phone)
                  ? t("A phone number in Oman has 8 digits.", "رقم الهاتف في عُمان مكوّن من 8 أرقام.")
                  : t("8 digits, no country code.", "8 أرقام، بدون رمز الدولة.")}
              </p>
            </div>

            <div className="mt-4">
              <Label>{t("Governorate", "المحافظة")}</Label>
              <Select value={govIdx} onValueChange={(v) => { setGovIdx(v); setWilayat(""); }}>
                <SelectTrigger className="bg-bg">
                  <SelectValue placeholder={t("Select governorate", "اختر المحافظة")} />
                </SelectTrigger>
                <SelectContent>
                  {omanGovernorates.map((g, i) => (
                    <SelectItem key={g.en} value={String(i)}>{t(g.en, g.ar)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <Label>{t("Wilayat", "الولاية")}</Label>
              <Select value={wilayat} onValueChange={setWilayat} disabled={!gov}>
                <SelectTrigger className="bg-bg">
                  <SelectValue placeholder={gov ? t("Select wilayat", "اختر الولاية") : t("Pick a governorate first", "اختر المحافظة أولاً")} />
                </SelectTrigger>
                <SelectContent>
                  {gov?.wilayats.map((w) => (
                    <SelectItem key={w.en} value={w.en}>{t(w.en, w.ar)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <Label>{t("Fulfilling branch", "الفرع المنفّذ")}</Label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger className="bg-bg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {orderBranches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{t(b.nameEn, b.nameAr)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Totals — only when every item is priced and the governorate has a fee. */}
            {priced && quote && (
              <div className="mt-6 space-y-1.5 border-t border-hairline pt-5 font-mono text-[0.9375rem] tabular-nums">
                <Row label={t("Subtotal", "المجموع الفرعي")} value={formatOmr(quote.subtotalOmr, lang)} />
                <Row label={t("Delivery", "التوصيل")} value={quote.deliveryFeeOmr === 0 ? t("Free", "مجاني") : formatOmr(quote.deliveryFeeOmr, lang)} />
                <div className="flex items-baseline justify-between border-t border-hairline pt-2 text-[1.0625rem] font-semibold">
                  <span>{t("Total", "الإجمالي")}</span>
                  <span>{formatOmr(quote.totalOmr, lang)}</span>
                </div>
              </div>
            )}
            {/* Payment method — only meaningful once priced. */}
            {priced && (
              <div className="mt-6">
                <Label>{t("Payment method", "طريقة الدفع")}</Label>
                <div className="mt-2 grid gap-2">
                  <PayOption
                    icon={Banknote}
                    label={t("Cash on Delivery", "الدفع عند الاستلام")}
                    hint={t("Pay the driver in cash", "ادفع للسائق نقداً")}
                    selected={payment === "cod"}
                    onSelect={() => setPayment("cod")}
                  />
                  <PayOption
                    icon={CreditCard}
                    label={t("Visa / Mastercard", "فيزا / ماستركارد")}
                    hint={ONLINE_PAYMENTS_ENABLED ? t("Pay now by card", "ادفع الآن بالبطاقة") : t("Coming soon", "قريباً")}
                    selected={payment === "card"}
                    disabled={!ONLINE_PAYMENTS_ENABLED}
                    onSelect={() => setPayment("card")}
                  />
                  <PayOption
                    icon={Apple}
                    label="Apple Pay"
                    hint={ONLINE_PAYMENTS_ENABLED ? t("Pay now with Apple Pay", "ادفع الآن عبر Apple Pay") : t("Coming soon", "قريباً")}
                    selected={payment === "applepay"}
                    disabled={!ONLINE_PAYMENTS_ENABLED}
                    onSelect={() => setPayment("applepay")}
                  />
                </div>
              </div>
            )}

            {error && (
              <p role="alert" className="mt-5 rounded-[var(--radius-md)] bg-red-500/10 p-3 text-[0.875rem] text-red-700 dark:text-red-400">
                {error}
              </p>
            )}

            <Button onClick={submit} disabled={!valid || submitting} size="lg" className="mt-6 w-full">
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting
                ? t("Placing order", "جارٍ تقديم الطلب")
                : priced
                  ? t("Place order — Cash on Delivery", "تقديم الطلب — الدفع عند الاستلام")
                  : t("Place order", "تقديم الطلب")}
            </Button>
            <p className="mt-3 text-center text-[0.75rem] text-muted">
              {priced
                ? t("You'll confirm with the branch on WhatsApp too.", "ستؤكد مع الفرع عبر واتساب أيضاً.")
                : t("Opens WhatsApp so you can send the order to the branch.", "يفتح واتساب لإرسال الطلب إلى الفرع.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between text-muted">
      <span>{label}</span>
      <span className="text-fg">{value}</span>
    </div>
  );
}

function PayOption({
  icon: Icon,
  label,
  hint,
  selected,
  disabled,
  onSelect,
}: {
  icon: React.ElementType;
  label: string;
  hint: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-md)] border p-3 text-start transition-colors",
        selected ? "border-accent bg-accent/5" : "border-border bg-bg hover:border-fg/30",
        disabled && "cursor-not-allowed opacity-55 hover:border-border",
      )}
    >
      <Icon className={cn("size-5 shrink-0", selected ? "text-accent" : "text-muted")} strokeWidth={1.5} />
      <span className="min-w-0 flex-1">
        <span className="block text-[0.9375rem] font-medium">{label}</span>
        <span className="block text-[0.75rem] text-muted">{hint}</span>
      </span>
      <span
        className={cn(
          "grid size-4 shrink-0 place-items-center rounded-full border",
          selected ? "border-accent" : "border-border",
        )}
      >
        {selected && <span className="size-2 rounded-full bg-accent" />}
      </span>
    </button>
  );
}
