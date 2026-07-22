# Modern Supply — Next.js Build Specification

> Hand this file to Claude (or any engineer) to build the app. It is grounded in the
> real data that already exists in `artifacts/london-chocolate/src/data/`. Every number,
> brand, branch, category, and product referenced here is real and copy-pasteable.

---

## 0. TL;DR — What we're building

A premium, bilingual (EN/AR, LTR/RTL), fully responsive **"house of brands" storefront**
for **Modern Supply (الإمداد العصري)** — a Sultanate-of-Oman F&B ingredients distributor
established **2014**.

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 (already scaffolded in `modern-supply/`).
- **Model:** Brand-first hub. Homepage shows all 7 brands → click a brand → that brand's own storefront (its own catalog + accent color). One shared cart across all brands.
- **No prices, no payment.** The cart is a **quote/order request** compiled into a formatted WhatsApp message. Placeholder prices in the data are ignored in the UI.
- **7 brands:** 2 stocked (London Chocolate, Cremino), 3 active-but-empty (Torino, Italian Master, Gusto), 2 "coming soon" (Brand 6, Brand 7 — client will name later).
- **5 branches, Oman-only delivery**, 11 governorates for the location step.

---

## 1. Ground truth (real data — do not invent)

Source of truth to **copy verbatim** into the new app:
- `artifacts/london-chocolate/src/data/brand.ts` → company, `brands[]` (7), `branches[]` (5)
- `artifacts/london-chocolate/src/data/products.ts` → `categories[]` (25), `products[]` (168), helpers
- `artifacts/london-chocolate/src/data/wilayats.ts` → `omanGovernorates[]` (11 governorates)

### Company
| Field | Value |
|---|---|
| Name EN / AR | Modern Supply / الإمداد العصري |
| Since | 2014 |
| Country | Sultanate of Oman / سلطنة عُمان |
| Instagram | @modern.supply.om — https://instagram.com/modern.supply.om |

### The 7 brands (order matters — keep this order)
| # | id | EN | AR | Origin | Accent token | Status | Instagram |
|---|---|---|---|---|---|---|---|
| 1 | `cremino` | Cremino | كريمينو | Belgium | `amber` | **Stocked** (64 products / 18 cats) | @cremino.om |
| 2 | `torino` | Torino | تورينو | Italy | `rose` | Active, no catalog yet | @torino.om |
| 3 | `italian-master` | Italian Master | إيطاليان ماستر | Italy | `emerald` | Active, no catalog yet | — |
| 4 | `gusto` | Gusto | غوستو | Italy | `sky` | Active, no catalog yet | — |
| 5 | `london-chocolate` | London Chocolate | لندن شوكليت | Oman | `primary` | **Stocked** (104 products / 7 cats) | @london_chocolat |
| 6 | `brand-six` | Brand 6 | براند ٦ | Coming Soon | `violet` | Coming soon | — |
| 7 | `brand-seven` | Brand 7 | براند ٧ | Coming Soon | `orange` | Coming soon | — |

> **`hasProducts` is the switch.** Only `cremino` and `london-chocolate` are `true`.
> Brands 2–4 are real brands with an empty catalog → show a "Catalog coming soon,
> contact us for this brand" state. Brands 6–7 are placeholders → "Coming Soon" badge,
> card is non-clickable (or opens a teaser). When the client sends the 2 real brands +
> Torino/Gusto/Italian Master catalogs, we only edit the data files.

### The 5 branches
| id | EN | WhatsApp (E.164) | Display | Map |
|---|---|---|---|---|
| `shinas` | Shinas Branch | — (no number) | — | goo.gl link in data |
| `muscat-khoud` | Muscat Branch (Al Khoudh) | `96893806780` | +968 9380 6780 | ✓ |
| `muscat-mabaila` | Muscat Branch (Al Mabaila) | `96893806780` | +968 9380 6780 | ✓ |
| `sohar` | Sohar Branch | `96871711137` | +968 7171 1137 | ✓ |
| `nizwa` | Nizwa Branch | `96895502512` | +968 9550 2512 | ✓ |

> **Order destination:** default WhatsApp order recipient = **Muscat (Al Khoudh) = `96893806780`**.
> Shinas has no WhatsApp — never render a WhatsApp button for it, only its map link.
> On checkout, let the customer pick which branch fulfills the order (default Al Khoudh);
> only branches with a `whatsapp` value are selectable as the order destination.

