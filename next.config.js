/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  optimizeFonts: false,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('encoding');
    }
    return config;
  },
  // Remove static export for API routes to work
};

module.exports = nextConfig;