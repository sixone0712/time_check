/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/db/:path*',
  //       destination: 'http://localhost:3001/api/db/:path*',
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
