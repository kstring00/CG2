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
};

module.exports = nextConfig;
