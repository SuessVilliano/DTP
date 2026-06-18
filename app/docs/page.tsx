import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Documentation — DTP',
  description: 'Everything you need to get started on Day Trader Porn. Wallets, memberships, creator program, and more.',
  robots: { index: false, follow: false },
}

const SECTIONS = [
  {
    id: 'getting-started',
    title: '🚀 Getting Started',
    content: [
      {
        heading: 'Age Verification',
        body: 'DTP is an 18+ platform. When you first visit, you\'ll see an age gate. You must confirm you are at least 18 years old (or the age of majority in your jurisdiction) to enter. We take 2257 compliance seriously — all creators are verified adults.',
      },
      {
        heading: 'Creating an Account',
        body: 'Click "Join" or "Register" from the navigation. Enter your email address and choose a password (minimum 8 characters). Your account is created immediately with Free Trader access. No credit card required.',
      },
      {
        heading: 'Choosing a Membership Tier',
        body: 'DTP has three tiers: Free Trader (free), Bull (1,000 DTP tokens), and Whale (10,000 DTP tokens). Tiers are determined automatically by your DTP token balance. Connect your wallet and your tier upgrades instantly. See the Membership Tiers section below for full feature comparison.',
      },
    ],
  },
  {
    id: 'the-floor',
    title: '📈 The Floor (Content Feed)',
    content: [
      {
        heading: 'Browsing Content',
        body: 'The Floor is the main content feed. Free Traders see teaser clips (first 60 seconds). Bull and Whale members see full content. Use the category filter at the top to browse by trading theme: Bull Run, Bear Trap, HODL, After Hours, Degen Mode, and more.',
      },
      {
        heading: 'Unlocking PPV Content',
        body: 'Some content is Pay-Per-View (PPV). You can unlock individual PPV videos without a membership upgrade. Click the "Unlock" button on any PPV video and choose your payment method: TipLink (Google login + USDC), NOWPayments (100+ cryptos), or x402 (USDC on Base).',
      },
      {
        heading: 'Filtering by Category',
        body: 'Use the tag chips above the content grid to filter: Bull Run, Bear Trap, HODL, Degen Mode, After Hours, Short Squeeze, and more. Categories are chosen by creators to match the vibe of their content.',
      },
    ],
  },
  {
    id: 'payments',
    title: '💎 Payments & Crypto',
    content: [
      {
        heading: 'Connecting a Wallet',
        body: 'DTP supports Phantom (Solana) and MetaMask (Ethereum/Base). Click the wallet button in the top navigation. Select your wallet provider. Approve the connection in your wallet extension. Your DTP token balance is read automatically — no signing required.',
      },
      {
        heading: 'Buying DTP Tokens',
        body: 'DTP is a Solana SPL token. You can purchase it on Raydium or Jupiter Exchange. Search for the DTP token contract address (listed on the /token page). You\'ll need SOL to pay for the swap and gas fees. Once tokens are in your connected wallet, your membership tier upgrades automatically.',
      },
      {
        heading: 'TipLink Payments',
        body: 'TipLink lets you pay with USDC using just your Google account — no wallet required. Click "Pay with TipLink" on any PPV video. Sign in with Google. A USDC payment link is generated. Complete the payment. Access is granted immediately on confirmation.',
      },
      {
        heading: 'NOWPayments (100+ Cryptos)',
        body: 'DTP supports over 100 cryptocurrencies via NOWPayments. Choose from Bitcoin, Ethereum, Litecoin, Dogecoin, and many more. Click "Pay with Crypto," select your currency, send the exact amount to the displayed address. Confirmation typically takes 1–3 minutes depending on network.',
      },
      {
        heading: 'x402 USDC Payments',
        body: 'x402 is a new open protocol for USDC micropayments on Coinbase Base. If you have a Base-compatible wallet (Coinbase Wallet, MetaMask), you can pay instantly in USDC with minimal fees. Ideal for frequent small purchases.',
      },
    ],
  },
  {
    id: 'trading-room',
    title: '📊 The Trading Room',
    content: [
      {
        heading: 'Live Charts',
        body: 'The Trading Room (/markets) features live candlestick charts for BTC/USD, ETH/USD, SOL/USD, and NQ Futures. Charts update in real time via Binance WebSocket feeds. Multiple timeframes available: 1m, 5m, 15m, 1h, 4h, 1D.',
      },
      {
        heading: 'What the Data Means',
        body: 'Each candle shows the open, high, low, and close price for the selected time period. Green candles = price closed higher. Red candles = price closed lower. Volume bars show trading activity. The live price line shows the current market price.',
      },
      {
        heading: 'Important Disclaimer',
        body: 'ALL charts on DTP are provided for entertainment purposes ONLY. Nothing on this site constitutes financial advice, investment advice, or a recommendation to buy or sell any asset. Day trading involves substantial risk of loss. Past performance does not indicate future results.',
      },
    ],
  },
  {
    id: 'membership',
    title: '🎯 Membership Tiers',
    content: [
      {
        heading: 'Free Trader (0 DTP)',
        body: 'Free access to the platform after age verification. View teaser clips (first 60 seconds of all content). Access to the live ticker tape and basic markets page. ExoClick ads are shown to free members. No wallet required for Free Trader access.',
      },
      {
        heading: 'Bull Tier (1,000 DTP)',
        body: 'Hold 1,000 DTP tokens to unlock Bull membership. Full video access — no teasers. HD streaming on all content. No ads anywhere on the platform. Access to the full Trading Room. Ability to tip creators in SOL. Unlock PPV content at a discount.',
      },
      {
        heading: 'Whale Tier (10,000 DTP)',
        body: 'Hold 10,000 DTP for the ultimate DTP experience. Everything in Bull, plus: early access to new content, private creator DMs, Whale-exclusive content, live session invites, revenue sharing from platform fees (distributed weekly in USDC), and governance voting rights.',
      },
    ],
  },
  {
    id: 'creator-program',
    title: '🎬 Creator Program',
    content: [
      {
        heading: 'How to Apply',
        body: 'Visit /become-a-creator and fill out the application form. You\'ll need to provide: legal name, email, at least one social profile link, content categories you create, valid government ID (front + back), a selfie holding the ID, and your Solana wallet address for payouts.',
      },
      {
        heading: 'Waitlist & Review Process',
        body: 'After submission, your application enters our review queue. We review all applications within 48 hours. We check: age verification documents, content category fit, existing audience, and compliance with our 2257 requirements. You\'ll receive an email with the decision.',
      },
      {
        heading: 'After Approval',
        body: 'Approved creators receive an invite link to set up their creator profile. You\'ll choose your username, upload a banner and avatar, write your bio, and set your content categories. Then you can start uploading content immediately.',
      },
      {
        heading: 'Revenue Share',
        body: 'DTP offers industry-leading revenue splits: 70% on PPV sales (you keep $7 of every $10), 90% on direct tips (you keep $9 of every $10 tipped). All payouts go directly to your Solana wallet — no delays, no minimums, no chargebacks.',
      },
    ],
  },
  {
    id: 'sextpanther',
    title: '📱 SextPanther Integration',
    content: [
      {
        heading: 'How It Works',
        body: 'SextPanther is a phone/text platform for adult creators. DTP integrates SextPanther so fans can call or text their favorite creators directly from DTP creator profiles. No third-party app needed.',
      },
      {
        heading: 'Call Now / Text Now Buttons',
        body: 'On each creator\'s profile page, you\'ll see "Call Now" and "Text Now" buttons if the creator has linked their SextPanther profile. Clicking opens the SextPanther payment flow in a new tab. Rates are set by the creator on SextPanther. DTP earns a referral commission.',
      },
      {
        heading: 'For Creators: Linking Your Profile',
        body: 'In your creator dashboard, navigate to Integrations → SextPanther. Paste your SextPanther profile URL. The Call/Text buttons will appear on your DTP profile automatically. Ensure your SextPanther account is active and your availability is set correctly.',
      },
    ],
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20">
            <div className="bg-[#12121A] border border-[#1E1E30] rounded-xl p-4">
              <p className="text-xs text-[#505065] uppercase tracking-widest font-mono mb-4">Contents</p>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block px-3 py-2 rounded-lg text-sm text-[#A0A0B0] hover:text-white hover:bg-[#1A1A26] transition-colors"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
              <div className="mt-6 pt-4 border-t border-[#1E1E30]">
                <Link href="/faq" className="block text-sm text-[#00E5CC] hover:underline mb-2">→ FAQ</Link>
                <Link href="/support" className="block text-sm text-[#00E5CC] hover:underline">→ Support</Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Documentation</h1>
            <p className="text-[#A0A0B0]">Everything you need to know about Day Trader Porn.</p>
          </div>

          {/* How DTP Works Visual */}
          <div className="bg-[#12121A] border border-[#1E1E30] rounded-xl p-6 mb-10">
            <h2 className="text-white font-black text-lg mb-6">How DTP Works</h2>
            <div className="mb-8">
              <p className="text-[#505065] text-xs uppercase tracking-widest font-mono mb-4">For Members</p>
              <div className="flex flex-wrap gap-2 items-center">
                {['1. Verify Age', '2. Create Account', '3. Choose Tier', '4. Connect Wallet', '5. Access The Floor'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="bg-[#1A1A26] border border-[#1E1E30] px-3 py-1.5 rounded-lg text-sm text-white font-medium">{step}</span>
                    {i < 4 && <span className="text-[#505065]">→</span>}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[#505065] text-xs uppercase tracking-widest font-mono mb-4">For Creators</p>
              <div className="flex flex-wrap gap-2 items-center">
                {['1. Apply', '2. Get Invited', '3. Upload Content', '4. Set Prices', '5. Get Paid in Crypto'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="bg-[#1A1A26] border border-[#FFD700]/20 px-3 py-1.5 rounded-lg text-sm text-[#FFD700] font-medium">{step}</span>
                    {i < 4 && <span className="text-[#505065]">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {SECTIONS.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-20">
                <h2 className="text-xl font-black text-white mb-6 pb-3 border-b border-[#1E1E30]">{section.title}</h2>
                <div className="space-y-6">
                  {section.content.map((item) => (
                    <div key={item.heading} className="bg-[#12121A] border border-[#1E1E30] rounded-xl p-5">
                      <h3 className="text-white font-bold mb-2">{item.heading}</h3>
                      <p className="text-[#A0A0B0] text-sm leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#12121A] border border-[#1E1E30] rounded-xl p-6 text-center">
            <p className="text-[#A0A0B0] mb-4">Can&apos;t find what you&apos;re looking for?</p>
            <div className="flex gap-4 justify-center">
              <Link href="/faq" className="btn btn-outline text-sm py-2 px-5">Browse FAQ</Link>
              <Link href="/support" className="btn btn-primary text-sm py-2 px-5">Contact Support</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
