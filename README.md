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



## Next.js app — running the front end + back end locally (VS Code)

The Next.js application powers both the public website and the admin back-office
(CMS). It uses Prisma for the data model. In development the public website
falls back to bundled property data if `DATABASE_URL` is missing, so the front
end still renders while a database is being configured.

### Quick start

```bash
npm install                 # install dependencies
cp .env.example .env        # create your local env file (gitignored)
# edit .env: set NEXTAUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD (see below)
npx prisma migrate deploy   # create the SQLite database (dev.db)
npx prisma db seed          # seed properties + the admin user
npm run dev                 # start the app on http://localhost:3000
```

> Note: both Prisma and Next.js read **`.env`** (Prisma does *not* read
> `.env.local`). Keep all variables in `.env`.

### Addresses (URLs)

| Area                     | URL                                      |
| ------------------------ | ---------------------------------------- |
| Public website           | `http://localhost:3000`                  |
| Admin back end (login)   | `http://localhost:3000/admin/login`      |
| Admin dashboard (CMS)    | `http://localhost:3000/admin`            |
| AI assistant API         | `http://localhost:3000/api/ai/chat`      |

Log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `.env`.

### Database options

1. **Local SQLite (default):** keep `DATABASE_URL="file:./dev.db"`.
2. **Supabase / PostgreSQL:** paste the Supabase **PostgreSQL connection
   string** into `DATABASE_URL`, change `provider` to `"postgresql"` in
   `prisma/schema.prisma`, then run `npx prisma migrate dev`. The
   publishable/anon key is only for Supabase client APIs — it is *not* a
   database connection string for Prisma.

Restart the dev server after changing environment variables.

### AI assistant

The "Ku Náay AI Assistant" on the public pages streams answers from
[OpenRouter](https://openrouter.ai). To enable real AI responses:

1. Create a free key at <https://openrouter.ai/keys>.
2. Put it in `.env` as `OPENROUTER_API_KEY="..."`.
3. The default model is `OPENROUTER_MODEL="google/gemma-3-27b-it:free"`
   (a valid free model — change it to any model id from
   <https://openrouter.ai/models>).

Without a key the assistant still works using built-in canned responses, so the
UI never breaks; it simply isn't a live LLM until a key is added.

## Security

The app is hardened for production. Key controls:

- **Authentication** — credentials are bcrypt-hashed; sign-in is rate-limited
  (10 attempts / 15 min per account+IP) to resist brute force; the env-based
  fallback credential is compared in constant time; admin JWT sessions expire
  after 24h. There is **no** hardcoded default credential — the fallback login
  is disabled unless both `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set.
- **Authorization** — `/admin/*` pages are gated by middleware, and every
  `/api/admin/*` route independently verifies an authenticated admin session
  (`getAdminSession()` in `src/lib/auth-guard.ts`) since middleware does not
  cover API routes.
- **Input validation** — all property create/update payloads go through
  `src/lib/property-validation.ts`: enums are normalized, string/array sizes are
  capped (DoS/bloat protection), and URL fields reject unsafe schemes
  (`javascript:` etc.) to prevent stored XSS in links.
- **File uploads** — admin-only; type + size limits, a per-request file cap, an
  early Content-Length check, and authoritative image validation by decoding the
  bytes with `sharp` (defeating spoofed MIME types). Filenames are sanitized and
  timestamp-prefixed so user input can never traverse paths or overwrite files.
- **Database** — Prisma parameterizes all queries (no raw SQL → no injection).
  Credentials live only in `.env` (gitignored). DB errors are mapped to safe
  user-facing messages (`src/lib/api-errors.ts`).
- **Headers** — CSP, HSTS (prod), `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, and `Permissions-Policy` are set in `next.config.ts` (and
  mirrored for the static host in `_headers` / `.htaccess`). Admin pages and
  admin APIs are sent `Cache-Control: no-store`.
- **Output safety** — React escapes all dynamic content; the only raw HTML is
  the JSON-LD `<script>`, which escapes `<` to prevent breakout.

### Remaining risks / next steps before going to production

1. **Rotate the admin password and `NEXTAUTH_SECRET`.** A development SQLite
   database (`prisma/prisma/kunaay.db`) was committed early in the project's
   git history. It is no longer tracked (and `*.db` is gitignored), but its
   bcrypt admin hash remains in history. Rotate the credential, and consider
   purging history with `git filter-repo`/BFG before publishing the repo.
2. **Rate limiting is in-memory** (per instance). For multi-instance or
   serverless hosting, move the login/AI limiters to a shared store (e.g.
   Redis/Upstash). The AI limiter keys on `x-forwarded-for`, which is
   client-spoofable — fine behind a trusted proxy that overwrites it.
3. **Build-time dependency advisories.** `npm audit` reports Next's bundled
   `postcss` (build-time only) and next-auth's transitive `uuid@8` (advisory
   applies only when a `buf` arg is passed, which next-auth never does). Both
   are non-exploitable at runtime; the only "fix" is a breaking next-auth v3
   downgrade, so they are intentionally left until upstream patches land. Keep
   `next` and `next-auth` updated within their major versions.
4. **CSP uses `'unsafe-inline'`** for scripts/styles (required by Next's inline
   bootstrap and the app's inline styles). For a stricter policy, adopt
   nonce-based CSP via middleware.
5. **Database least-privilege.** When using PostgreSQL/Supabase, connect with a
   role limited to the app's schema (CRUD only, no DDL/superuser) for runtime.

