// Core company, brand, and contact information for Modern Supply (الإمداد العصري).
// Modern Supply is the umbrella distributor for several F&B ingredient brands in Oman.
// Source: information provided by the client.

export interface Branch {
  id: string;
  nameEn: string;
  nameAr: string;
  whatsapp?: string; // E.164 format, no spaces
  whatsappDisplay?: string;
  mapUrl: string;
}

export interface Brand {
  id: string;
  nameEn: string;
  nameAr: string;
  originEn: string;
  originAr: string;
  instagramHandle?: string;
  instagramUrl?: string;
  descriptionEn: string;
  descriptionAr: string;
  accent: string; // tailwind color token used for brand badges/accents
  hasProducts: boolean;
}

export const company = {
  nameEn: "Modern Supply",
  nameAr: "الإمداد العصري",
  legalNameEn: "Modern Supply",
  legalNameAr: "الإمداد العصري",
  since: 2014,
  instagramHandle: "modern.supply.om",
  instagramUrl: "https://instagram.com/modern.supply.om",
  countryEn: "Sultanate of Oman",
  countryAr: "سلطنة عُمان",
  aboutEn:
    "Modern Supply is a leading distributor in Oman, representing several global brands in chocolate ingredients, fillings, sauces, syrups, slushies, bakery mixes, and ice cream. With branches across the Sultanate, we serve cafes, restaurants, and hospitality businesses with premium F&B ingredients.",
  aboutAr:
    "الإمداد العصري هي شركة رائدة في التوزيع بسلطنة عُمان، تمثل عدة براندات عالمية في مكونات الشوكولاتة والحشوات والصلصات والشراب والسلاش وخلطات المخبوزات والآيس كريم. نخدم، من خلال فروعنا في مختلف أنحاء السلطنة، المقاهي والمطاعم ومنشآت الضيافة بأفضل مكونات الأغذية والمشروبات.",
};

export const brands: Brand[] = [
  {
    id: "cremino",
    nameEn: "Cremino",
    nameAr: "كريمينو",
    originEn: "Belgium",
    originAr: "بلجيكا",
    instagramHandle: "cremino.om",
    instagramUrl: "https://www.instagram.com/cremino.om",
    descriptionEn:
      "Belgian-origin chocolate ingredients brand: fillings, sauces, fruit purees, ready mixes, ice cream powders, syrups, slushies, gelato pastes, and more.",
    descriptionAr:
      "براند بلجيكي لمكونات الشوكولاتة: حشوات، صوصات، هريس فواكه، خلطات جاهزة، بودرة آيس كريم، شراب، سلاش، معاجين جيلاتو وغيرها.",
    accent: "amber",
    hasProducts: true,
  },
  {
    id: "torino",
    nameEn: "Torino",
    nameAr: "تورينو",
    originEn: "Italy",
    originAr: "إيطاليا",
    instagramHandle: "torino.om",
    instagramUrl: "https://www.instagram.com/torino.om",
    descriptionEn: "Italian-origin F&B ingredients brand distributed by Modern Supply.",
    descriptionAr: "براند إيطالي لمكونات الأغذية والمشروبات يوزعه الإمداد العصري.",
    accent: "rose",
    hasProducts: false,
  },
  {
    id: "italian-master",
    nameEn: "Italian Master",
    nameAr: "إيطاليان ماستر",
    originEn: "Italy",
    originAr: "إيطاليا",
    descriptionEn: "Italian-origin F&B ingredients brand distributed by Modern Supply.",
    descriptionAr: "براند إيطالي لمكونات الأغذية والمشروبات يوزعه الإمداد العصري.",
    accent: "emerald",
    hasProducts: false,
  },
  {
    id: "gusto",
    nameEn: "Gusto",
    nameAr: "غوستو",
    originEn: "Italy",
    originAr: "إيطاليا",
    descriptionEn: "Italian-origin F&B ingredients brand distributed by Modern Supply.",
    descriptionAr: "براند إيطالي لمكونات الأغذية والمشروبات يوزعه الإمداد العصري.",
    accent: "sky",
    hasProducts: false,
  },
  {
    id: "london-chocolate",
    nameEn: "London Chocolate",
    nameAr: "لندن شوكليت",
    originEn: "Oman",
    originAr: "عُمان",
    instagramHandle: "london_chocolat",
    instagramUrl: "https://instagram.com/london_chocolat",
    descriptionEn:
      "London Chocolate distributes high-end chocolate couverture and compound, creams and sauces, ice cream powders, ready mix powders, syrups, puree and fruit fillings.",
    descriptionAr:
      "تقوم London Chocolate بتوزيع الشوكولاتة الفاخرة والكريمات والصلصات ومساحيق الآيس كريم ومساحيق الخليط الجاهز والشراب والمهروس وحشوات الفواكه.",
    accent: "primary",
    hasProducts: true,
  },
  {
    id: "brand-six",
    nameEn: "Brand 6",
    nameAr: "براند ٦",
    originEn: "Coming Soon",
    originAr: "قريباً",
    descriptionEn: "A new premium brand joining the Modern Supply family. Details coming soon.",
    descriptionAr: "براند فاخر جديد ينضم لعائلة الإمداد العصري. التفاصيل قريباً.",
    accent: "violet",
    hasProducts: false,
  },
  {
    id: "brand-seven",
    nameEn: "Brand 7",
    nameAr: "براند ٧",
    originEn: "Coming Soon",
    originAr: "قريباً",
    descriptionEn: "A new premium brand joining the Modern Supply family. Details coming soon.",
    descriptionAr: "براند فاخر جديد ينضم لعائلة الإمداد العصري. التفاصيل قريباً.",
    accent: "orange",
    hasProducts: false,
  },
];

