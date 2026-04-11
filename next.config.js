/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.up.railway.app',
      },
      {
        protocol: 'https',
        hostname: 'cryptowise.vercel.app',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
    ],
  },
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY || '',
    GOLD_API_KEY: process.env.GOLD_API_KEY || '',
  },
  // Allow external APIs
  async rewrites() {
    return [
      {
        source: '/api/binance/:path*',
        destination: 'https://api.binance.com/api/v3/:path*',
      },
      {
        source: '/api/gold/:path*',
        destination: 'https://api.gold-api.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig
