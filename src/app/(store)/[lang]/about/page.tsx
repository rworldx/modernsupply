import Link from "next/link";
import Image from "next/image";
import { isLang, t as translate, type Lang } from "@/lib/i18n";
import { company, brands, branches } from "@/data/brand";
import { products } from "@/data/products";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { accent } from "@/lib/brand-accents";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "About",
  description:
    "Modern Supply has imported and distributed premium F&B ingredients across the Sultanate of Oman since 2014.",
};

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang: Lang = isLang(raw) ? raw : "en";
  const t = (en: string, ar: string) => translate(lang, en, ar);

  // A description list of real facts, in place of the four animated counters
  // that used to sit here. Each row answers a question a buyer actually asks.
  const facts = [
    { k: t("Founded", "التأسيس"), v: String(company.since) },
    { k: t("Head office", "المكتب الرئيسي"), v: t("Muscat, Al Khoudh", "مسقط، الخوض") },
    {
      k: t("Branches", "الفروع"),
      v: t(
        `${branches.length} — Shinas, Sohar, Nizwa and two in Muscat`,
        `${branches.length} — شناص، صحار، نزوى، وفرعان في مسقط`,
      ),
    },
    {
      k: t("Brands distributed", "البراندات الموزّعة"),
      v: brands.map((b) => b.nameEn).join(", "),
    },
    {
      k: t("Products listed online", "المنتجات المدرجة أونلاين"),
      v: String(products.length),
    },
    {
      k: t("Serving", "نخدم"),
      v: t("Cafes, restaurants, bakeries and hotels", "المقاهي والمطاعم والمخابز والفنادق"),
    },
  ];

  return (
    <div>
      <section className="rail-narrow pb-14 pt-16 md:pt-24">
        <Reveal>
          <h1 className="t-display">
            {t("We keep Oman’s kitchens stocked.", "نُبقي مطابخ عُمان مجهّزة.")}
          </h1>
          <p className="t-lead mt-8">{t(company.aboutEn, company.aboutAr)}</p>
        </Reveal>
      </section>

      <section className="rail">
        <Reveal>
          <div className="relative aspect-21/9 overflow-hidden rounded-[var(--radius-xl)] bg-surface">
            <Image
              src="/images/hero.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      {/* Facts */}
      <section className="rail-narrow py-20 md:py-28">
        <Reveal>
          <h2 className="t-h2">{t("The short version", "باختصار")}</h2>
          <dl className="mt-8 border-t border-hairline">
            {facts.map((f) => (
              <div
                key={f.k}
                className="grid gap-1 border-b border-hairline py-5 sm:grid-cols-[13rem_1fr] sm:gap-6"
              >
                <dt className="text-[0.9375rem] text-muted">{f.k}</dt>
                <dd className="text-[1.0625rem]">{f.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal>
          <h2 className="t-h2 mt-20">{t("How we work", "كيف نعمل")}</h2>
          <div className="mt-6 space-y-5 text-[1.0625rem] leading-relaxed text-muted">
            <p>
              {t(
                "We import directly, hold stock in the Sultanate, and deliver from the branch closest to you. That means a cafe in Nizwa and a hotel in Sohar order the same product from the same catalogue and get it the same week.",
                "نستورد مباشرة، ونحتفظ بالمخزون داخل السلطنة، ونوصّل من أقرب فرع إليك. هذا يعني أن مقهى في نزوى وفندقاً في صحار يطلبان المنتج نفسه من الكتالوج نفسه ويستلمانه في الأسبوع ذاته.",
              )}
            </p>
            <p>
              {t(
                "Orders placed here are not charged online. You build the list, we confirm availability and the total from the branch, then we arrange delivery to your wilayat.",
                "الطلبات المقدمة هنا لا تُحصّل أونلاين. أنت تكوّن القائمة، ونؤكد نحن التوفر والإجمالي من الفرع، ثم ننسّق التوصيل إلى ولايتك.",
              )}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Brands */}
      <section className="border-y border-hairline bg-surface">
        <div className="rail py-20 md:py-24">
          <Reveal>
            <h2 className="t-h2">{t("Brands we distribute", "البراندات التي نوزّعها")}</h2>
          </Reveal>
          <div className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((b) => {
              const a = accent(b.accent);
              return (
                <Link
                  key={b.id}
                  href={`/${lang}/${b.id}`}
                  className="group flex items-center gap-3 border-b border-hairline py-4"
                >
                  <span className={cn("size-2 shrink-0 rounded-full", a.dot)} aria-hidden />
                  <span className="text-[1.0625rem] font-medium">{b.nameEn}</span>
                  <span className="ms-auto text-[0.875rem] text-muted">
                    {t(b.originEn, b.originAr)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rail-narrow py-24 text-center md:py-32">
        <Reveal>
          <h2 className="t-h1">{t("Start an order", "ابدأ طلباً")}</h2>
          <p className="t-lead mx-auto mt-4 max-w-[44ch]">
            {t(
              "Open a catalogue, add what you need, and send it to your branch in a couple of minutes.",
              "افتح كتالوجاً، أضف ما تحتاجه، وأرسله إلى فرعك في دقيقتين.",
            )}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href={`/${lang}/brands`}>{t("Browse the catalogue", "تصفح الكتالوج")}</Link>
            </Button>
            <Button asChild size="lg" variant="surface">
              <Link href={`/${lang}/contact`}>{t("Find a branch", "ابحث عن فرع")}</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
