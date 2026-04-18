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
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:8000',
  },
};

export default nextConfig;
