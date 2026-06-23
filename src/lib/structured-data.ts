import type { Property } from '@/data/types';
import { absoluteUrl, SITE_URL } from '@/lib/site';

/**
 * schema.org structured-data builders.
 *
 * These produce plain objects that are rendered as JSON-LD (see components/seo/
 * JsonLd.tsx). Keeping them here means the markup stays accurate and consistent
 * across pages, and is easy to extend without touching page components.
 */

/** Make a site-relative image path absolute; pass through absolute URLs. */
function toAbsoluteImage(src: string): string {
  if (!src) return '';
  return src.startsWith('http') ? src : absoluteUrl(src);
}

/**
 * Organisation / brand markup for the whole site (rendered once, on the home
 * page). Describes Ku Náay as a real-estate agency operating in the Riviera Maya.
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${SITE_URL}/#organization`,
    name: 'Ku Náay Real Estate',
    url: SITE_URL,
    logo: absoluteUrl('/assets/img/logo.png'),
    image: absoluteUrl('/assets/img/logo.png'),
    description:
      'Luxury vacation rentals and property sales in the Riviera Maya, Playa del Carmen, Playacar and Tulum.',
    areaServed: [
      'Riviera Maya',
      'Playa del Carmen',
      'Playacar',
      'Tulum',
      'Quintana Roo',
    ],
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Quintana Roo',
      addressCountry: 'MX',
    },
  };
}

/** WebSite markup so search engines understand the site name and home URL. */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Ku Náay Real Estate',
    url: SITE_URL,
    inLanguage: ['en', 'es'],
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/**
 * Per-property markup for a detail page. Rentals are described as lodging
 * (Accommodation) and sales as residences (SingleFamilyResidence); both carry
 * bedroom/bathroom counts, location and amenities. Price strings are left off
 * the markup on purpose — they are free-form ("From $1,200/night") and would
 * not validate as numeric Offers — but remain visible on the page.
 */
export function propertyJsonLd(property: Property) {
  const images = [property.gallery.heroImage, ...property.gallery.lightbox]
    .filter(Boolean)
    .map(toAbsoluteImage);
  const uniqueImages = Array.from(new Set(images));

  return {
    '@context': 'https://schema.org',
    '@type': property.type === 'rental' ? 'Accommodation' : 'SingleFamilyResidence',
    name: property.name,
    description: property.seo.description || property.shortDescription,
    url: property.seo.canonical || absoluteUrl(`/properties/${property.slug}`),
    ...(uniqueImages.length ? { image: uniqueImages } : {}),
    ...(property.bedrooms ? { numberOfBedrooms: property.bedrooms } : {}),
    ...(property.bathrooms ? { numberOfBathroomsTotal: property.bathrooms } : {}),
    ...(property.guests
      ? { occupancy: { '@type': 'QuantitativeValue', value: property.guests, unitText: 'guests' } }
      : {}),
    address: {
      '@type': 'PostalAddress',
      ...(property.location ? { addressLocality: property.location } : {}),
      addressRegion: 'Quintana Roo',
      addressCountry: 'MX',
    },
    ...(property.features.length
      ? {
          amenityFeature: property.features.map((name) => ({
            '@type': 'LocationFeatureSpecification',
            name,
            value: true,
          })),
        }
      : {}),
  };
}

/** Home → listing → property breadcrumb trail for a property detail page. */
export function propertyBreadcrumbJsonLd(property: Property) {
  const listing =
    property.type === 'rental'
      ? { name: 'Vacation Rentals', path: '/rentals' }
      : { name: 'Properties for Sale', path: '/sales' };

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: listing.name, item: absoluteUrl(listing.path) },
      {
        '@type': 'ListItem',
        position: 3,
        name: property.name,
        item: property.seo.canonical || absoluteUrl(`/properties/${property.slug}`),
      },
    ],
  };
}
