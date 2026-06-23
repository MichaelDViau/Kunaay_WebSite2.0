import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

/**
 * Robots rules for the Next.js app, served at /robots.txt.
 *
 * Public marketing pages are fully crawlable; the admin CMS and write APIs are
 * disallowed so they never appear in search results. The sitemap URL points
 * crawlers at our dynamically generated sitemap (see sitemap.ts).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
