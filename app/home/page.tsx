'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import { OnboardingTour } from '@/components/OnboardingTour'

const FALLBACK_CREATORS = [
  { username: 'stonkqueen', display_name: 'StonkQueen', bio: 'Options trader by day, chaos agent by night', is_live: true, subscriber_count: 842 },
  { username: 'chartmaster', display_name: 'ChartMaster', bio: 'Technical analysis + premium content', is_live: false, subscriber_count: 2341 },
  { username: 'wallstbabe', display_name: 'WallStBabe', bio: 'Former Goldman analyst. Now I trade for fun.', is_live: false, subscriber_count: 1203 },
  { username: 'cryptoqueen', display_name: 'CryptoQueen', bio: 'SOL maxi. DeFi degen. Premium access 24/7.', is_live: true, subscriber_count: 3892 },
  { username: 'bulltrap', display_name: 'BullTrap', bio: 'I called the top. Twice. Buy my newsletter.', is_live: false, subscriber_count: 567 },
  { username: 'dividendgal', display_name: 'DividendGal', bio: 'Passive income queen. 40% yield, for real.', is_live: false, subscriber_count: 921 },
]

export default function HomePage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({ members: 0, creators: 0, earnings: 0 })
  const [creators, setCreators] = useState(FALLBACK_CREATORS)
  const [statsLoaded, setStatsLoaded] = useState(false)
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setStats(d) })
      .catch(() => {})
      .finally(() => setStatsLoaded(true))
  }, [])

  useEffect(() => {
    fetch('/api/creators/featured')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.creators?.length) setCreators(d.creators) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (session && typeof window !== 'undefined' && !localStorage.getItem('dtp_tour_done')) {
      const t = setTimeout(() => setShowTour(true), 1200)
      return () => clearTimeout(t)
    }
  }, [session])

  const fmt = (n: number) =>
    n >= 1_000_000 ? `$${(n/1_000_000).toFixed(1)}M`
    : n >= 1_000 ? `$${(n/1_000).toFixed(0)}K`
    : `$${n}`

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-20">
      <Navbar />
      {showTour && <OnboardingTour onComplete={() => setShowTour(false)} />}

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 text-center">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%,#00E5CC10,transparent)' }} />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#12121A] border border-[#1E1E30] rounded-full px-4 py-2 mb-6 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[#A0A0B0]">Live creators streaming now</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Where Trading Meets<br />
            <span style={{ background: 'linear-gradient(135deg,#00E5CC,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Premium Content
            </span>
          </h1>
          <p className="text-[#A0A0B0] text-base mb-8 max-w-xl mx-auto">
            Subscribe to elite creators who share trading insights and exclusive content.
            Pay via credit card through our partner platforms, or crypto.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/explore" data-tour="explore"
              className="px-6 py-3 rounded-xl text-sm font-black text-[#0A0A0F] transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#00E5CC,#0099AA)' }}
            >
              Browse Creators →
            </Link>
            <Link
              href="/demo"
              className="px-6 py-3 rounded-xl text-sm font-black text-white bg-[#12121A] border border-[#1E1E30] hover:border-[#00E5CC]/40 transition-colors"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Members', value: statsLoaded ? stats.members.toLocaleString() : '—' },
            { label: 'Elite Creators', value: statsLoaded ? stats.creators.toLocaleString() : '—' },
            { label: 'Creator Earnings', value: statsLoaded ? fmt(stats.earnings) : '—' },
          ].map(s => (
            <div key={s.label} className="bg-[#12121A] rounded-xl border border-[#1E1E30] p-4 text-center">
              <div
                className="text-2xl font-black"
                style={{ background: 'linear-gradient(135deg,#00E5CC,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {s.value}
              </div>
              <div className="text-xs text-[#505065] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured creators */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-white">Featured Creators</h2>
          <Link href="/explore" className="text-xs text-[#00E5CC] hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {creators.map(creator => (
            <Link
              key={creator.username}
              href={`/creator/${creator.username}`}
              className="bg-[#12121A] rounded-xl border border-[#1E1E30] p-4 hover:border-[#00E5CC]/40 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E5CC] to-[#0099AA] flex items-center justify-center text-sm font-black text-[#0A0A0F] shrink-0">
                  {creator.display_name[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{creator.display_name}</div>
                  <div className="text-xs text-[#505065]">@{creator.username}</div>
                </div>
              </div>
              <p className="text-xs text-[#A0A0B0] leading-relaxed mb-3 line-clamp-2">{creator.bio}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#505065]">{Number(creator.subscriber_count).toLocaleString()} subs</span>
                {creator.is_live && (
                  <span className="text-[10px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Payment options */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <div className="bg-[#12121A] rounded-2xl border border-[#1E1E30] p-6">
          <h2 className="text-lg font-black text-white mb-2">Pay How You Want</h2>
          <p className="text-sm text-[#505065] mb-5">Credit card, crypto, or DTP token — your choice.</p>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { icon: '💳', title: 'Credit Card', desc: 'Via SextPanther, Fanvue, LoyalFans & more' },
              { icon: '⧆', title: 'Crypto', desc: 'SOL or USDC directly from your wallet' },
              { icon: '🪙', title: 'DTP Token', desc: 'Native platform token — coming soon' },
            ].map(opt => (
              <div key={opt.title} className="flex items-start gap-3 p-3 rounded-xl bg-[#0A0A0F] border border-[#1E1E30]">
                <span className="text-2xl">{opt.icon}</span>
                <div>
                  <div className="text-sm font-bold text-white">{opt.title}</div>
                  <div className="text-xs text-[#505065]">{opt.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/join" className="text-xs text-[#00E5CC] hover:underline">See all pricing options →</Link>
          </div>
        </div>
      </section>

      <BottomNav />
    </div>
  )
}