### Real catalog stats (use these in the homepage stats strip)
- **Since 2014** · **7 brands** · **5 branches** · **168 products** across **25 categories**
- London Chocolate categories (7): Creams & Fillings (14), Sauces (15), Fruit Puree (5), Ready Mix Powders (4), Soft Ice Cream Powders (28), Syrups (32), Slushies (6)
- Cremino categories (18): Fillings, Sauces, Fruit Puree, Fruit Puree w/ Seeds, Ready Mix, Ice Cream Powder, Syrup & Slush, Slush Powder, Gelato Paste, Sugar-Free Fillings, Sugar Paste, Food Coloring, Sugar-Free Chocolate, Frappe & Hot Chocolate, Wafer Roll, Toffee/Truffle, Choc-Covered Nuts

### Data model (existing types — keep them)
```ts
// products.ts
type CategoryId = "fillings" | "sauces" | ... | "cr-chocNuts";  // 25 ids
interface Category { id: CategoryId; brandId: string; nameEn; nameAr; unitEn; unitAr; placeholderPrice }
interface Product  { id: string; category: CategoryId; nameEn; nameAr }  // note: unit lives on the Category
// helpers to reuse: getCategory, getCategoriesForBrand(brandId), getProductsForBrand(brandId)
// DROP getProductPrice from the UI path (we hide prices) but keep it in data for later.
```
> **Important quirk:** products have **no image field** and **no price of their own** —
> unit + placeholder price live on the *category*. The UI must render beautifully with
> **zero product photos** (see §6 "Imageless design"). Do not fake photos.

---

## 2. Tech stack & dependencies

Already in `modern-supply/package.json`: `next@16`, `react@19`, `react-dom@19`, `tailwindcss@4`, TS, ESLint. **Add:**

```bash
npm i framer-motion lucide-react clsx tailwind-merge class-variance-authority
npm i @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-label \
      @radix-ui/react-slot @radix-ui/react-accordion @radix-ui/react-scroll-area
# optional: vaul (mobile bottom-sheet cart), sonner (toasts)
npm i vaul sonner
```

Rules:
- **App Router only.** Server Components by default; add `"use client"` only where state/interactivity lives (cart, language toggle, filters, forms, animations).
- **No CSS-in-JS libs, no component kit beyond Radix primitives.** Build small local `ui/` primitives (button, input, select, dialog, sheet, badge) — do NOT copy all 60 shadcn files from the old app; port only what's used.
- **No backend, no DB, no API routes** (except an optional `/api/health`). Everything is static + client state.
- Tailwind v4 uses `@theme` in CSS (not `tailwind.config.js`) — see §5.

---

## 3. Routing & i18n architecture

Bilingual via a `[lang]` dynamic segment. `lang ∈ {"en","ar"}`.

```
src/app/
├── layout.tsx                      # Root <html>. Minimal. No lang here.
├── globals.css                     # Tailwind v4 @theme + fonts + base
├── page.tsx                        # redirect() → /en
├── not-found.tsx
└── [lang]/
    ├── layout.tsx                  # sets <html lang dir>, mounts Providers, Header, Footer
    ├── page.tsx                    # HOME — brand hub
    ├── brands/page.tsx             # all brands grid (also linked from home)
    ├── [brand]/page.tsx            # BRAND STOREFRONT (catalog for one brand)
    ├── about/page.tsx              # company story + all brands + branches
    ├── contact/page.tsx            # branches, maps, WhatsApp, inquiry
    └── order/page.tsx              # CHECKOUT (review cart → customer + location → WhatsApp)
```

