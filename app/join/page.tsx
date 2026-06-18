'use client'

import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import Link from 'next/link'

const PLANS = [
  {
    name: 'Free',
    price: 0,
    color: '#505065',
    perks: ['Browse all public profiles', 'Basic market data', 'Limited messages', 'Demo mode access'],
  },
  {
    name: 'Retail',
    price: 9.99,
    color: '#00E5CC',
    perks: ['Everything in Free', 'Full creator access', 'Unlimited messages', 'Priority DMs', '5% tip bonus'],
    popular: true,
  },
  {
    name: 'Whale',
    price: 99.99,
    color: '#FFD700',
    perks: ['Everything in Retail', 'PPV content unlocked', 'Monthly 1-on-1 calls', 'VIP badge', '20% tip bonus'],
  },
]

const PAYMENT_METHODS = [
  {
    icon: '💳',
    title: 'Credit Card',
    subtitle: 'via trusted platforms',
    color: '#6C5CE7',
    desc: 'Subscribe and pay via SextPanther, Fanvue, LoyalFans, ManyVids, or NiteFlirt. All major credit cards accepted. DTP earns a small affiliate commission.',
    tags: ['SextPanther', 'Fanvue', 'LoyalFans', 'ManyVids', 'NiteFlirt'],
    cta: 'Browse Creators',
    href: '/explore',
  },
  {
    icon: '⧆',
    title: 'Crypto',
    subtitle: 'SOL · USDC',
    color: '#00E5CC',
    desc: 'Send SOL or USDC directly from your Phantom or Solflare wallet. Instant, low-fee, non-custodial — no KYC required.',
    tags: ['Phantom Wallet', 'Solflare', 'SOL', 'USDC'],
    cta: 'Learn More',
    href: '/token',
  },
  {
    icon: '🪙',
    title: 'DTP Token',
    subtitle: 'coming soon',
    color: '#FFD700',
    desc: 'Our native token. Stake for premium access, earn revenue share, and participate in platform governance. Launching on Solana.',
    tags: ['Staking', 'Revenue Share', 'Governance', 'XP Rewards'],
    cta: null,
    href: '/token',
    soon: true,
  },
]

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-3">Join DayTraderPorn</h1>
          <p className="text-[#A0A0B0] max-w-lg mx-auto text-sm">
            Choose your plan. Pay how you want — credit card through our partner platforms, or directly with crypto.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-4 mb-14">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`bg-[#12121A] rounded-2xl border p-6 flex flex-col relative ${
                plan.popular ? 'ring-1 ring-[#00E5CC]/60' : ''
              }`}
              style={{ borderColor: plan.color + '30' }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black px-3 py-1 rounded-full text-[#0A0A0F]"
                  style={{ background: '#00E5CC' }}
                >
                  Most Popular
                </div>
              )}
              <div className="mb-5">
                <p className="text-xs font-black mb-1" style={{ color: plan.color }}>{plan.name}</p>
                <div className="text-2xl font-black text-white">
                  {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  {plan.price > 0 && <span className="text-sm font-normal text-[#505065]">/mo</span>}
                </div>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.perks.map(perk => (
                  <li key={perk} className="text-xs text-[#A0A0B0] flex items-start gap-2">
                    <span style={{ color: plan.color }} className="mt-0.5 shrink-0">✓</span>
                    {perk}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.price === 0 ? '/register' : `/register?plan=${plan.name.toLowerCase()}`}
                className="block w-full py-2.5 rounded-xl text-sm font-black text-center transition-all hover:opacity-90"
                style={{
                  background: `linear-gradient(135deg,${plan.color},${plan.color}BB)`,
                  color: plan.price === 0 ? '#A0A0B0' : '#0A0A0F',
                }}
              >
                {plan.price === 0 ? 'Sign Up Free' : `Get ${plan.name}`}
              </Link>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="mb-8">
          <h2 className="text-lg font-black text-white mb-2">How Can I Pay?</h2>
          <p className="text-sm text-[#505065] mb-6">Three options. Use whichever is easiest for you.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {PAYMENT_METHODS.map(m => (
              <div
                key={m.title}
                className={`bg-[#12121A] rounded-2xl border p-5 flex flex-col ${m.soon ? 'opacity-70' : ''}`}
                style={{ borderColor: m.color + '25' }}
              >
                {m.soon && (
                  <span
                    className="self-start text-[10px] font-black px-2 py-0.5 rounded-full mb-3"
                    style={{ background: m.color + '20', color: m.color }}
                  >
                    Coming Soon
                  </span>
                )}
                <div className="text-3xl mb-3">{m.icon}</div>
                <p className="text-sm font-black text-white">{m.title}</p>
                <p className="text-xs text-[#505065] mb-3">{m.subtitle}</p>
                <p className="text-xs text-[#A0A0B0] leading-relaxed mb-4 flex-1">{m.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full border"
                      style={{ borderColor: m.color + '30', color: m.color }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {!m.soon && (
                  <Link
                    href={m.href!}
                    className="block text-xs font-black text-center py-2 rounded-xl transition-all hover:opacity-80"
                    style={{ background: m.color + '18', color: m.color, border: `1px solid ${m.color}25` }}
                  >
                    {m.cta} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-[#505065]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#00E5CC] hover:underline">Sign in</Link>
        </p>
      </div>
      <BottomNav />
    </div>
  )
}
