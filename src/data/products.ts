// Full product catalog for Modern Supply brands.
// Prices are placeholders (OMR) until real pricing is finalized by the client —
// clearly labeled as "starting from" in the UI.

export type CategoryId =
  | "fillings"
  | "sauces"
  | "fruitPuree"
  | "readyMix"
  | "iceCreamPowder"
  | "syrups"
  | "slushies"
  | "cr-fillings"
  | "cr-sauces"
  | "cr-fruitPuree"
  | "cr-fruitPureeSeeds"
  | "cr-readyMix"
  | "cr-iceCreamPowder"
  | "cr-syrupSlush"
  | "cr-slushPowder"
  | "cr-gelatoPaste"
  | "cr-sugarFreeFillings"
  | "cr-sugarPaste"
  | "cr-foodColoring"
  | "cr-sugarFreeChoc"
  | "cr-frappePowder"
  | "cr-waferRoll"
  | "cr-toffeeTruffle"
  | "cr-chocNuts";

export interface Category {
  id: CategoryId;
  brandId: string;
  nameEn: string;
  nameAr: string;
  unitEn: string;
  unitAr: string;
  placeholderPrice: number;
}

export const categories: Category[] = [
  {
    id: "fillings",
    brandId: "london-chocolate",
    nameEn: "Creams & Fillings",
    nameAr: "الحشوات",
    unitEn: "1kg / 5kg Bucket",
    unitAr: "دلو 1 كجم / 5 كجم",
    placeholderPrice: 12,
  },
  {
    id: "sauces",
    brandId: "london-chocolate",
    nameEn: "Sauces",
    nameAr: "الصوصات",
    unitEn: "700ml Bottle",
    unitAr: "زجاجة 700 مل",
    placeholderPrice: 4.5,
  },
  {
    id: "fruitPuree",
    brandId: "london-chocolate",
    nameEn: "Fruit Puree",
    nameAr: "هريس الفواكه",
    unitEn: "1.25kg Bottle",
    unitAr: "زجاجة 1.25 كجم",
    placeholderPrice: 6.5,
  },
  {
    id: "readyMix",
    brandId: "london-chocolate",
    nameEn: "Ready Mix Powders",
    nameAr: "الخليط الجاهز للتحضير",
    unitEn: "2kg Bag",
    unitAr: "كيس 2 كجم",
    placeholderPrice: 7,
  },
  {
    id: "iceCreamPowder",
    brandId: "london-chocolate",
    nameEn: "Soft Ice Cream Powders",
    nameAr: "بودرة الآيس كريم",
    unitEn: "2kg Bag",
    unitAr: "كيس 2 كجم",
    placeholderPrice: 9,
  },
  {
    id: "syrups",
    brandId: "london-chocolate",
    nameEn: "Syrups",
    nameAr: "السيروب",
    unitEn: "1 Liter Bottle",
    unitAr: "زجاجة 1 لتر",
    placeholderPrice: 3.5,
  },
  {
    id: "slushies",
    brandId: "london-chocolate",
    nameEn: "Slushies",
    nameAr: "السلاش",
    unitEn: "5 Liter Gallon",
    unitAr: "غالون 5 لتر",
    placeholderPrice: 10,
  },

  // Cremino
  {
    id: "cr-fillings",
    brandId: "cremino",
    nameEn: "Fillings",
    nameAr: "الحشوات",
    unitEn: "1kg / 5kg Bucket",
    unitAr: "دلو 1 كجم / 5 كجم",
    placeholderPrice: 2.8,
  },
  {
    id: "cr-sauces",
    brandId: "cremino",
    nameEn: "Sauces",
    nameAr: "الصوصات",
    unitEn: "1L Bottle",
    unitAr: "زجاجة 1 لتر",
    placeholderPrice: 2.1,
  },
  {
    id: "cr-fruitPuree",
    brandId: "cremino",
    nameEn: "Fruit Puree",
    nameAr: "هريس الفواكه",
    unitEn: "1L Bottle",
    unitAr: "زجاجة 1 لتر",
    placeholderPrice: 2.6,
  },
  {
    id: "cr-fruitPureeSeeds",
    brandId: "cremino",
    nameEn: "Fruit Puree with Seeds & Fruit Filling",
    nameAr: "هريس الفواكه مع القذور وحشوة الفاكهة",
    unitEn: "1kg Jar",
    unitAr: "برطمان 1 كجم",
    placeholderPrice: 4.5,
  },
  {
    id: "cr-readyMix",
    brandId: "cremino",
    nameEn: "Ready-to-Prepare Mix",
    nameAr: "الخليط الجاهز للتحضير",
    unitEn: "1kg Bag",
    unitAr: "كيس 1 كجم",
    placeholderPrice: 4,
  },
  {
    id: "cr-iceCreamPowder",
    brandId: "cremino",
    nameEn: "Ice Cream Powder",
    nameAr: "بودرة الآيس كريم",
    unitEn: "2kg Bag",
    unitAr: "كيس 2 كجم",
    placeholderPrice: 4.6,
  },
  {
    id: "cr-syrupSlush",
    brandId: "cremino",
    nameEn: "Syrup & Slush",
    nameAr: "السيروب والسلاش",
    unitEn: "1L Bottle",
    unitAr: "زجاجة 1 لتر",
    placeholderPrice: 2.6,
  },
  {
    id: "cr-slushPowder",
    brandId: "cremino",
    nameEn: "Slush Syrup & Powder",
    nameAr: "شراب السلاش ومسحوقه",
    unitEn: "1kg Bag",
    unitAr: "كيس 1 كجم",
    placeholderPrice: 3.2,
  },
  {
    id: "cr-gelatoPaste",
    brandId: "cremino",
    nameEn: "Gelato Fruit & Nut Paste",
    nameAr: "معاجين الفاكهة ومعجون المكسرات للجيلاتو",
    unitEn: "1kg Jar",
    unitAr: "برطمان 1 كجم",
    placeholderPrice: 4,
  },
  {
    id: "cr-sugarFreeFillings",
    brandId: "cremino",
    nameEn: "Sugar-Free Fillings",
    nameAr: "حشوات خالية من السكر",
    unitEn: "2kg Bucket",
    unitAr: "دلو 2 كجم",
    placeholderPrice: 4.6,
  },
  {
    id: "cr-sugarPaste",
    brandId: "cremino",
    nameEn: "Sugar Paste",
    nameAr: "معجون السكر",
    unitEn: "1kg Jar",
    unitAr: "برطمان 1 كجم",
    placeholderPrice: 3.2,
  },
  {
    id: "cr-foodColoring",
    brandId: "cremino",
    nameEn: "Food Coloring Powder",
    nameAr: "مسحوق تلوين المواد الغذائية",
    unitEn: "500g Jar",
    unitAr: "برطمان 500 جرام",
    placeholderPrice: 2.3,
  },
  {
    id: "cr-sugarFreeChoc",
    brandId: "cremino",
    nameEn: "Sugar-Free Chocolate (Chips, Bars & Grated)",
    nameAr: "شوكولاتة خالية من السكر (رقائق، ألواح، مبروشة)",
    unitEn: "1kg Bag",
    unitAr: "كيس 1 كجم",
    placeholderPrice: 10.5,
  },
  {
    id: "cr-frappePowder",
    brandId: "cremino",
    nameEn: "Frappe & Hot Chocolate Powder",
    nameAr: "مسحوق الفرابيه والشوكولاتة الساخنة",
    unitEn: "1kg Bag",
    unitAr: "كيس 1 كجم",
    placeholderPrice: 3.5,
  },
  {
    id: "cr-waferRoll",
    brandId: "cremino",
    nameEn: "Wafer Roll & Crepe Dentelle",
    nameAr: "رول ويفر وكريب دانتيل ساده",
    unitEn: "1kg Box",
    unitAr: "علبة 1 كجم",
    placeholderPrice: 4,
  },
  {
    id: "cr-toffeeTruffle",
    brandId: "cremino",
    nameEn: "Toffee, Wafer Roll & Truffle",
    nameAr: "توفي - ويفر رول - ترافل",
    unitEn: "500g Box",
    unitAr: "علبة 500 جرام",
    placeholderPrice: 4.5,
  },
  {
    id: "cr-chocNuts",
    brandId: "cremino",
    nameEn: "Chocolate-Covered Nuts",
    nameAr: "مكسرات مغطاة بالشوكولاتة",
    unitEn: "100g Box",
    unitAr: "علبة 100 جرام",
    placeholderPrice: 8,
  },
];