// The last two brands are placeholders for names not yet public. They render on
// the site as "Coming soon" cards, but must stay out of anything that reads as
// marketing copy — a social card listing "Brand 6, Brand 7" looks unfinished.
// Torino, Italian Master and Gusto are real brands that simply have no stock yet,
// so `hasProducts` is the wrong test here.
const UNANNOUNCED = new Set(["brand-six", "brand-seven"]);

/** Brands whose name is public and safe to show off-site. */
export const namedBrands: Brand[] = brands.filter((b) => !UNANNOUNCED.has(b.id));

export function getBrand(id: string): Brand {
  const b = brands.find((x) => x.id === id);
  if (!b) throw new Error(`Unknown brand: ${id}`);
  return b;
}

export const branches: Branch[] = [
  {
    id: "shinas",
    nameEn: "Shinas Branch",
    nameAr: "فرع شناص",
    mapUrl: "https://maps.app.goo.gl/6ydhmSa2yWEfRNgb6?g_st=iw",
  },
  {
    id: "muscat-khoud",
    nameEn: "Muscat Branch (Al Khoudh)",
    nameAr: "فرع مسقط (الخوض)",
    whatsapp: "9689380 6780".replace(/\s/g, ""),
    whatsappDisplay: "+968 9380 6780",
    mapUrl: "https://maps.app.goo.gl/LPofYTBX4jJX3b3f9?g_st=iw",
  },
  {
    id: "muscat-mabaila",
    nameEn: "Muscat Branch (Al Mabaila)",
    nameAr: "فرع مسقط (المعبيلة)",
    whatsapp: "96893806780",
    whatsappDisplay: "+968 9380 6780",
    mapUrl: "https://maps.app.goo.gl/pQXQwyHxsT9WbLxf9?g_st=iw",
  },
  {
    id: "sohar",
    nameEn: "Sohar Branch",
    nameAr: "فرع صحار",
    whatsapp: "96871711137",
    whatsappDisplay: "+968 7171 1137",
    mapUrl: "https://maps.app.goo.gl/dpC7HR1Fw25ZYEyk7?g_st=iw",
  },
  {
    id: "nizwa",
    nameEn: "Nizwa Branch",
    nameAr: "فرع نزوى",
    whatsapp: "96895502512",
    whatsappDisplay: "+968 9550 2512",
    mapUrl: "https://maps.app.goo.gl/jFvEv95xCUpDgcHY8?g_st=iw",
  },
];

// Backwards-compatible export for the original single-brand data shape.
export const brand = {
  nameEn: company.nameEn,
  nameAr: company.nameAr,
  legalNameEn: company.legalNameEn,
  since: company.since,
  instagramHandle: company.instagramHandle,
  instagramUrl: company.instagramUrl,
  countryEn: company.countryEn,
  countryAr: company.countryAr,
  cityEn: "Muscat, Al Khoudh",
  cityAr: "مسقط، الخوض",
  aboutEn: company.aboutEn,
  aboutAr: company.aboutAr,
};
