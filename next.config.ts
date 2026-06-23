import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'a0.muscache.com',
      },
      {
        protocol: 'https',
        hostname: 'expertvagabond.com',
      },
    ],
  },
  // Allow the public/assets symlink to be resolved correctly
  outputFileTracingIncludes: {
    '/*': ['./assets/**/*'],
  },

  // Security & caching headers for the Next.js app. These mirror the policy the
  // static host applies via _headers/.htaccess, so the same protections hold no
  // matter how the app is deployed.
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';

    // Content-Security-Policy.
    //   - 'unsafe-inline' is required for Next's inline bootstrap script and the
    //     app's inline styles; the value of the policy here is that it still
    //     blocks loading scripts/objects from any *external* origin, which is
    //     the primary XSS exfiltration/injection vector.
    //   - 'unsafe-eval' and ws: are only needed by the dev server (HMR / React
    //     Refresh) and are therefore added in development only.
    //   - img-src allows https: so admin-configured remote images (OG images,
    //     related-property thumbnails) keep rendering.
    const scriptSrc = isProd ? "'self' 'unsafe-inline'" : "'self' 'unsafe-inline' 'unsafe-eval'";
    const connectSrc = isProd ? "'self'" : "'self' ws:";
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      `script-src ${scriptSrc}`,
      `connect-src ${connectSrc}`,
    ].join('; ');

    const securityHeaders = [
      { key: 'Content-Security-Policy', value: csp },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
      // Tell browsers to stick to HTTPS once seen (production only, where TLS is
      // terminated in front of the app).
      ...(isProd
        ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
        : []),
    ];

    // Never let a browser or shared cache store authenticated admin pages or API
    // responses — they can contain account-specific data.
    const noStore = [{ key: 'Cache-Control', value: 'no-store, max-age=0' }];

    return [
      // Apply baseline security headers to every route.
      { source: '/:path*', headers: securityHeaders },
      { source: '/admin/:path*', headers: noStore },
      { source: '/api/admin/:path*', headers: noStore },
      // Fingerprint-free media and fonts can be cached aggressively.
      {
        source: '/assets/img/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/assets/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
