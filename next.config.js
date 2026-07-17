/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    qualities: [100],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 1080, 1440, 1920, 2560],
    imageSizes: [640, 1080, 1440, 1920, 2560],
  },
  // "My Care Plan" (the intake flow at /support/intake) replaces the prior
  // /support/next-steps stage flow, so old links land on the intake instead
  // of breaking. Next.js forwards query strings to the destination by default.
  async redirects() {
    return [
      {
        source: '/support/next-steps',
        destination: '/support/intake',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
