/** @type {import('next').NextConfig} */

// The project published under texasabacenterscg.com before it became a
// standalone, independent resource. Anything that still resolves to the legacy
// host is sent to the matching path on the new domain with a permanent (308)
// redirect so search engines transfer the old URLs rather than index both.
const LEGACY_HOSTS = ['texasabacenterscg.com', 'www.texasabacenterscg.com'];
const SITE_ORIGIN = 'https://commongroundautism.org';

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
      // /design-preview is the module the homepage re-exports. Serving it at
      // its own URL too would publish the same page twice, so it folds into /.
      {
        source: '/design-preview',
        destination: '/',
        permanent: true,
      },
      ...LEGACY_HOSTS.map((host) => ({
        source: '/:path*',
        has: [{ type: 'host', value: host }],
        destination: `${SITE_ORIGIN}/:path*`,
        permanent: true,
      })),
    ];
  },
};

module.exports = nextConfig;
