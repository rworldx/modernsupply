import Link from "next/link";
import Image from "next/image";
import { isLang, t as translate, type Lang } from "@/lib/i18n";
import { company, brands, branches } from "@/data/brand";
import { getProductsForBrand, getCategoriesForBrand } from "@/data/products";
import { Reveal } from "@/components/motion";
import { BrandCard } from "@/components/brand-card";
import { Button } from "@/components/ui/button";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang: Lang = isLang(raw) ? raw : "en";
  const t = (en: string, ar: string) => translate(lang, en, ar);

  const stocked = brands.filter((b) => b.hasProducts).length;

  const ranges = [
    {
      src: "/images/fillings.png",
      titleEn: "Fillings & compounds",
      titleAr: "الحشوات والمركبات",
      bodyEn: "Fruit fillings, truffle and praline compounds, couverture.",
      bodyAr: "حشوات الفواكه، مركبات الترافل والبرالين، الكوفرتور.",
    },
    {
      src: "/images/sauces.png",
      titleEn: "Sauces & syrups",
      titleAr: "الصلصات والشراب",
      bodyEn: "Dessert sauces, coffee syrups, slush and frappé bases.",
      bodyAr: "صلصات الحلويات، شراب القهوة، قواعد السلاش والفرابيه.",
    },
    {
      src: "/images/ice-cream.png",
      titleEn: "Ice cream & gelato",
      titleAr: "الآيس كريم والجيلاتو",
      bodyEn: "Ice cream powders, gelato pastes, ready mixes.",
      bodyAr: "بودرة الآيس كريم، معاجين الجيلاتو، الخلطات الجاهزة.",
    },
  ];

  return (
    <div>
      {/* ===== Hero =====
          The most characteristic thing in this business is the product itself, so
          the page opens on it: one full-bleed frame of tempered chocolate, type
          set over the dark half of the image. */}
      <section className="relative isolate flex min-h-[78dvh] items-end overflow-hidden">
        <Image
          src="/images/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/25"
        />

        <div className="rail pb-16 pt-32 sm:pb-20">
          <h1 className="t-display max-w-[16ch] text-white">
            {t(
              "Every ingredient your kitchen runs on.",
              "كل مكوّن يعتمد عليه مطبخك.",
            )}
          </h1>
          <p className="t-lead mt-5 max-w-[46ch] text-white/75">
            {t(
              `${brands.length} brands of chocolate, fillings, sauces, syrups and ice cream — imported, stocked and delivered across Oman since ${company.since}.`,
              `${brands.length} براندات من الشوكولاتة والحشوات والصلصات والشراب والآيس كريم — نستوردها ونخزّنها ونوصّلها في عُمان منذ ${company.since}.`,
            )}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-black hover:opacity-85">
              <Link href={`/${lang}/brands`}>{t("Browse the catalogue", "تصفح الكتالوج")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/35 text-white hover:bg-white/10"
            >
              <Link href={`/${lang}/contact`}>{t("Talk to a branch", "تواصل مع فرع")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== Positioning =====
          One statement on a quiet band. This replaces the four animated
          counters that used to sit here; a distributor's credibility is the
          brand list below, not a number ticking up. */}
      <section className="border-b border-hairline">
        <div className="rail-narrow py-24 text-center md:py-32">
          <Reveal>
            <p className="t-h1">
              {t(
                "One supplier, one delivery, one invoice — for a shelf that would otherwise take seven.",
                "مورّد واحد، وتوصيل واحد، وفاتورة واحدة — لرفٍّ كان سيحتاج سبعة.",
              )}
            </p>
            <p className="t-lead mx-auto mt-6 max-w-[52ch]">
              {t(company.aboutEn, company.aboutAr)}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== The index ===== */}
      <section className="rail py-20 md:py-28">
        <Reveal className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="t-h1">{t("The brands", "البراندات")}</h2>
          <p className="text-[0.9375rem] tabular-nums text-muted">
            {t(
              `${stocked} catalogues online · ${brands.length} brands in total`,
              `${stocked} كتالوجات متاحة · ${brands.length} براندات إجمالاً`,
            )}
          </p>
        </Reveal>

        <ul className="mt-10 border-t border-hairline">
          {brands.map((brand, i) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              index={i}
              productCount={getProductsForBrand(brand.id).length}
              categoryCount={getCategoriesForBrand(brand.id).length}
            />
          ))}
        </ul>
      </section>

      {/* ===== What we carry ===== */}
      <section className="rail pb-20 md:pb-28">
        <Reveal>
          <h2 className="t-h1">{t("What we carry", "ما نوفّره")}</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {ranges.map((r, i) => (
            <Reveal key={r.src} delay={i * 0.06}>
              <article>
                <div className="relative aspect-4/5 overflow-hidden rounded-[var(--radius-xl)] bg-surface">
                  <Image
                    src={r.src}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="t-h3 mt-4">{t(r.titleEn, r.titleAr)}</h3>
                <p className="mt-1 text-[0.9375rem] text-muted">{t(r.bodyEn, r.bodyAr)}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== Branches ===== */}
      <section className="border-t border-hairline bg-surface">
        <div className="rail py-20 md:py-28">
          <Reveal className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="t-h1">{t("Where we are", "أين نحن")}</h2>
            <Link
              href={`/${lang}/contact`}
              className="text-[0.9375rem] text-accent underline-offset-4 hover:underline"
            >
              {t("Contact details", "تفاصيل التواصل")}
            </Link>
          </Reveal>

          <ul className="mt-10 border-t border-hairline">
            {branches.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-hairline py-5"
              >
                <span className="text-[1.0625rem] font-medium">{t(b.nameEn, b.nameAr)}</span>
                <span className="flex items-center gap-5 text-[0.875rem]">
                  {b.whatsappDisplay && (
                    <span className="hidden font-mono tabular-nums text-muted sm:inline" dir="ltr">
                      {b.whatsappDisplay}
                    </span>
                  )}
                  <a
                    href={b.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    {t("Directions", "الاتجاهات")}
                  </a>
                  {b.whatsapp && (
                    <a
                      href={`https://wa.me/${b.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline-offset-4 hover:underline"
                    >
                      {t("WhatsApp", "واتساب")}
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
