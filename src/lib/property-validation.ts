/**
 * Server-side validation & normalization for the admin property create/update
 * payloads. This is the trust boundary for everything that reaches the database
 * and is later rendered on the public site, so it:
 *
 *   - normalizes the `type`/`status` enums to known-good values,
 *   - rejects unsafe URL schemes (e.g. `javascript:`) on fields that become
 *     anchor hrefs, guarding against stored XSS,
 *   - caps string lengths and array sizes to keep a single oversized request
 *     from bloating the database or exhausting memory.
 *
 * Existing valid form submissions are unaffected — the limits are generous and
 * the defaults mirror the previous inline behaviour exactly.
 */

const MAX = {
  name: 200,
  slug: 200,
  badge: 60,
  location: 300,
  subtitle: 300,
  heroLabel: 200,
  price: 120,
  shortDescription: 3000,
  seoTitle: 300,
  seoDescription: 600,
  url: 2000,
  descriptionText: 20000,
  highlightIcon: 60,
  highlightLabel: 200,
  featureText: 500,
  relatedField: 300,
  amenityId: 100,
} as const;

const MAX_ITEMS = {
  descriptions: 60,
  highlights: 40,
  features: 120,
  amenities: 120,
  related: 40,
};

export interface NormalizedProperty {
  slug: string;
  name: string;
  type: string;
  status: string;
  badge: string;
  location: string;
  subtitle: string;
  heroLabel: string;
  bedrooms: number;
  bathrooms: number;
  guests: number | null;
  squareFeet: number | null;
  price: string;
  shortDescription: string;
  whatsappUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoOgImage: string;
  seoCanonical: string;
  displayOrder: number;
  descriptions: { text: string; sortOrder: number }[];
  highlights: { icon: string; label: string; sortOrder: number }[];
  features: { text: string; sortOrder: number }[];
  amenityIds: string[];
  relatedProperties: { slug: string; name: string; location: string; image: string; sortOrder: number }[];
}

export type ValidationResult =
  | { ok: true; data: NormalizedProperty }
  | { ok: false; error: string };

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asInt(value: unknown, { min = 0, max = 1_000_000 } = {}): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

