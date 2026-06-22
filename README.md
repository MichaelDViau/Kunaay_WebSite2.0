# Ku Náay Real Estate — Website

Static marketing site for [kunaay.com](https://www.kunaay.com): luxury vacation
rentals and property sales in the Riviera Maya. Plain HTML/CSS/JS — no
framework, no runtime dependencies — deployable on any static host
(Cloudflare Pages / Netlify via `_headers`, Apache via `.htaccess`).

## Project structure

```
├── index.html                  Home (hero slider, featured properties, reviews)
├── rentals.html / sales.html   Listing pages
├── casa*.html                  Property detail pages (gallery, calendar, booking)
├── about.html / contact.html   Company pages
│
├── assets/
│   ├── css/
│   │   ├── main.css            ← edit this (single source of truth, documented)
│   │   └── main.min.css        ← generated; what pages actually load
│   ├── js/
│   │   ├── main.js             ← site behaviour (navbar, sliders, lightbox,
│   │   │                          calendar, contact form) — edit this
│   │   ├── language-toggle.js  ← EN ⇄ ES switcher (lazy-loads translations)
│   │   ├── translations-data.js← English → Spanish lookup table
│   │   └── *.min.js            ← generated builds loaded by the pages
│   ├── fonts/                  Self-hosted woff2 (Cormorant Garamond, Manrope)
│   └── img/
│       ├── favicon.svg, logo.png
│       └── photos/<rentals|sales>/<casa>/
│           ├── full/   1920px WebP — lightbox images & hero backgrounds
│           └── thumb/  900px WebP — card sliders, gallery grids, tiles
│
├── tools/optimize-images.py    Photo pipeline (JPG → full/ + thumb/ WebP)
├── package.json                `npm run build` → regenerates *.min.* files
├── _headers / .htaccess        Caching, compression & security headers
└── robots.txt / sitemap.xml    SEO
```

HTML pages stay at the repository root on purpose: the live URLs
(`kunaay.com/rentals.html`, …) must not change. Shared "components"
(navbar, footer, lightbox, icon sprite) are repeated per page — there is no
build-time templating by design — and are marked with `═══` banner comments
so they are easy to find and keep in sync.

## Editing workflow

1. **Styles** — edit `assets/css/main.css`, then run `npm run build`.
2. **Behaviour** — edit `assets/js/main.js` (or `language-toggle.js`), then
   `npm run build`. Never edit `.min.` files by hand.
3. **Page content** — edit the HTML directly. Every major section carries a
   banner comment (`<!-- ═══ … ═══ -->`).
4. **Translations** — the language toggle matches *exact* English text.
   If you change any visible English string, update the matching key in
   `assets/js/translations-data.js`, then `npm run build`.

First-time setup: `npm install` (only dev dependency is esbuild).

## Adding photos

1. Drop original JPGs into `assets/img/photos/<rentals|sales>/<casa>/`.
2. Run `python3 tools/optimize-images.py` (needs `pip install pillow`).
   It writes lowercase `full/…webp` (1920px) and `thumb/…webp` (900px) and
   is safe to re-run. Originals can be deleted after conversion.
3. Reference `thumb/` for grid/card images and `full/` for
   `KUNAAY_PAGE.lightbox` arrays and `page-hero-bg` backgrounds.

## How a page wires up its data

Each page passes its data to the shared script via one inline object,
just before the deferred bundles:

```html
<script>
window.KUNAAY_PAGE = {
  galleries:  { g0: ["…thumb/a.webp", "…"] },  // property-card sliders
  lightbox:   ["…full/a.webp", "…"],           // detail-page gallery, in order
  bookedDays: [3, 4, 5]                        // availability calendar
};
</script>
<script src="assets/js/main.min.js" defer></script>
<script src="assets/js/language-toggle.min.js" defer></script>
```

`main.js` feature-detects markup (`#heroSlider`, `#calDays`, `#contactForm`,
`#lightbox`…) so any feature can be added or removed per page without
touching the script.

## Performance notes (please keep these intact)

- Pages load **thumb** images for layout and fetch **full** images only when
  the lightbox opens — don't point grid `<img>` tags at `full/`.
- Each page **preloads its hero image** (`<link rel="preload" as="image">`)
  — update that link when changing a hero.
- Fonts are **self-hosted** with `font-display: swap`; no Google Fonts
  requests remain.
- The **Spanish translation table is lazy-loaded** (on first toggle, or at
  start-up for returning Spanish-preference visitors). Don't add it back as
  a regular `<script>` on pages.
- Repeated SVG icons live in one **per-page sprite** right after `<body>`
  and are referenced with `<use href="#i-…">`.



## Next.js app database setup

The current Next.js application uses Prisma for the admin/backend data model. In
development, the public website now falls back to the bundled property data if
`DATABASE_URL` is missing or unavailable, so `npm run dev` can still load the
front end while a database is being configured.

1. Copy `.env.example` to `.env.local`.
2. For local SQLite development, keep `DATABASE_URL="file:./dev.db"` and run
   `npx prisma migrate dev`.
3. For Supabase, paste the Supabase PostgreSQL connection string into
   `DATABASE_URL`. The publishable/anon key is only for Supabase client APIs;
   it is not a database connection string for Prisma.
4. Restart `npm run dev` after changing environment variables.
