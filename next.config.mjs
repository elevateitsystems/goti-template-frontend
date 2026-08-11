/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.nba.com' },
      { protocol: 'https', hostname: 'ak-static.cms.nba.com' },
      { protocol: 'https', hostname: 'utfs.io' },
      { protocol: 'https', hostname: '*.ufs.sh', pathname: '/f/**' },
    ],
  },
}
export default nextConfig
