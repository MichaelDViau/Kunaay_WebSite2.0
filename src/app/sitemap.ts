import type { MetadataRoute } from 'next';
import { getAllProperties } from '@/lib/property-service';
import { absoluteUrl } from '@/lib/site';

// Regenerate at most once an hour so newly published properties show up in the
// sitemap without rebuilding the whole site.
export const revalidate = 3600;

/**
 * Dynamic XML sitemap, served at /sitemap.xml.
 *
 * It lists the public marketing pages plus every published property detail page
 * (clean /properties/<slug> URLs). Property rows come from the database via the
 * property service, which transparently falls back to bundled data when the
 * database is unavailable — so the sitemap is always valid, even at build time.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: absoluteUrl('/rentals'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/sales'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/about'), lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteUrl('/contact'), lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  let propertyPages: MetadataRoute.Sitemap = [];
  try {
    const properties = await getAllProperties();
    propertyPages = properties.map((p) => ({
      url: absoluteUrl(`/properties/${p.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch {
    // Never let a data hiccup break sitemap generation — fall back to the
    // static pages only.
    propertyPages = [];
  }

  return [...staticPages, ...propertyPages];
}
