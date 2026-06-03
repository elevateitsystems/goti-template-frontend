/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.nba.com' },
      { protocol: 'https', hostname: 'ak-static.cms.nba.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://gotitemplatesbackend-moneylineapp.onrender.com/api/:path*',
      },
    ];
  },
}
export default nextConfig
