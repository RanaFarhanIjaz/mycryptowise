/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'cryptowise.vercel.app'],
  },
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GOLD_API_KEY: process.env.GOLD_API_KEY,
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
