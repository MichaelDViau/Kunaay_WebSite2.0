# Ku Náay Real Estate — Website

The website for [kunaay.com](https://www.kunaay.com): luxury vacation rentals and
property sales in the Riviera Maya. A single **Next.js (App Router)** application
that serves the public marketing site **and** the admin back-office (CMS), backed
by Prisma + NextAuth.

> **Migration note.** This project began as a static HTML site. It has been fully
> migrated into the Next.js app in `src/`. The public pages reuse the original
> design assets unchanged — `assets/css/main.min.css`, the self-hosted fonts, the
> photos in `assets/img/`, and the SVG icon sprite — so the look, layout, and
> behaviour are identical, while the code is componentized and server-rendered.
> The old `*.html` URLs **301-redirect** to their clean equivalents (see
> [Routing](#routing--legacy-redirects)).

## Tech stack

- **Next.js 15** (App Router, React 19, TypeScript) — public site + admin + API
- **Prisma 5** ORM — SQLite by default, PostgreSQL/Supabase ready
- **NextAuth** — credentials auth for the admin CMS (bcrypt, rate-limited)
- **sharp** — server-side image validation for uploads
- **Tailwind CSS** (admin UI) + the original hand-written `assets/css/main.css`
  (public site)

## Project structure

```
├── src/
│   ├── app/
│   │   ├── (public)/            Public site: home, rentals, sales, about,
│   │   │                        contact, properties/[slug]  (server components)
│   │   ├── admin/               Admin CMS (login + dashboard + property editor)
│   │   ├── api/                 Route handlers (admin CRUD, image upload,
│   │   │                        calendar, NextAuth, AI assistant)
│   │   ├── layout.tsx           Root layout (metadata, icon sprite)
│   │   ├── sitemap.ts           Generated /sitemap.xml (clean URLs)
│   │   └── robots.ts            Generated /robots.txt
│   ├── components/              Header/Footer, PropertyCard/Gallery, HeroSlider,
│   │                            ContactForm, admin editor, calendar, lightbox…
│   ├── data/                    Bundled fallback property data + translations
│   ├── lib/                     Prisma client, property service, auth guard,
│   │                            validation, rate-limit, structured data
│   ├── context/                 Language (EN/ES) provider
│   └── middleware.ts            Protects /admin/* routes
│
├── prisma/                      schema.prisma, migrations, seed
├── assets/                      Original design assets reused by the public site
│   ├── css/main.css             ← edit this; run `npm run build:legacy-css`
│   │   └── main.min.css         ← generated; what the public layout loads
│   ├── fonts/                   Self-hosted woff2 (Cormorant Garamond, Manrope)
│   └── img/                     favicon, logo, and photos/<rentals|sales>/<casa>/
│                                  ├── full/  1920px WebP (lightbox + hero)
│                                  └── thumb/ 900px WebP (cards + grids)
├── public/assets               → symlink to ../assets (served at /assets/*)
├── tools/optimize-images.py    Photo pipeline (JPG → full/ + thumb/ WebP)
└── next.config.ts              Headers (CSP/HSTS/caching) + legacy redirects
```

The public layout (`src/app/(public)/layout.tsx`) loads
`/assets/css/main.min.css` and preloads the fonts, so styling is governed by the
same single stylesheet as before. Only edit `assets/css/main.css`, then
regenerate the minified build with `npm run build:legacy-css`.

## Quick start

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

In development the public site falls back to bundled property data
(`src/data/properties.ts`) if `DATABASE_URL` is missing or the DB is empty, so
the front end still renders while a database is being configured.

## Scripts

| Script | What it does |
| ------ | ------------ |
| `npm run dev` | Start the dev server (http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run build:legacy-css` | Re-minify `assets/css/main.css` → `main.min.css` |

## Addresses (URLs)

| Area                     | URL                                      |
| ------------------------ | ---------------------------------------- |
| Public website           | `http://localhost:3000`                  |
| Admin back end (login)   | `http://localhost:3000/admin/login`      |
| Admin dashboard (CMS)    | `http://localhost:3000/admin`            |
| AI assistant API         | `http://localhost:3000/api/ai/chat`      |

Log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `.env`.

## Routing & legacy redirects

The public site uses clean URLs: `/`, `/rentals`, `/sales`, `/about`,
`/contact`, and `/properties/<slug>`. The original static-site URLs are
permanently redirected in `next.config.ts` so existing bookmarks and search
rankings keep working:

| Old URL | Redirects to |
| ------- | ------------ |
| `/index.html` | `/` |
| `/rentals.html` · `/sales.html` | `/rentals` · `/sales` |
| `/about.html` · `/contact.html` | `/about` · `/contact` |
| `/casa<name>.html` | `/properties/casa<name>` |

`/sitemap.xml` and `/robots.txt` are generated by `src/app/sitemap.ts` and
`src/app/robots.ts` (the sitemap lists clean URLs and includes every published
property).

## Adding photos

1. Drop original JPGs into `assets/img/photos/<rentals|sales>/<casa>/`.
2. Run `python3 tools/optimize-images.py` (needs `pip install pillow`).
   It writes lowercase `full/…webp` (1920px) and `thumb/…webp` (900px) and
   is safe to re-run. Originals can be deleted after conversion.
3. Reference the images from the admin CMS, or — for the bundled fallback data —
   in `src/data/properties.ts`: use `thumb/` for card/grid images and `full/`
   for the hero and `lightbox` arrays.

**Performance:** card/grid `<img>` tags should point at **thumb** images; the
full-resolution photos load only when the lightbox opens. Heroes are set as
backgrounds via the shared `PageHero` component.

## Database options

1. **Local SQLite (default):** keep `DATABASE_URL="file:./dev.db"`.
2. **Supabase / PostgreSQL:** paste the Supabase **PostgreSQL connection
   string** into `DATABASE_URL`, change `provider` to `"postgresql"` in
   `prisma/schema.prisma`, then run `npx prisma migrate dev`. The
   publishable/anon key is only for Supabase client APIs — it is *not* a
   database connection string for Prisma.

Restart the dev server after changing environment variables.

## AI assistant

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
  `Referrer-Policy`, and `Permissions-Policy` are set in `next.config.ts`. Admin
  pages and admin APIs are sent `Cache-Control: no-store`; fingerprint-free media
  and fonts under `/assets` are cached immutably for a year.
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
