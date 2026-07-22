import { Instagram } from "@/components/icons";
import { isLang, t as translate, type Lang } from "@/lib/i18n";
import { company, brands, branches } from "@/data/brand";
import { Reveal } from "@/components/motion";
import { InquiryForm } from "@/components/inquiry-form";

export const metadata = {
  title: "Contact",
  description:
    "Five Modern Supply branches across the Sultanate of Oman — Shinas, Sohar, Nizwa and two in Muscat.",
};

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang: Lang = isLang(raw) ? raw : "en";
  const t = (en: string, ar: string) => translate(lang, en, ar);
  const brandsWithIg = brands.filter((b) => b.instagramUrl);

  return (
    <div className="rail py-16 md:py-24">
      <Reveal className="max-w-3xl">
        <h1 className="t-display">{t("Contact", "التواصل")}</h1>
        <p className="t-lead mt-6">
          {t(
            "Five branches across the Sultanate. Message the one nearest you on WhatsApp for stock and pricing, or send a note and we’ll come back to you.",
            "خمسة فروع في مختلف أنحاء السلطنة. راسل الأقرب إليك عبر واتساب لمعرفة التوفر والأسعار، أو أرسل رسالة وسنعود إليك.",
          )}
        </p>
      </Reveal>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_24rem] lg:gap-20">
        <div>
          <h2 className="t-h2">{t("Branches", "الفروع")}</h2>
          <ul className="mt-8 border-t border-hairline">
            {branches.map((b, i) => (
              <li key={b.id}>
                <Reveal delay={i * 0.04}>
                  <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-hairline py-6">
                    <div>
                      <p className="text-[1.0625rem] font-medium">{t(b.nameEn, b.nameAr)}</p>
                      {b.whatsappDisplay ? (
                        <p className="mt-1 font-mono text-[0.875rem] tabular-nums text-muted" dir="ltr">
                          {b.whatsappDisplay}
                        </p>
                      ) : (
                        <p className="mt-1 text-[0.875rem] text-muted">
                          {t("Visit in person", "الزيارة شخصياً")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-5 text-[0.9375rem]">
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
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <h2 className="t-h2 mt-16">{t("On Instagram", "على إنستغرام")}</h2>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {[{ handle: company.instagramHandle, url: company.instagramUrl }, ...brandsWithIg.map((b) => ({ handle: b.instagramHandle, url: b.instagramUrl }))].map(
              (ig) => (
                <li key={ig.handle}>
                  <a
                    href={ig.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[0.9375rem] text-muted transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)] hover:text-fg"
                  >
                    <Instagram className="size-4" />@{ig.handle}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <InquiryForm />
        </div>
      </div>
    </div>
  );
}
