import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from '@/components/Providers'
import { BottomNav } from '@/components/BottomNav'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: 'Day Trader Porn — Where the market never closes.', template: '%s | Day Trader Porn' },
  description: 'The premium adult platform for serious traders. Crypto-native content for the market-obsessed.',
  keywords: ['day trading', 'adult content', 'crypto', 'DTP token', 'markets'],
  robots: { index: false, follow: false, nocache: true },
  openGraph: { title: 'Day Trader Porn', description: 'Where the market never closes.', url: 'https://daytraderporn.com', siteName: 'Day Trader Porn', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0A0A0F" />
        <meta name="rating" content="adult" />
        <meta name="DC.subject" content="Adult Entertainment" />
      </head>
      <body className="bg-[#0A0A0F] text-white antialiased">
        <Providers>
          {children}
          <BottomNav />
        </Providers>
        <div className="compliance-note">18 U.S.C. § 2257 Record-Keeping Requirements Compliance Statement.{' '}<a href="/2257" className="underline hover:text-white">View Statement</a></div>
      </body>
    </html>
  )
}
