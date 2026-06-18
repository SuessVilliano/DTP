'use client'

import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import Link from 'next/link'

const TOKEN_FEATURES = [
  { icon: '🎯', title: 'XP & Rewards', desc: 'Earn DTP tokens for every platform interaction — watching content, sending tips, subscribing. XP converts to tokens automatically.' },
  { icon: '🔒', title: 'Stake for Access', desc: 'Stake DTP tokens to unlock premium tiers without recurring subscriptions. The more you hold, the more you unlock.' },
  { icon: '💰', title: 'Creator Revenue Share', desc: 'Token holders earn a proportional share of platform fees. Hold more, earn more from the ecosystem.' },
  { icon: '🗾', title: 'Governance', desc: 'Vote on platform decisions — featured creators, new features, fee structures. One token, one vote.' },
]

const TOKENOMICS = [
  { label: 'Total Supply', value: '1B DTP' },
  { label: 'Creator Rewards', value: '40%' },
  { label: 'Community', value: '30%' },
  { label: 'Platform Treasury', value: '20%' },
  { label: 'Team & Advisors', value: '10%' },
]

const PAY_NOW = [
  { icon: '💳', name: 'Credit Card', desc: 'Via SextPanther, Fanvue, LoyalFans, ManyVids, NiteFlirt', live: true },
  { icon: '⧆', name: 'SOL', desc: 'Send Solana directly from Phantom or Solflare', live: true },
  { icon: '💵', name: 'USDC', desc: 'Stablecoin on Solana — no price volatility', live: true },
  { icon: '🪙', name: 'DTP Token', desc: 'Native token — staking rewards + revenue share', live: false },
]

export default function TokenPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full px-4 py-2 mb-6">
            <span className="text-sm">🪙</span>
            <span className="text-xs font-black text-[#FFD700]">DTP TOKEN</span>
            <span className="text-[10px] text-[#505065] bg-[#FFD700]/15 rounded-full px-2 py-0.5">Launching Soon</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-4">The DayTraderPorn Token</h1>
          <p className="text-[#A0A0B0] max-w-xl mx-auto text-sm leading-relaxed">
            The native currency of the DTP ecosystem. Earn it through platform activity, stake it for access, and participate in creator revenue share.
          </p>
        </div>

        {/* Pay now (before token launches) */}
        <div className="mb-12">
          <h2 className="text-lg font-black text-white mb-2">Pay Today</h2>
          <p className="text-sm text-[#505065] mb-5">While the DTP token is in development, here’s how you can support creators right now:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PAY_NOW.map(p => (
              <div key={p.name} className={`bg-[#12121A] rounded-xl border border-[#1E1E30] p-4 ${!p.live ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-white">{p.name}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      p.live
                        ? 'bg-[#00E5CC]/15 text-[#00E5CC]'
                        : 'bg-[#FFD700]/15 text-[#FFD700]'
                    }`}>
                      {p.live ? 'Live' : 'Soon'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#505065] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Token features */}
        <div className="mb-12">
          <h2 className="text-lg font-black text-white mb-6">What the DTP Token Unlocks</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {TOKEN_FEATURES.map(f => (
              <div key={f.title} className="bg-[#12121A] rounded-xl border border-[#1E1E30] p-5">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-sm font-black text-white mb-2">{f.title}</h3>
                <p className="text-xs text-[#A0A0B0] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tokenomics */}
        <div className="bg-[#12121A] rounded-2xl border border-[#FFD700]/20 p-6 mb-10">
          <h2 className="text-base font-black text-white mb-5">Tokenomics (Preview)</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {TOKENOMICS.map(t => (
              <div key={t.label} className="text-center">
                <div className="text-lg font-black text-[#FFD700]">{t.value}</div>
                <div className="text-xs text-[#505065] mt-1">{t.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-sm text-[#505065] mb-5">Ready to join the platform?</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl text-sm font-black text-[#0A0A0F]"
              style={{ background: 'linear-gradient(135deg,#00E5CC,#0099AA)' }}
            >
              Create Account
            </Link>
            <Link
              href="/join"
              className="px-6 py-3 rounded-xl text-sm font-black text-white bg-[#12121A] border border-[#1E1E30] hover:border-[#FFD700]/40 transition-colors"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
