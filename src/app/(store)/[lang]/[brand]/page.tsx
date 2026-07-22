import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Instagram } from "@/components/icons";
import { isLang, t as translate, type Lang } from "@/lib/i18n";
import { brands } from "@/data/brand";
import { getBrandCatalog } from "@/lib/catalog";
import { accent } from "@/lib/brand-accents";
import { BrandCatalog } from "@/components/brand-catalog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Live inventory: render on demand so stock reflects admin changes immediately.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return brands.flatMap((b) =>
    (["en", "ar"] as const).map((lang) => ({ lang, brand: b.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; brand: string }>;
}): Promise<Metadata> {
  const { brand } = await params;
  const b = brands.find((x) => x.id === brand);
  return b
    ? { title: b.nameEn, description: b.descriptionEn }
    : { title: "Brand" };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ lang: string; brand: string }>;
}) {
  const { lang: raw, brand: brandId } = await params;
  const lang: Lang = isLang(raw) ? raw : "en";
  const t = (en: string, ar: string) => translate(lang, en, ar);
  const Back = lang === "ar" ? ChevronRight : ChevronLeft;

  const brand = brands.find((b) => b.id === brandId);
  if (!brand) notFound();

  const a = accent(brand.accent);
  const isPlaceholder = brand.originEn === "Coming Soon";
  const { products, categories } = isPlaceholder
    ? { products: [], categories: [] }
    : await getBrandCatalog(brand.id);
  const hasCatalog = products.length > 0;

  return (
    <div>
      {/* Brand masthead. The tint appears once, on the monogram — the page around
          it stays monochrome so the products carry the colour. */}
      <section className="rail border-b border-hairline pb-10 pt-8 md:pb-14">
        <Link
          href={`/${lang}/brands`}
          className="inline-flex items-center gap-1 text-[0.875rem] text-muted transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)] hover:text-fg"
        >
          <Back className="size-4" strokeWidth={1.5} />
          {t("All brands", "كل البراندات")}
        </Link>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-5">
              <span
                aria-hidden
                className={cn(
                  "grid size-16 shrink-0 place-items-center rounded-[var(--radius-lg)] text-3xl font-semibold tracking-[-0.03em]",
                  a.soft,
                  a.text,
                )}
              >
                {brand.nameEn.charAt(0)}
              </span>
              <div>
                <h1 className="t-h1">{brand.nameEn}</h1>
                <p className="mt-1 text-[0.9375rem] text-muted">
                  {t(brand.originEn, brand.originAr)}
                  {hasCatalog && (
                    <span className="tabular-nums">
                      {" · "}
                      {products.length} {t("products", "منتج")}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <p className="t-lead mt-6">{t(brand.descriptionEn, brand.descriptionAr)}</p>
          </div>

          {brand.instagramUrl && (
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 self-start text-[0.9375rem] text-accent underline-offset-4 hover:underline md:self-auto"
            >
              <Instagram className="size-4" />@{brand.instagramHandle}
            </a>
          )}
        </div>
      </section>

      <section className="rail py-10">
        {hasCatalog ? (
          <BrandCatalog products={products} categories={categories} />
        ) : (
          // Empty states say what is happening and give one clear next action.
          <div className="mx-auto max-w-md py-20 text-center">
            <h2 className="t-h2">
              {isPlaceholder
                ? t("Not announced yet", "لم يُعلن عنه بعد")
                : t("Catalogue in preparation", "الكتالوج قيد التجهيز")}
            </h2>
            <p className="t-lead mt-4">
              {isPlaceholder
                ? t(
                    "This brand joins the Modern Supply range soon. Ask a branch what it will cover.",
                    "ينضم هذا البراند إلى تشكيلة الإمداد العصري قريباً. اسأل أحد الفروع عمّا سيشمله.",
                  )
                : t(
                    `${brand.nameEn} products are stocked but not yet listed online. A branch can confirm availability and pricing today.`,
                    `منتجات ${brand.nameEn} متوفرة لكنها غير مدرجة أونلاين بعد. يمكن لأي فرع تأكيد التوفر والأسعار اليوم.`,
                  )}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <a
                  href={`https://wa.me/96893806780?text=${encodeURIComponent(
                    `${t("Question about", "سؤال عن")} ${brand.nameEn} — Modern Supply`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("Ask about this brand", "اسأل عن هذا البراند")}
                </a>
              </Button>
              <Button asChild variant="surface">
                <Link href={`/${lang}/brands`}>{t("See other brands", "شاهد براندات أخرى")}</Link>
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
