import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
};

export default nextConfig;
