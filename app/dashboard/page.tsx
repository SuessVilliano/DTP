'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import { XPBar } from '@/components/XPBar'
import { BadgeDisplay } from '@/components/BadgeDisplay'
import Link from 'next/link'

const QUICK_LINKS = [
  { label: 'Browse Creators', href: '/explore', icon: '🔍', color: '#00E5CC' },
  { label: 'Live Markets', href: '/markets', icon: '📈', color: '#FFD700', tour: 'markets' },
  { label: 'Messages', href: '/messages', icon: '💬', color: '#6C5CE7' },
  { label: 'Become a Creator', href: '/become-a-creator', icon: '✨', color: '#FF3366' },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [xpData, setXpData] = useState<{ xp: number; level: number; badges: any[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?redirect=/dashboard')
  }, [status, router])

  useEffect(() => {
    if (!session?.user) return
    fetch('/api/user/xp')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setXpData(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [session])

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="min-h-screen bg-[#0A0A0F]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-[#12121A] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') return null

  const username = session?.user?.name || session?.user?.email?.split('@')[0] || 'Trader'

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-white">
            Welcome back, {username}! 👋
          </h1>
          <p className="text-[#505065] text-sm mt-1">Your DTP command center.</p>
        </div>

        {/* XP Bar */}
        <div data-tour="xpbar">
          {xpData ? (
            <XPBar xp={xpData.xp} />
          ) : (
            <div className="h-20 bg-[#12121A] rounded-xl animate-pulse" />
          )}
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-2 gap-3">
          {QUICK_LINKS.map(item => (
            <Link
              key={item.label}
              href={item.href}
              data-tour={item.tour}
              className="flex items-center gap-3 p-4 bg-[#12121A] rounded-xl border border-[#1E1E30] hover:border-[#00E5CC]/30 transition-all group"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-bold text-white group-hover:opacity-90">{item.label}</span>
              <span className="ml-auto text-[#505065] text-sm">→</span>
            </Link>
          ))}
        </div>

        {/* Creator profile CTA */}
        <div
          className="rounded-xl border p-5 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg,#00E5CC08,#FFD70008)', borderColor: '#00E5CC20' }}
        >
          <div>
            <p className="text-sm font-black text-white mb-1">Your creator profile</p>
            <p className="text-xs text-[#505065]">Manage content, bookings, and earnings.</p>
          </div>
          <Link
            href={`/creator/${username}`}
            data-tour="subscribe"
            className="px-4 py-2 rounded-xl text-xs font-black text-[#0A0A0F] shrink-0 ml-4"
            style={{ background: 'linear-gradient(135deg,#00E5CC,#0099AA)' }}
          >
            View Profile
          </Link>
        </div>

        {/* Badges */}
        {xpData?.badges?.length ? (
          <div>
            <h2 className="text-base font-black text-white mb-4">Your Badges</h2>
            <BadgeDisplay badges={xpData.badges} />
          </div>
        ) : null}
      </div>
      <BottomNav />
    </div>
  )
}
