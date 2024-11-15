/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    domains: [],
  },
  async redirects() {
    return [
      {
        source: '/profile',
        destination: '/profile/inscriptions',
        permanent: true,
      },
      {
        source: '/marketplace',
        destination: '/marketplace/collections/bitcoin',
        permanent: true,
      },
      {
        source: '/marketplace/collections',
        destination: '/marketplace/collections/bitcoin',
        permanent: true,
      },
    ];
  },
  env: {
    IS_MAINNET: process.env.IS_MAINNET,
    BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
  },
};

export default nextConfig;
