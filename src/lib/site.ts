/**
 * Canonical, production-facing site URL used for SEO metadata, sitemaps,
 * robots rules, canonical links and structured data.
 *
 * It is intentionally the public www.kunaay.com origin (not the dev origin in
 * NEXT_PUBLIC_SITE_URL, which is used for runtime fetch headers). Override only
 * if the production domain changes, via the SITE_URL environment variable.
 */
export const SITE_URL = (process.env.SITE_URL ?? 'https://www.kunaay.com').replace(/\/$/, '');

/** Build an absolute URL on the canonical site origin from a path. */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