- **`generateStaticParams`** for `[lang]` → `["en","ar"]`, and for `[brand]` → the 7 brand ids. Fully static export-friendly.
- **`middleware.ts`** at project root: if path has no `/en` or `/ar` prefix, redirect to `/en` (or read `Accept-Language` / a `NEXT_LOCALE` cookie; default `en`). Keep it simple.
- **Direction:** `[lang]/layout.tsx` sets `<html lang={lang} dir={lang==="ar"?"rtl":"ltr"}>`. Because RTL flips layout, **use logical Tailwind utilities** (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`) everywhere — never hard-code `ml/mr/left/right` for layout.
- **Translation:** no i18n library. A tiny helper mirrors the old app:
  ```ts
  // lib/i18n.ts
  export type Lang = "en" | "ar";
  export const t = (lang: Lang, en: string, ar: string) => (lang === "ar" ? ar : en);
  // For data objects: pick(lang, obj, "name") → obj[lang==="ar"?"nameAr":"nameEn"]
  ```
  Pass `lang` down from route params (server) and via a `LanguageContext` (client) so the switcher can swap without a full reload — the switcher pushes to the mirrored path (`/en/cremino` ↔ `/ar/cremino`).

---

## 4. State (client) — two contexts

Both live under a `Providers` client component mounted in `[lang]/layout.tsx`.

### `CartContext` (port from old `use-cart.tsx`, keep the good parts)
```ts
interface CartItem { product: Product; quantity: number }
interface Cart {
  items: CartItem[];
  addItem(p: Product, qty?: number): void;   // opens cart drawer + toast
  removeItem(id): void;
  updateQuantity(id, qty): void;              // qty<1 removes
  clearCart(): void;
  itemCount: number;                          // Σ quantity
  isCartOpen: boolean; setIsCartOpen(b): void;
}
```
- Persist to `localStorage` key `"modern-supply-cart"`.
- **Hydration-safe:** initialize state empty, then load from `localStorage` inside `useEffect` on mount (do NOT read `localStorage` in `useState` initializer — that breaks SSR). This is the one real fix vs. the old Vite code.
- **No `totalEstimate`** (prices are hidden). Cart shows items, units, quantities only.

### `LanguageContext`
- Holds current `lang`, exposes `t()` and `isRtl`. Reads from route param, writes the switcher's target path. Persist choice in a `NEXT_LOCALE` cookie so the middleware default matches the user's last pick.

---

## 5. Design system — "Liquid Gold"

Warm, editorial, premium. Dark chocolate + ivory + polished gold. Works in **light and dark** (respect `prefers-color-scheme`, allow a toggle). Keep London Chocolate's `primary` feel for that brand; each brand gets its own accent.

### Tokens (Tailwind v4 `@theme` in `globals.css`)
```css
@import "tailwindcss";
@theme {
  --color-choc-950: #120A07;   /* near-black chocolate — dark bg */
  --color-choc-900: #1C120C;
  --color-choc-800: #2A1B12;
  --color-cream-50: #FAF6F0;   /* ivory — light bg / dark text-on-dark */
  --color-cream-100:#F3 EAdf;
  --color-gold-500: #D4AF37;   /* primary accent */
  --color-gold-400: #C5A059;
  /* semantic (map to light/dark via CSS vars below) */
  --font-sans: "Outfit", ui-sans-serif, system-ui;
  --font-serif: "Playfair Display", ui-serif, Georgia;
  --font-arabic: "Tajawal", "Outfit", sans-serif;
}
:root { --bg: var(--color-cream-50); --fg: var(--color-choc-950); --accent: var(--color-gold-500); }
:root[data-theme="dark"], @media (prefers-color-scheme: dark) { --bg: var(--color-choc-950); --fg: var(--color-cream-50); }
```
- **Fonts:** load with `next/font` — `Outfit` (EN sans), `Playfair Display` (serif display/headings), `Tajawal` (Arabic). Apply `font-arabic` on `<html dir=rtl>`. Self-hosted via next/font (no external CDN).
- **Brand accents:** a map `brandId → {from,to,ring}` Tailwind classes (amber/rose/emerald/sky/violet/orange + gold for primary). Drive card glows, pills, hero gradients from it.
- **Glassmorphism:** `backdrop-blur-xl bg-[--bg]/70 border border-white/10` for the sticky header and cart panel.
- **Motion (Framer Motion):** entrance fade+rise on scroll (`whileInView`, once), spring hover on cards (`scale 1.02`), shared `layoutId` on the active filter pill, count-up on the stats strip, cart drawer slide. Respect `prefers-reduced-motion` (gate animations).
- **Touch targets** ≥ 44px. **Never** horizontal-scroll the page body — wide tables/grids scroll inside their own `overflow-x-auto` container.

---

## 6. Pages — detailed specs

### 6.1 Home `/[lang]` — the brand hub (the centerpiece)
1. **Hero** — full-bleed, chocolate gradient + gold accent, Playfair headline, `dir`-aware CTA arrow. Copy: `company.aboutEn/Ar`. CTAs: "Explore the brands" (scrolls to grid) + "Contact us". Subtle parallax/gradient — no stock photo needed (see imageless note).
2. **Stats strip** — count-up: `2014 · 7 brands · 5 branches · 168 products`. Real numbers from data (`brands.length`, `branches.length`, `products.length`).
3. **Brand hub grid** — the hero feature. 7 cards, asymmetric/premium layout, each in its accent color:
   - Stocked brands (`hasProducts`): show product count + top categories, hover glow, links to `/[lang]/[brand]`.
   - Active-empty (Torino/Gusto/Italian Master): "Catalog coming soon" ribbon, links to a brand page that shows story + "ask us about this brand" WhatsApp CTA.
   - Coming-soon (Brand 6/7): dimmed, gold "Coming Soon" badge, not linked (or a teaser modal).
4. **Why Modern Supply** — 3–4 value props (since 2014, brands across Belgium/Italy/Oman, 5 branches, café/restaurant/hospitality supply).
5. **Locations teaser** — mini branch list with map + WhatsApp quick actions → link to `/contact`.
6. **Footer** — company IG, brand IG handles, branches, language toggle, "made in Oman".

### 6.2 Brand storefront `/[lang]/[brand]`
- **Guard:** invalid brand id → `notFound()`. If `!hasProducts` → render the brand's story + "coming soon / contact us" state (no catalog).
- **Brand hero:** brand name (EN/AR), origin badge, accent gradient, IG link, short description from data.
- **Catalog** (client component):
  - **Category filter** — pills (from `getCategoriesForBrand(brandId)`), animated active `layoutId`, "All" default. On mobile: horizontal scroll pills or a select.
  - **Search** — instant client-side, matches EN **and** AR product names (normalize Arabic diacritics optionally).
  - **Product grid** — responsive 1/2/3/4 cols. Each **product card**: name (EN/AR), category unit label (e.g. "1kg / 5kg Bucket" / "دلو ١ كجم / ٥ كجم"), **no price**, a generated visual (see below), and an **"Add to order"** button with spring hover. Adding → toast + cart drawer opens.
  - **Empty state** — designed "no products found" with a custom inline SVG (not a stock illustration).
- **Sticky mini-summary** on mobile: "N items in your order → Review".

### 6.3 About `/[lang]/about`
Company story (`aboutEn/Ar`), the house-of-brands explainer, all 7 brands with origins, timeline since 2014, branches map. Mostly a Server Component.

### 6.4 Contact `/[lang]/contact`
Split layout: branch cards (name, embedded Google map via the `mapUrl`, WhatsApp button **only if** `whatsapp` exists, directions link) + company + brand Instagram links + a lightweight inquiry form (name, message → opens WhatsApp to Al Khoudh, no server).

### 6.5 Order / Checkout `/[lang]/order`
Multi-step, single page:
1. **Review** — cart items grouped **by brand**, quantity steppers, remove, unit labels. Empty-cart state → "browse brands".
2. **Your details** — First name, Last name, Phone (Oman `+968`, validate 8 digits), all required.
3. **Delivery location** — Governorate `<Select>` (11 from `omanGovernorates`) → Wilayat `<Select>` (dependent, from chosen governorate). Bilingual labels.
4. **Fulfilling branch** — select among branches **that have a `whatsapp`** (default Al Khoudh `96893806780`).
5. **Submit** → build the WhatsApp message (below), `window.open("https://wa.me/<branchWhatsapp>?text="+encodeURIComponent(msg))`, then `clearCart()` and show a graceful "order sent" confirmation.

**WhatsApp message format (bilingual — send in the current UI language):**
```
🧾 New order — Modern Supply (الإمداد العصري)
--------------------------------------------
👤 Name: {first} {last}
📞 Phone: +968 {phone}
📍 Location: {governorate} — {wilayat}
🏬 Branch: {branchName}

🛒 Items:
• {qty}× {productName} — {unit}     (grouped by brand)
...

— Sent from modernsupply.om catalog
```
> **No prices, no totals** in the message. It is an order/quote request; the branch replies with pricing.

### Imageless design (critical constraint)
The data has **no product images**. Do **not** invent or hotlink photos. Instead:
- Each product card gets a **generated monogram / gradient tile**: brand-accent gradient + a category icon (Lucide) + the product initials. Deterministic from `product.id` so it's stable.
- Brand cards use accent gradients + a large brand initial/wordmark in Playfair.
- Optional: reuse the few real assets already in `artifacts/london-chocolate/public/` (`hero.png`, `opengraph.jpg`, `favicon.svg`) if they exist and are on-brand — copy into `modern-supply/public/`. Otherwise ship without and rely on the generated visuals. **Never ship broken `<img>` src.**

---

## 7. Components to build (small, local)
```
components/
├── providers.tsx            # "use client" — wraps Cart + Language + Toaster
├── site-header.tsx          # sticky glass nav, brand switcher, lang toggle, cart button
├── site-footer.tsx
├── language-switcher.tsx     # /en ↔ /ar path mirror
├── theme-toggle.tsx          # light/dark (optional)
├── cart-button.tsx           # icon + itemCount badge
├── cart-drawer.tsx           # Radix Dialog / vaul sheet — items, qty, "Review order" CTA
├── brand-card.tsx            # 3 states: stocked / coming-soon-catalog / placeholder
├── product-card.tsx          # imageless tile, unit label, add-to-order
├── category-filter.tsx       # animated pills (layoutId)
├── product-search.tsx
├── scroll-reveal.tsx         # Framer whileInView wrapper (reduced-motion aware)
├── count-up.tsx
├── governorate-select.tsx    # dependent gov→wilayat
├── branch-card.tsx
└── ui/                       # button, input, select, dialog, sheet, badge, label (Radix-based)
```

---

## 8. Responsiveness & a11y checklist
- Breakpoints: 1 col (mobile) → 2 (sm/md) → 3 (lg) → 4 (xl) for product grids; brand hub 1→2→3.
- Header collapses to a slide-over/drawer menu on mobile containing nav + language + theme.
- Cart = bottom sheet (vaul) on mobile, side panel on desktop.
- Full **RTL** correctness: mirror icons/arrows, logical properties, Arabic font, `dir` on `<html>`.
- Keyboard: focus rings, escape closes dialogs, `<Select>` is Radix (accessible).
- Semantic headings, alt text on any real image, `aria-label` on icon buttons.
- `prefers-reduced-motion` disables non-essential animation.
- Lighthouse targets: a11y ≥ 95, no CLS from font/hydration.

---

## 9. Build order (suggested milestones)
1. **Scaffold & tokens** — deps, `globals.css` @theme + fonts, `[lang]` layout, middleware, root redirect.
2. **Data migration** — copy `brand.ts`, `products.ts`, `wilayats.ts` into `src/data/` verbatim; add `lib/i18n.ts` + `lib/utils.ts` (cn).
3. **Providers + shell** — Cart/Language contexts (hydration-safe), header, footer, cart drawer.
4. **Home hub** — hero, stats, brand grid (3 card states), footer.
5. **Brand storefront** — catalog, filter, search, imageless product cards, empty state.
6. **Order/checkout** — review → details → gov/wilayat → branch → WhatsApp handoff.
7. **About + Contact** — branches, maps, IG links, inquiry.
8. **Polish** — motion, RTL audit, responsive audit, dark mode, a11y, metadata/OG, `npm run build` clean.

## 10. Definition of done
- `npm run build` passes with no type errors; every route static-renders for both `en` and `ar`.
- All 168 products browsable under the 2 stocked brands; 3 empty brands show graceful states; 2 placeholders show Coming Soon.
- Add-to-order → cart → WhatsApp order works end-to-end on mobile and desktop, in EN and AR.
- No broken images, no horizontal body scroll, no hydration warnings, no hard-coded left/right in RTL.
- Adding the 2 future brands or filling Torino/Gusto/Italian Master requires **only** editing `src/data/*`.

---

## 11. Open items for the client (not blockers)
- Names/logos/catalogs for **Brand 6 & Brand 7**.
- Catalogs for **Torino, Italian Master, Gusto** (currently `hasProducts:false`).
- **Final pricing** (kept hidden until provided; data already carries placeholder prices for later).
- Real product/brand **photography** (design works without it via generated tiles).
- Confirm **Shinas** WhatsApp number (currently none) and the default order branch.
- Domain (assumed `modernsupply.om`) for metadata/OG.
