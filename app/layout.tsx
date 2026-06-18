import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { BottomNav } from '@/components/BottomNav'
import { DemoBanner } from '@/components/DemoBanner'

export const metadata: Metadata = {
  title: 'DayTraderPorn.com — Where Charts Meet Adult Content',
  description: 'The premium adult platform for day traders, crypto degens, and market obsessives.',
  metadataBase: new URL('https://daytraderporn.com'),
  openGraph: {
    title: 'DayTraderPorn.com',
    description: 'Trade by day. Watch by night.',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#0A0A0F] text-white antialiased">
        <Providers>
          {children}
          <BottomNav />
          <DemoBanner />
        </Providers>
      </body>
    </html>
  )
}
