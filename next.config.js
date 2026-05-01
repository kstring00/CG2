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
  // The intake-first homepage replaces the prior /support/next-steps stage flow.
  // Next.js forwards query strings (e.g. ?stage=school-transition) to the
  // destination by default, so deep links from getRecommendedAction and
  // SupportShell continue to land users on the right stage.
  async redirects() {
    return [
      {
        source: '/support/next-steps',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
