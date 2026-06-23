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
  // matter how the app is deployed. (A strict Content-Security-Policy is left
  // out deliberately — it needs per-page tuning for the AI stream and remote
  // images — and is tracked as a follow-up.)
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
    ];

    return [
      // Apply baseline security headers to every route.
      { source: '/:path*', headers: securityHeaders },
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