export interface Product {
  id: string;
  category: CategoryId;
  nameEn: string;
  nameAr: string;
}

export const products: Product[] = [
  // Creams & Fillings
  { id: "fill-biscuit-spread", category: "fillings", nameEn: "Biscuit Spread", nameAr: "انتشار البسكويت" },
  { id: "fill-glaxo", category: "fillings", nameEn: "Glaxo Filling", nameAr: "حشوة جلاكسو" },
  { id: "fill-choc-hazelnut", category: "fillings", nameEn: "Chocolate Filling Cream with Hazelnut", nameAr: "شوكولاتة للحشو والدهن" },
  { id: "fill-pistachio-17", category: "fillings", nameEn: "Pistachio Filling 17%", nameAr: "حشوة الفستق الحلبي الفاخر 17%" },
  { id: "fill-rochet", category: "fillings", nameEn: "Rochet Filling", nameAr: "حشوة الروشيت" },
  { id: "fill-boeno", category: "fillings", nameEn: "Boeno Filling", nameAr: "حشوة بوينو" },
  { id: "fill-oreo-crunchy", category: "fillings", nameEn: "Oreo Crunchy", nameAr: "أوريو كرنشي" },
  { id: "fill-pistachio-10", category: "fillings", nameEn: "Pistachio Filling 10%", nameAr: "حشوة الفستق الحلبي الفاخر 10%" },
  { id: "fill-pistachio-crunchy", category: "fillings", nameEn: "Pistachio Crunchy Filling", nameAr: "حشوة البستاشيو كرنشي" },
  { id: "fill-saffron", category: "fillings", nameEn: "Saffron Filling", nameAr: "حشوة الزعفران" },
  { id: "fill-white-choc-cream", category: "fillings", nameEn: "White Chocolate Cream", nameAr: "كريمة الشوكولاتة البيضاء" },
  { id: "fill-strawberry-cream", category: "fillings", nameEn: "Strawberry Cream", nameAr: "كريمة الفراولة" },
  { id: "fill-red-velvet-cream", category: "fillings", nameEn: "Red Velvet Cream", nameAr: "كريمة ريد فيلفيت" },
  { id: "fill-blue-velvet-cream", category: "fillings", nameEn: "Blue Velvet Cream", nameAr: "كريمة البلو فيلفت" },

  // Sauces
  { id: "sauce-kinder", category: "sauces", nameEn: "Kinder Sauce", nameAr: "صوص الكندر" },
  { id: "sauce-white-choc", category: "sauces", nameEn: "White Chocolate Sauce", nameAr: "صوص الشوكولاتة البيضاء" },
  { id: "sauce-speculoos", category: "sauces", nameEn: "Speculoos Sauce", nameAr: "صوص سبيكولوس" },
  { id: "sauce-oreo", category: "sauces", nameEn: "Oreo Sauce", nameAr: "صوص أوريو" },
  { id: "sauce-salted-caramel", category: "sauces", nameEn: "Salted Caramel Sauce", nameAr: "صوص كراميل مملح" },
  { id: "sauce-pistachio", category: "sauces", nameEn: "Pistachio Sauce", nameAr: "صوص الفستق" },
  { id: "sauce-red-velvet", category: "sauces", nameEn: "Red Velvet Sauce", nameAr: "صوص الرد فيلفت" },
  { id: "sauce-peanut", category: "sauces", nameEn: "Peanut Sauce", nameAr: "صوص الفول السوداني" },
  { id: "sauce-caramel", category: "sauces", nameEn: "Caramel Sauce", nameAr: "صوص كراميل" },
  { id: "sauce-mix-berry", category: "sauces", nameEn: "Mix Berry Sauce", nameAr: "صوص مزيج التوت" },
  { id: "sauce-milk-choc", category: "sauces", nameEn: "Milk Chocolate Sauce", nameAr: "صوص شوكولاتة الحليب" },
  { id: "sauce-saffron", category: "sauces", nameEn: "Saffron Sauce", nameAr: "صوص الزعفران" },
  { id: "sauce-glaxo", category: "sauces", nameEn: "Glaxo Sauce", nameAr: "صوص جلاكسو" },
  { id: "sauce-dark-choc", category: "sauces", nameEn: "Dark Chocolate Sauce", nameAr: "صوص الشوكولاتة الداكنة" },
  { id: "sauce-choc-hazelnut", category: "sauces", nameEn: "Chocolate Hazelnut Sauce", nameAr: "صوص شوكولاتة بالبندق" },

  // Fruit Puree
  { id: "puree-blue-raspberry", category: "fruitPuree", nameEn: "Blue Raspberry Fruit Puree", nameAr: "هريس التوت العليق الأزرق" },
  { id: "puree-strawberry", category: "fruitPuree", nameEn: "Strawberry Fruit Puree", nameAr: "هريس الفراولة" },
  { id: "puree-passion-fruit", category: "fruitPuree", nameEn: "Passion Fruit Puree", nameAr: "هريس الفاكهة الاستوائية" },
  { id: "puree-mango", category: "fruitPuree", nameEn: "Mango Fruit Puree", nameAr: "هريس المانجو" },
  { id: "puree-blueberry", category: "fruitPuree", nameEn: "Blueberry Fruit Puree", nameAr: "هريس التوت الأزرق" },

  // Ready Mix Powders
  { id: "mix-crepe", category: "readyMix", nameEn: "Crepe Ready Mix", nameAr: "مزيج الكريب الجاهز" },
  { id: "mix-waffle", category: "readyMix", nameEn: "Waffle Ready Mix", nameAr: "خليط الوافل الجاهز" },
  { id: "mix-pancake", category: "readyMix", nameEn: "Pancake Ready Mix", nameAr: "خليط البان كيك الجاهز" },
  { id: "mix-hot-chocolate", category: "readyMix", nameEn: "Hot Chocolate", nameAr: "شوكولاتة ساخنة" },

  // Soft Ice Cream Powders
  { id: "ice-blackberry", category: "iceCreamPowder", nameEn: "Blackberry", nameAr: "توت أسود" },
  { id: "ice-white-vanilla", category: "iceCreamPowder", nameEn: "White Vanilla", nameAr: "فانيلا بيضاء" },
  { id: "ice-plain-white-neutral", category: "iceCreamPowder", nameEn: "Plain White Neutral", nameAr: "أبيض سادة" },
  { id: "ice-red-berry", category: "iceCreamPowder", nameEn: "Red Berry", nameAr: "توت أحمر" },
  { id: "ice-watermelon", category: "iceCreamPowder", nameEn: "Watermelon", nameAr: "بطيخ" },
  { id: "ice-vimto", category: "iceCreamPowder", nameEn: "Vimto Ice Cream", nameAr: "فيمتو" },
  { id: "ice-strawberry", category: "iceCreamPowder", nameEn: "Strawberry", nameAr: "فراولة" },
  { id: "ice-coffee", category: "iceCreamPowder", nameEn: "Coffee", nameAr: "قهوة" },
  { id: "ice-speculoos", category: "iceCreamPowder", nameEn: "Speculoos", nameAr: "سبيكولوس" },
  { id: "ice-saffron", category: "iceCreamPowder", nameEn: "Saffron", nameAr: "زعفران" },
  { id: "ice-red-bull", category: "iceCreamPowder", nameEn: "Red Bull", nameAr: "ريد بول" },
  { id: "ice-pomegranate", category: "iceCreamPowder", nameEn: "Pomegranate", nameAr: "رمان" },
  { id: "ice-acai", category: "iceCreamPowder", nameEn: "Acai", nameAr: "الأساي" },
  { id: "ice-mixed-berries", category: "iceCreamPowder", nameEn: "Mixed Berries", nameAr: "مزيج التوت" },
  { id: "ice-milk-chocolate", category: "iceCreamPowder", nameEn: "Milk Chocolate", nameAr: "شوكولا حليب" },
  { id: "ice-matcha", category: "iceCreamPowder", nameEn: "Matcha", nameAr: "ماتشا" },
  { id: "ice-cheesecake", category: "iceCreamPowder", nameEn: "Cheesecake", nameAr: "تشيز كيك" },
  { id: "ice-mango", category: "iceCreamPowder", nameEn: "Mango", nameAr: "مانجو" },
  { id: "ice-blue-sky", category: "iceCreamPowder", nameEn: "Blue Sky", nameAr: "بلو سكاي" },
  { id: "ice-karak", category: "iceCreamPowder", nameEn: "Karak Ice Cream", nameAr: "كرك" },
  { id: "ice-green-mango", category: "iceCreamPowder", nameEn: "Green Mango", nameAr: "مانجو أخضر" },
  { id: "ice-cookies", category: "iceCreamPowder", nameEn: "Cookies", nameAr: "كوكيز" },
  { id: "ice-fursaad", category: "iceCreamPowder", nameEn: "Fursaad", nameAr: "فرصاد" },
  { id: "ice-greek-yogurt", category: "iceCreamPowder", nameEn: "Greek Yogurt", nameAr: "زبادي يوناني" },
  { id: "ice-pomegranate-yogurt", category: "iceCreamPowder", nameEn: "Pomegranate Yogurt", nameAr: "زبادي الرمان" },
  { id: "ice-mango-yogurt", category: "iceCreamPowder", nameEn: "Mango Yogurt", nameAr: "زبادي المانجو" },
  { id: "ice-lemon-yogurt", category: "iceCreamPowder", nameEn: "Lemon Yogurt", nameAr: "زبادي الليمون" },
  { id: "ice-passion-fruit-yogurt", category: "iceCreamPowder", nameEn: "Passion Fruit Yogurt", nameAr: "زبادي الفاكهة الاستوائية" },

  // Syrups
  { id: "syrup-blackberry", category: "syrups", nameEn: "Blackberry Syrup", nameAr: "شراب التوت الأسود" },
  { id: "syrup-blueberry", category: "syrups", nameEn: "Blueberry Syrup", nameAr: "شراب التوت الأزرق" },
  { id: "syrup-blue-raspberry", category: "syrups", nameEn: "Blue Raspberry Syrup", nameAr: "شراب التوت العليق الأزرق" },
  { id: "syrup-bubble-gum", category: "syrups", nameEn: "Bubble Gum Syrup", nameAr: "شراب العلكة" },
  { id: "syrup-caramel", category: "syrups", nameEn: "Caramel Syrup", nameAr: "شراب الكراميل" },
  { id: "syrup-grape", category: "syrups", nameEn: "Grape Syrup", nameAr: "شراب العنب" },
  { id: "syrup-green-apple", category: "syrups", nameEn: "Green Apple Syrup", nameAr: "شراب التفاح الأخضر" },
  { id: "syrup-hazelnut", category: "syrups", nameEn: "Hazelnut Syrup", nameAr: "شراب البندق" },
  { id: "syrup-ice-tea", category: "syrups", nameEn: "Ice Tea Syrup", nameAr: "شراب الشاي المثلج" },
  { id: "syrup-cherry", category: "syrups", nameEn: "Cherry Syrup", nameAr: "شراب الكرز" },
  { id: "syrup-kiwi", category: "syrups", nameEn: "Kiwi Syrup", nameAr: "شراب الكيوي" },
  { id: "syrup-lemon", category: "syrups", nameEn: "Lemon Syrup", nameAr: "شراب الليمون" },
  { id: "syrup-mango", category: "syrups", nameEn: "Mango Syrup", nameAr: "شراب المانجو" },
  { id: "syrup-mint", category: "syrups", nameEn: "Mint Syrup", nameAr: "شراب النعناع" },
  { id: "syrup-coconut", category: "syrups", nameEn: "Coconut Syrup", nameAr: "شراب جوز الهند" },
  { id: "syrup-mixed-berries", category: "syrups", nameEn: "Mixed Berries Syrup", nameAr: "شراب التوت المختلط" },
  { id: "syrup-mojito", category: "syrups", nameEn: "Mojito Syrup", nameAr: "شراب موهيتو" },
  { id: "syrup-peach", category: "syrups", nameEn: "Peach Syrup", nameAr: "شراب الخوخ" },
  { id: "syrup-vanilla", category: "syrups", nameEn: "Vanilla Syrup", nameAr: "شراب الفانيليا" },
  { id: "syrup-dragon-fruit", category: "syrups", nameEn: "Dragon Fruit Syrup", nameAr: "شراب فاكهة التنين" },
  { id: "syrup-peach-ice-tea", category: "syrups", nameEn: "Peach Ice Tea Syrup", nameAr: "شراب شاي الخوخ المثلج" },
  { id: "syrup-orange-peel", category: "syrups", nameEn: "Orange Peel Syrup", nameAr: "شراب قشر البرتقال" },
  { id: "syrup-pineapple", category: "syrups", nameEn: "Pineapple Syrup", nameAr: "شراب الأناناس" },
  { id: "syrup-pomegranate", category: "syrups", nameEn: "Pomegranate Syrup", nameAr: "شراب الرمان" },
  { id: "syrup-strawberry-ice-tea", category: "syrups", nameEn: "Strawberry Ice Tea Syrup", nameAr: "شراب شاي الفراولة المثلج" },
  { id: "syrup-power-c", category: "syrups", nameEn: "Power C Syrup", nameAr: "شراب باور سي" },
  { id: "syrup-red-raspberry", category: "syrups", nameEn: "Red Raspberry Syrup", nameAr: "شراب التوت الأحمر" },
  { id: "syrup-red-wings", category: "syrups", nameEn: "Red Wings Syrup", nameAr: "شراب اجنحة الطاقة" },
  { id: "syrup-strawberry", category: "syrups", nameEn: "Strawberry Syrup", nameAr: "شراب الفراولة" },
  { id: "syrup-passion-fruit", category: "syrups", nameEn: "Passion Fruit Syrup", nameAr: "شراب الفاكهة الاستوائية" },
  { id: "syrup-watermelon", category: "syrups", nameEn: "Watermelon Syrup", nameAr: "شراب البطيخ" },
  { id: "syrup-black-grape", category: "syrups", nameEn: "Black Grape Syrup", nameAr: "شراب العنب الأسود" },

  // Slushies
  { id: "slush-blue-raspberry", category: "slushies", nameEn: "Blue Raspberry Slush", nameAr: "سلاش التوت العليق الأزرق" },
  { id: "slush-strawberry", category: "slushies", nameEn: "Strawberry Slush", nameAr: "سلاش الفراولة" },
  { id: "slush-cherry", category: "slushies", nameEn: "Cherry Slush", nameAr: "سلاش الكرز" },
  { id: "slush-mango", category: "slushies", nameEn: "Mango Slush", nameAr: "سلاش المانجو" },
  { id: "slush-mixed-berries", category: "slushies", nameEn: "Mixed Berries Slush", nameAr: "سلاش مزيج التوت" },
  { id: "slush-green-apple", category: "slushies", nameEn: "Green Apple Slush", nameAr: "سلاش التفاح الأخضر" },

  // ===== Cremino =====
  // Fillings
  { id: "cr-fill-choc-hazelnut", category: "cr-fillings", nameEn: "Chocolate Hazelnut Filling", nameAr: "حشوة الشوكولاتة بالبندق" },
  { id: "cr-fill-pistachio", category: "cr-fillings", nameEn: "Pistachio Filling", nameAr: "حشوة الفستق" },
  { id: "cr-fill-white-choc", category: "cr-fillings", nameEn: "White Chocolate Filling", nameAr: "حشوة الشوكولاتة البيضاء" },
  { id: "cr-fill-biscuit", category: "cr-fillings", nameEn: "Biscuit Cream Filling", nameAr: "حشوة كريمة البسكويت" },
  { id: "cr-fill-milk-choc", category: "cr-fillings", nameEn: "Milk Chocolate Filling", nameAr: "حشوة شوكولاتة الحليب" },

  // Sauces
  { id: "cr-sauce-chocolate", category: "cr-sauces", nameEn: "Chocolate Sauce", nameAr: "صوص الشوكولاتة" },
  { id: "cr-sauce-caramel", category: "cr-sauces", nameEn: "Caramel Sauce", nameAr: "صوص الكراميل" },
  { id: "cr-sauce-pistachio", category: "cr-sauces", nameEn: "Pistachio Sauce", nameAr: "صوص الفستق" },
  { id: "cr-sauce-saffron", category: "cr-sauces", nameEn: "Saffron Sauce", nameAr: "صوص الزعفران" },
  { id: "cr-sauce-white-choc", category: "cr-sauces", nameEn: "White Chocolate Sauce", nameAr: "صوص الشوكولاتة البيضاء" },

  // Fruit Puree
  { id: "cr-puree-strawberry", category: "cr-fruitPuree", nameEn: "Strawberry Puree", nameAr: "هريس الفراولة" },
  { id: "cr-puree-mango", category: "cr-fruitPuree", nameEn: "Mango Puree", nameAr: "هريس المانجو" },
  { id: "cr-puree-raspberry", category: "cr-fruitPuree", nameEn: "Raspberry Puree", nameAr: "هريس التوت" },
  { id: "cr-puree-passion-fruit", category: "cr-fruitPuree", nameEn: "Passion Fruit Puree", nameAr: "هريس الفاكهة الاستوائية" },

  // Fruit Puree with Seeds & Fruit Filling
  { id: "cr-pureeseed-strawberry", category: "cr-fruitPureeSeeds", nameEn: "Strawberry Puree with Seeds", nameAr: "هريس الفراولة مع البذور" },
  { id: "cr-pureeseed-mixed-berry", category: "cr-fruitPureeSeeds", nameEn: "Mixed Berry Fruit Filling", nameAr: "حشوة التوت المشكل" },
  { id: "cr-pureeseed-fig", category: "cr-fruitPureeSeeds", nameEn: "Fig Fruit Filling", nameAr: "حشوة التين" },

  // Ready Mix
  { id: "cr-mix-crepe", category: "cr-readyMix", nameEn: "Crepe Ready Mix", nameAr: "خليط الكريب الجاهز" },
  { id: "cr-mix-pancake", category: "cr-readyMix", nameEn: "Pancake Ready Mix", nameAr: "خليط البان كيك الجاهز" },
  { id: "cr-mix-waffle", category: "cr-readyMix", nameEn: "Waffle Ready Mix", nameAr: "خليط الوافل الجاهز" },
  { id: "cr-mix-muffin", category: "cr-readyMix", nameEn: "Muffin Ready Mix", nameAr: "خليط المافن الجاهز" },

  // Ice Cream Powder
  { id: "cr-ice-vanilla", category: "cr-iceCreamPowder", nameEn: "Vanilla Ice Cream Powder", nameAr: "بودرة آيس كريم فانيليا" },
  { id: "cr-ice-mango", category: "cr-iceCreamPowder", nameEn: "Mango Ice Cream Powder", nameAr: "بودرة آيس كريم مانجو" },
  { id: "cr-ice-hazelnut", category: "cr-iceCreamPowder", nameEn: "Hazelnut Ice Cream Powder", nameAr: "بودرة آيس كريم بندق" },
  { id: "cr-ice-chocolate", category: "cr-iceCreamPowder", nameEn: "Chocolate Ice Cream Powder", nameAr: "بودرة آيس كريم شوكولاتة" },
  { id: "cr-ice-mulberry", category: "cr-iceCreamPowder", nameEn: "Mulberry Ice Cream Powder", nameAr: "بودرة آيس كريم فرصاد" },
  { id: "cr-ice-strawberry", category: "cr-iceCreamPowder", nameEn: "Strawberry Ice Cream Powder", nameAr: "بودرة آيس كريم فراولة" },
  { id: "cr-ice-watermelon", category: "cr-iceCreamPowder", nameEn: "Watermelon Ice Cream Powder", nameAr: "بودرة آيس كريم بطيخ" },

  // Syrup & Slush
  { id: "cr-syrup-strawberry", category: "cr-syrupSlush", nameEn: "Strawberry Syrup", nameAr: "شراب الفراولة" },
  { id: "cr-syrup-mango", category: "cr-syrupSlush", nameEn: "Mango Syrup", nameAr: "شراب المانجو" },
  { id: "cr-syrup-blue-raspberry", category: "cr-syrupSlush", nameEn: "Blue Raspberry Syrup", nameAr: "شراب التوت الأزرق" },
  { id: "cr-syrup-lemon-mint", category: "cr-syrupSlush", nameEn: "Lemon Mint Syrup", nameAr: "شراب الليمون بالنعناع" },

  // Slush Syrup & Powder
  { id: "cr-slush-cola", category: "cr-slushPowder", nameEn: "Cola Slush Syrup", nameAr: "شراب سلاش الكولا" },
  { id: "cr-slush-blueberry", category: "cr-slushPowder", nameEn: "Blueberry Slush Powder", nameAr: "بودرة سلاش التوت الأزرق" },
  { id: "cr-slush-green-apple", category: "cr-slushPowder", nameEn: "Green Apple Slush Syrup", nameAr: "شراب سلاش التفاح الأخضر" },

  // Gelato Fruit & Nut Paste
  { id: "cr-gelato-pistachio", category: "cr-gelatoPaste", nameEn: "Pistachio Paste for Gelato", nameAr: "معجون الفستق للجيلاتو" },
  { id: "cr-gelato-hazelnut", category: "cr-gelatoPaste", nameEn: "Hazelnut Paste for Gelato", nameAr: "معجون البندق للجيلاتو" },
  { id: "cr-gelato-strawberry", category: "cr-gelatoPaste", nameEn: "Strawberry Fruit Paste for Gelato", nameAr: "معجون الفراولة للجيلاتو" },
  { id: "cr-gelato-almond", category: "cr-gelatoPaste", nameEn: "Almond Paste for Gelato", nameAr: "معجون اللوز للجيلاتو" },

  // Sugar-Free Fillings
  { id: "cr-sf-fill-chocolate", category: "cr-sugarFreeFillings", nameEn: "Sugar-Free Chocolate Filling", nameAr: "حشوة شوكولاتة خالية من السكر" },
  { id: "cr-sf-fill-hazelnut", category: "cr-sugarFreeFillings", nameEn: "Sugar-Free Hazelnut Filling", nameAr: "حشوة بندق خالية من السكر" },
  { id: "cr-sf-fill-vanilla", category: "cr-sugarFreeFillings", nameEn: "Sugar-Free Vanilla Filling", nameAr: "حشوة فانيليا خالية من السكر" },

  // Sugar Paste
  { id: "cr-sugarpaste-white", category: "cr-sugarPaste", nameEn: "White Sugar Paste (Fondant)", nameAr: "معجون السكر الأبيض (فوندان)" },
  { id: "cr-sugarpaste-modeling", category: "cr-sugarPaste", nameEn: "Modeling Sugar Paste", nameAr: "معجون السكر للنمذجة" },

  // Food Coloring Powder
  { id: "cr-color-red", category: "cr-foodColoring", nameEn: "Red Food Coloring Powder", nameAr: "بودرة تلوين حمراء" },
  { id: "cr-color-green", category: "cr-foodColoring", nameEn: "Green Food Coloring Powder", nameAr: "بودرة تلوين خضراء" },
  { id: "cr-color-yellow", category: "cr-foodColoring", nameEn: "Yellow Food Coloring Powder", nameAr: "بودرة تلوين صفراء" },
  { id: "cr-color-blue", category: "cr-foodColoring", nameEn: "Blue Food Coloring Powder", nameAr: "بودرة تلوين زرقاء" },

  // Sugar-Free Chocolate
  { id: "cr-sf-choc-chips", category: "cr-sugarFreeChoc", nameEn: "Sugar-Free Chocolate Chips", nameAr: "رقائق شوكولاتة خالية من السكر" },
  { id: "cr-sf-choc-compound-chips", category: "cr-sugarFreeChoc", nameEn: "Sugar-Free Compound Chocolate Chips", nameAr: "رقائق شوكولاتة مركبة خالية من السكر" },
  { id: "cr-sf-choc-bar", category: "cr-sugarFreeChoc", nameEn: "Sugar-Free Compound Chocolate Bar", nameAr: "ألواح شوكولاتة مركبة خالية من السكر" },
  { id: "cr-sf-choc-grated", category: "cr-sugarFreeChoc", nameEn: "Sugar-Free Grated & Crispy Chocolate", nameAr: "شوكولاتة مبروشة ومقرمشة خالية من السكر" },

  // Frappe & Hot Chocolate Powder
  { id: "cr-frappe-classic", category: "cr-frappePowder", nameEn: "Classic Frappe Powder", nameAr: "بودرة فرابيه كلاسيك" },
  { id: "cr-frappe-hot-choc", category: "cr-frappePowder", nameEn: "Hot Chocolate Powder", nameAr: "بودرة شوكولاتة ساخنة" },
  { id: "cr-frappe-mocha", category: "cr-frappePowder", nameEn: "Mocha Frappe Powder", nameAr: "بودرة فرابيه موكا" },

  // Wafer Roll & Crepe Dentelle
  { id: "cr-wafer-plain", category: "cr-waferRoll", nameEn: "Plain Wafer Roll", nameAr: "رول ويفر ساده" },
  { id: "cr-crepe-dentelle", category: "cr-waferRoll", nameEn: "Plain Crepe Dentelle", nameAr: "كريب دانتيل ساده" },

  // Toffee, Wafer Roll & Truffle
  { id: "cr-toffee-classic", category: "cr-toffeeTruffle", nameEn: "Classic Toffee", nameAr: "توفي كلاسيك" },
  { id: "cr-truffle-choc", category: "cr-toffeeTruffle", nameEn: "Chocolate Truffle", nameAr: "ترافل شوكولاتة" },
  { id: "cr-wafer-roll-choc", category: "cr-toffeeTruffle", nameEn: "Chocolate Wafer Roll", nameAr: "ويفر رول بالشوكولاتة" },

  // Chocolate-Covered Nuts
  { id: "cr-nuts-almond", category: "cr-chocNuts", nameEn: "Chocolate-Covered Almonds", nameAr: "لوز مغطى بالشوكولاتة" },
  { id: "cr-nuts-hazelnut", category: "cr-chocNuts", nameEn: "Chocolate-Covered Hazelnuts", nameAr: "بندق مغطى بالشوكولاتة" },
  { id: "cr-nuts-pistachio", category: "cr-chocNuts", nameEn: "Chocolate-Covered Pistachios", nameAr: "فستق مغطى بالشوكولاتة" },
  { id: "cr-nuts-raisins", category: "cr-chocNuts", nameEn: "Chocolate-Covered Raisins", nameAr: "زبيب مغطى بالشوكولاتة" },
];

export function getCategory(id: CategoryId): Category {
  const category = categories.find((c) => c.id === id);
  if (!category) throw new Error(`Unknown category: ${id}`);
  return category;
}

export function getProductPrice(product: Product): number {
  return getCategory(product.category).placeholderPrice;
}

export function getCategoriesForBrand(brandId: string): Category[] {
  return categories.filter((c) => c.brandId === brandId);
}

export function getProductsForBrand(brandId: string): Product[] {
  const ids = new Set(getCategoriesForBrand(brandId).map((c) => c.id));
  return products.filter((p) => ids.has(p.category));
}
