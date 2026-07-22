export type Lang = "en" | "ar";

export const LANGS: Lang[] = ["en", "ar"];

export function isLang(x: string): x is Lang {
  return x === "en" || x === "ar";
}

/** Pick a string by language. */
export function t(lang: Lang, en: string, ar: string): string {
  return lang === "ar" ? ar : en;
}

/** Pick the *En/*Ar variant of a data object field, e.g. pick(lang, brand, "name"). */
export function pick<T extends Record<string, unknown>>(
  lang: Lang,
  obj: T,
  base: string,
): string {
  const key = base + (lang === "ar" ? "Ar" : "En");
  return String(obj[key] ?? "");
}

export const isRtl = (lang: Lang) => lang === "ar";
export const dir = (lang: Lang) => (lang === "ar" ? "rtl" : "ltr");