function asNullableInt(value: unknown, { min = 0, max = 10_000_000 } = {}): number | null {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

/**
 * Accepts only empty, site-relative ("/..."), or http(s) URLs. Anything else
 * (javascript:, data:, vbscript:, mailto:, etc.) is rejected so it can never be
 * stored and later reflected into an href/src.
 */
function isSafeUrl(value: string): boolean {
  const v = value.trim();
  if (v === '') return true;
  if (v.startsWith('/') && !v.startsWith('//')) return true;
  return /^https?:\/\//i.test(v);
}

export function validateAndNormalizeProperty(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid request body.' };
  }
  const b = body as Record<string, unknown>;

  const name = asString(b.name).trim();
  const slug = asString(b.slug).trim();

  if (!slug || !name) {
    return { ok: false, error: 'Name and slug are required.' };
  }
  if (name.length > MAX.name) return { ok: false, error: `Name must be ${MAX.name} characters or fewer.` };
  if (slug.length > MAX.slug) return { ok: false, error: `Slug must be ${MAX.slug} characters or fewer.` };
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) {
    return { ok: false, error: 'Slug may only contain letters, numbers, and hyphens.' };
  }

  // String fields that must stay within sane bounds.
  const bounded: Array<[string, string, number]> = [
    ['badge', asString(b.badge), MAX.badge],
    ['location', asString(b.location), MAX.location],
    ['subtitle', asString(b.subtitle), MAX.subtitle],
    ['heroLabel', asString(b.heroLabel), MAX.heroLabel],
    ['price', asString(b.price), MAX.price],
    ['shortDescription', asString(b.shortDescription), MAX.shortDescription],
    ['seoTitle', asString(b.seoTitle), MAX.seoTitle],
    ['seoDescription', asString(b.seoDescription), MAX.seoDescription],
  ];
  for (const [field, value, max] of bounded) {
    if (value.length > max) return { ok: false, error: `${field} must be ${max} characters or fewer.` };
  }

  // URL-bearing fields: enforce length and a safe scheme.
  const whatsappUrl = asString(b.whatsappUrl).trim();
  const seoOgImage = asString(b.seoOgImage).trim();
  const seoCanonical = asString(b.seoCanonical).trim();
  for (const [field, value] of [
    ['whatsappUrl', whatsappUrl],
    ['seoOgImage', seoOgImage],
    ['seoCanonical', seoCanonical],
  ] as const) {
    if (value.length > MAX.url) return { ok: false, error: `${field} is too long.` };
    if (!isSafeUrl(value)) return { ok: false, error: `${field} must be an http(s) or site-relative URL.` };
  }

  const type = asString(b.type) === 'sale' ? 'sale' : 'rental';
  const status = asString(b.status) === 'published' ? 'published' : 'draft';
  const badge = asString(b.badge).trim() || (type === 'rental' ? 'Rental' : 'For Sale');

  // Relations — arrays are capped and each element normalized/length-checked.
  const rawDescriptions = Array.isArray(b.descriptions) ? b.descriptions : [];
  const rawHighlights = Array.isArray(b.highlights) ? b.highlights : [];
  const rawFeatures = Array.isArray(b.features) ? b.features : [];
  const rawAmenities = Array.isArray(b.amenityIds) ? b.amenityIds : [];
  const rawRelated = Array.isArray(b.relatedProperties) ? b.relatedProperties : [];

  if (
    rawDescriptions.length > MAX_ITEMS.descriptions ||
    rawHighlights.length > MAX_ITEMS.highlights ||
    rawFeatures.length > MAX_ITEMS.features ||
    rawAmenities.length > MAX_ITEMS.amenities ||
    rawRelated.length > MAX_ITEMS.related
  ) {
    return { ok: false, error: 'Too many items submitted for one of the property sections.' };
  }

  const descriptions = rawDescriptions
    .map((d, i) => ({ text: asString((d as { text?: unknown })?.text).slice(0, MAX.descriptionText), sortOrder: i }))
    .filter((d) => d.text);

  const highlights = rawHighlights
    .map((h, i) => {
      const item = h as { icon?: unknown; label?: unknown };
      return {
        icon: asString(item?.icon).slice(0, MAX.highlightIcon),
        label: asString(item?.label).slice(0, MAX.highlightLabel),
        sortOrder: i,
      };
    })
    .filter((h) => h.label);

  // Features arrive as plain strings (seed) or { text } objects (form).
  const features = rawFeatures
    .map((f, i) => {
      const text = typeof f === 'string' ? f : asString((f as { text?: unknown })?.text);
      return { text: text.slice(0, MAX.featureText), sortOrder: i };
    })
    .filter((f) => f.text);

  const amenityIds = rawAmenities
    .map((a) => asString(a).slice(0, MAX.amenityId))
    .filter(Boolean);

  for (const r of rawRelated) {
    const image = asString((r as { image?: unknown })?.image).trim();
    if (!isSafeUrl(image)) {
      return { ok: false, error: 'Related property image must be an http(s) or site-relative URL.' };
    }
  }
  const relatedProperties = rawRelated.map((r, i) => {
    const item = r as { slug?: unknown; name?: unknown; location?: unknown; image?: unknown };
    return {
      slug: asString(item?.slug).slice(0, MAX.relatedField),
      name: asString(item?.name).slice(0, MAX.relatedField),
      location: asString(item?.location).slice(0, MAX.relatedField),
      image: asString(item?.image).slice(0, MAX.url),
      sortOrder: i,
    };
  });

  return {
    ok: true,
    data: {
      slug,
      name,
      type,
      status,
      badge,
      location: asString(b.location),
      subtitle: asString(b.subtitle),
      heroLabel: asString(b.heroLabel),
      bedrooms: asInt(b.bedrooms),
      bathrooms: asInt(b.bathrooms),
      guests: asNullableInt(b.guests),
      squareFeet: asNullableInt(b.squareFeet),
      price: asString(b.price),
      shortDescription: asString(b.shortDescription),
      whatsappUrl,
      seoTitle: asString(b.seoTitle).trim() || name,
      seoDescription: asString(b.seoDescription) || asString(b.shortDescription) || '',
      seoOgImage,
      seoCanonical: seoCanonical || `https://www.kunaay.com/properties/${slug}`,
      displayOrder: asInt(b.displayOrder),
      descriptions,
      highlights,
      features,
      amenityIds,
      relatedProperties,
    },
  };
}
