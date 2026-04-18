/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/images/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/api/images/**',
      },
    ],
  },
};

export default nextConfig;
