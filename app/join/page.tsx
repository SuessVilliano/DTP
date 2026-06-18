import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { TickerTape } from '@/components/TickerTape'

export const metadata: Metadata = {
  title: 'Membership — Join DTP',
  description: 'Three tiers of access. Pay with DTP tokens, SOL, or USDC.',
}

const TIERS = [
  {
    id: 'free',
    name: 'Free Trader',
    emoji: '📊',
    priceUSD: 0,
    priceCrypto: 'Free',
    color: '#A0A0B0',
    borderColor: '#1E1E30',
    badge: null,
    features: [
      'Age-verified entry',
      'Teaser clips (first 60 seconds)',
      'Live ticker tape',
      'Basic markets page',
      'ExoClick ads (removed at Bull+)',
    ],
    notIncluded: [
      'Full video access',
      'HD streaming',
      'Creator DMs',
      'Live sessions',
      'Ad-free browsing',
    ],
    cta: 'Start Free',
    ctaHref: '/register',
    ctaStyle: 'btn-ghost',
  },
  {
    id: 'bull',
    name: 'Bull',
    emoji: '🐂',
    priceUSD: 29,
    priceCrypto: '1,000 DTP or 29 USDC/mo',
    color: '#00E5CC',
    borderColor: '#00E5CC',
    badge: 'MOST POPULAR',
    features: [
      'Everything in Free Trader',
      'Full video library access',
      'Ad-free browsing',
      'Live trading room access',
      'Basic creator chat',
      'DTP token holder benefits',
      'Pay with DTP token or USDC (x402)',
    ],
    notIncluded: [
      'Creator DMs',
      'Exclusive Whale content',
      'Live session access',
    ],
    cta: 'Get Bull Access',
    ctaHref: '/register?tier=bull',
    ctaStyle: 'btn-cyan',
  },
  {
    id: 'whale',
    name: 'Whale',
    emoji: '🐋',
    priceUSD: 99,
    priceCrypto: '10,000 DTP or 99 USDC/mo',
    color: '#FFD700',
    borderColor: '#FFD700',
    badge: 'PREMIUM',
    features: [
      'Everything in Bull',
      'Private creator DMs',
      'Exclusive Whale-only content',
      'Live session full access',
      'Priority chat in live rooms',
      'NFT member badge (Solana)',
      'Early access to new drops',
      'Revenue sharing (via DTP token)',
    ],
    notIncluded: [],
    cta: 'Become a Whale',
    ctaHref: '/register?tier=whale',
    ctaStyle: 'btn-gold',
  },
]

const PAYMENT_METHODS = [
  { icon: '⚡', name: 'TipLink', description: 'Instant SOL — no wallet setup needed', color: '#00E5CC' },
  { icon: '💎', name: 'USDC via x402', description: 'Pay-per-second streaming (Coinbase Base)', color: '#2775CA' },
  { icon: '₿', name: '100+ Cryptos', description: 'BTC, ETH, SOL, USDT, and more via NOWPayments', color: '#F7931A' },
  { icon: '🪙', name: 'DTP Token', description: 'Native Solana token — hold to unlock tiers', color: '#9945FF' },
]

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <TickerTape />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-3">
            Choose Your <span className="text-[#00E5CC]">Position</span>
          </h1>
          <p className="text-[#A0A0B0] text-lg max-w-xl mx-auto">
            Three tiers. Pay with crypto. No bank needed. No questions asked.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative flex flex-col rounded-2xl border-2 bg-[#12121A] overflow-hidden transition-transform hover:-translate-y-1 ${
                tier.id === 'bull' ? 'md:-mt-4 md:mb-4' : ''
              }`}
              style={{ borderColor: tier.borderColor }}
            >
              {tier.badge && (
                <div
                  className="absolute top-0 left-0 right-0 py-1.5 text-center text-xs font-bold tracking-wider text-[#0A0A0F]"
                  style={{ background: tier.color }}
                >
                  {tier.badge}
                </div>
              )}

              <div className={`p-6 ${tier.badge ? 'pt-10' : ''}`}>
                <div className="text-4xl mb-3">{tier.emoji}</div>
                <h2 className="text-2xl font-black text-white mb-1">{tier.name}</h2>
                <div className="mb-2">
                  <span className="text-3xl font-black" style={{ color: tier.color }}>
                    {tier.priceUSD === 0 ? 'Free' : `$${tier.priceUSD}`}
                  </span>
                  {tier.priceUSD > 0 && (
                    <span className="text-[#505065] text-sm">/mo</span>
                  )}
                </div>
                <p className="text-xs text-[#505065] font-mono mb-5">{tier.priceCrypto}</p>

                <Link
                  href={tier.ctaHref}
                  className={`btn ${tier.ctaStyle} w-full text-center mb-6`}
                >
                  {tier.cta}
                </Link>

                <div className="space-y-2">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <span className="text-[#00FF88] mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-[#A0A0B0]">{f}</span>
                    </div>
                  ))}
                  {tier.notIncluded.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <span className="text-[#505065] mt-0.5 flex-shrink-0">✗</span>
                      <span className="text-[#505065]">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="bg-[#12121A] border border-[#1E1E30] rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 text-center">
            Pay with anything. Stay anonymous.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PAYMENT_METHODS.map((pm) => (
              <div
                key={pm.name}
                className="bg-[#1A1A26] border border-[#1E1E30] rounded-xl p-4 text-center"
              >
                <div className="text-3xl mb-2">{pm.icon}</div>
                <div className="font-bold text-sm text-white mb-1">{pm.name}</div>
                <div className="text-xs text-[#505065]">{pm.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DTP Token CTA */}
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: 'linear-gradient(135deg, #12121A 0%, #1A1A26 100%)', border: '1px solid #FFD70033' }}
        >
          <div className="text-4xl mb-3">🪙</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Unlock tiers by holding <span className="text-[#FFD700]">DTP tokens</span>
          </h3>
          <p className="text-[#A0A0B0] text-sm max-w-md mx-auto mb-4">
            Hold 1,000 DTP tokens to unlock Bull tier automatically. Hold 10,000 for Whale.
            No monthly payments — just hold.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/token" className="btn btn-gold">
              Learn about DTP Token →
            </Link>
            <Link href="/register" className="btn btn-ghost">
              Connect Wallet
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
