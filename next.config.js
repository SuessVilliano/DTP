/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    domains: ['daytraderporn.com', 'cdn.daytraderporn.com', 'images.daytraderporn.com'],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.exoclick.com *.exdynsrv.com *.tawk.to embed.tawk.to",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: *.exoclick.com",
              "media-src 'self' blob:",
              "connect-src 'self' wss://stream.binance.com:9443 wss://stream.binance.com *.alpha-vantage.co api.nowpayments.io tiplink.io *.solana.com",
              "frame-src 'self' tiplink.io *.tawk.to"
            ].join('; ')
          }
        ]
      }
    ]
  },
  async rewrites() {
    return [
      { source: '/ws/binance/:path*', destination: 'https://stream.binance.com:9443/:path*' }
    ]
  },
}

module.exports = nextConfig
