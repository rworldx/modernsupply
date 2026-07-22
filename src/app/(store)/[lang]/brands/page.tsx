import { isLang, t as translate, type Lang } from "@/lib/i18n";
import { brands } from "@/data/brand";
import { getProductsForBrand, getCategoriesForBrand } from "@/data/products";
import { Reveal } from "@/components/motion";
import { BrandCard } from "@/components/brand-card";

export const metadata = { title: "Brands" };

export default async function BrandsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang: Lang = isLang(raw) ? raw : "en";
  const t = (en: string, ar: string) => translate(lang, en, ar);

  return (
    <div className="rail py-16 md:py-24">
      <Reveal className="max-w-3xl">
        <h1 className="t-display">{t("The brands", "البراندات")}</h1>
        <p className="t-lead mt-6">
          {t(
            `${brands.length} ingredient brands from Belgium, Italy and Oman, all distributed by Modern Supply. Open a catalogue to add products to your order — pricing is confirmed by your branch.`,
            `${brands.length} براندات لمكوّنات الأغذية من بلجيكا وإيطاليا وعُمان، يوزّعها الإمداد العصري. افتح كتالوجاً لإضافة المنتجات إلى طلبك — يؤكد فرعك الأسعار.`,
          )}
        </p>
      </Reveal>

      <ul className="mt-14 border-t border-hairline">
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
    </div>
  );
}
