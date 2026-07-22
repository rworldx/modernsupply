// Wilayats (provinces) of the Sultanate of Oman, grouped by governorate.
// Used for the "delivery location" step of checkout — Oman only.

export interface Wilayat {
  en: string;
  ar: string;
}

export interface Governorate {
  en: string;
  ar: string;
  wilayats: Wilayat[];
}

export const omanGovernorates: Governorate[] = [
  {
    en: "Muscat",
    ar: "مسقط",
    wilayats: [
      { en: "Muscat", ar: "مسقط" },
      { en: "Mutrah", ar: "مطرح" },
      { en: "Bawshar", ar: "بوشر" },
      { en: "Seeb", ar: "السيب" },
      { en: "Al Amerat", ar: "العامرات" },
      { en: "Qurayyat", ar: "قريات" },
    ],
  },
  {
    en: "Dhofar",
    ar: "ظفار",
    wilayats: [
      { en: "Salalah", ar: "صلالة" },
      { en: "Taqah", ar: "طاقة" },
      { en: "Mirbat", ar: "مرباط" },
      { en: "Rakhyut", ar: "رخيوت" },
      { en: "Dhalkut", ar: "ضلكوت" },
      { en: "Muqshin", ar: "مقشن" },
      { en: "Shalim & Hallaniyat", ar: "شليم وجزر الحلانيات" },
      { en: "Sadah", ar: "سدح" },
      { en: "Thumrait", ar: "ثمريت" },
      { en: "Al Mazyona", ar: "المزيونة" },
    ],
  },
  {
    en: "Musandam",
    ar: "مسندم",
    wilayats: [
      { en: "Khasab", ar: "خصب" },
      { en: "Bukha", ar: "بخا" },
      { en: "Daba Al Bayah", ar: "دباء البيعة" },
      { en: "Madha", ar: "مدحاء" },
    ],
  },
  {
    en: "Al Buraimi",
    ar: "البريمي",
    wilayats: [
      { en: "Al Buraimi", ar: "البريمي" },
      { en: "Mahdah", ar: "محضة" },
      { en: "Al Sunaynah", ar: "السنينة" },
    ],
  },
  {
    en: "Ad Dakhiliyah",
    ar: "الداخلية",
    wilayats: [
      { en: "Nizwa", ar: "نزوى" },
      { en: "Bahla", ar: "بهلاء" },
      { en: "Manah", ar: "منح" },
      { en: "Al Hamra", ar: "الحمراء" },
      { en: "Adam", ar: "أدم" },
      { en: "Izki", ar: "إزكي" },
      { en: "Samail", ar: "سمائل" },
      { en: "Bidbid", ar: "بدبد" },
    ],
  },
  {
    en: "Ash Sharqiyah North",
    ar: "شمال الشرقية",
    wilayats: [
      { en: "Ibra", ar: "إبراء" },
      { en: "Al Qabil", ar: "القابل" },
      { en: "Bidiyah", ar: "بدية" },
      { en: "Al Mudhaibi", ar: "المضيبي" },
      { en: "Wadi Bani Khalid", ar: "وادي بني خالد" },
      { en: "Dima Wa Al Taiyin", ar: "دماء والطائيين" },
    ],
  },
  {
    en: "Ash Sharqiyah South",
    ar: "جنوب الشرقية",
    wilayats: [
      { en: "Sur", ar: "صور" },
      { en: "Al Kamil Wa Al Wafi", ar: "الكامل والوافي" },
      { en: "Jalan Bani Bu Hassan", ar: "جعلان بني بو حسن" },
      { en: "Jalan Bani Bu Ali", ar: "جعلان بني بو علي" },
      { en: "Masirah", ar: "مصيرة" },
    ],
  },
  {
    en: "Ad Dhahirah",
    ar: "الظاهرة",
    wilayats: [
      { en: "Ibri", ar: "عبري" },
      { en: "Yanqul", ar: "ينقل" },
      { en: "Dhank", ar: "ضنك" },
    ],
  },
  {
    en: "Al Batinah North",
    ar: "شمال الباطنة",
    wilayats: [
      { en: "Sohar", ar: "صحار" },
      { en: "Shinas", ar: "شناص" },
      { en: "Liwa", ar: "لوى" },
      { en: "Saham", ar: "صحم" },
      { en: "Al Khaboura", ar: "الخابورة" },
      { en: "Suwaiq", ar: "السويق" },
    ],
  },
  {
    en: "Al Batinah South",
    ar: "جنوب الباطنة",
    wilayats: [
      { en: "Rustaq", ar: "الرستاق" },
      { en: "Al Awabi", ar: "العوابي" },
      { en: "Nakhal", ar: "نخل" },
      { en: "Wadi Al Maawil", ar: "وادي المعاول" },
      { en: "Barka", ar: "بركاء" },
      { en: "Al Musanaah", ar: "المصنعة" },
    ],
  },
  {
    en: "Al Wusta",
    ar: "الوسطى",
    wilayats: [
      { en: "Haima", ar: "هيماء" },
      { en: "Duqm", ar: "الدقم" },
      { en: "Mahout", ar: "محوت" },
      { en: "Al Jazir", ar: "الجازر" },
    ],
  },
];
