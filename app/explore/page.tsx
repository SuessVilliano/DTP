'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import { SkeletonCard } from '@/components/SkeletonCard'
import Link from 'next/link'

const FILTER_CHIPS = ['All', 'Live Now', 'Verified', 'Popular', 'Stocks', 'Crypto', 'Options']

const MOCK_CREATORS = [
  { username: 'stonkqueen', display_name: 'StonkQueen', bio: 'Options trader by day, chaos agent by night', is_live: true, subscriber_count: 842, verified: true },
  { username: 'chartmaster', display_name: 'ChartMaster', bio: 'Technical analysis + premium content', is_live: false, subscriber_count: 2341, verified: true },
  { username: 'wallstbabe', display_name: 'WallStBabe', bio: 'Former Goldman analyst. Now I trade for fun.', is_live: false, subscriber_count: 1203, verified: false },
  { username: 'cryptoqueen', display_name: 'CryptoQueen', bio: 'SOL maxi. DeFi degen. Premium access 24/7.', is_live: true, subscriber_count: 3892, verified: true },
  { username: 'bulltrap', display_name: 'BullTrap', bio: 'I called the top. Twice. Buy my newsletter.', is_live: false, subscriber_count: 567, verified: false },
  { username: 'dividendgal', display_name: 'DividendGal', bio: 'Passive income queen. 40% yield, for real.', is_live: false, subscriber_count: 921, verified: true },
  { username: 'scalperking', display_name: 'ScalperKing', bio: '200 trades a day. Watch me.', is_live: true, subscriber_count: 1456, verified: false },
  { username: 'eatyourstoploss', display_name: 'EatYourStopLoss', bio: 'Risk management is a vibe.', is_live: false, subscriber_count: 344, verified: false },
  { username: 'optionsflow', display_name: 'OptionsFlow', bio: 'Unusual options activity tracker + exclusive content', is_live: false, subscriber_count: 2108, verified: true },
]

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState<'popular' | 'new' | 'live'>('popular')
  const [creators, setCreators] = useState(MOCK_CREATORS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true)
      try {
        const p = new URLSearchParams()
        if (debounced) p.set('q', debounced)
        if (filter !== 'All') p.set('filter', filter.toLowerCase().replace(' ', '_'))
        p.set('sort', sort)
        const res = await fetch(`/api/creators/search?${p}`)
        if (res.ok) {
          const data = await res.json()
          setCreators(data.creators?.length ? data.creators : MOCK_CREATORS)
        }
      } catch {
        setCreators(MOCK_CREATORS)
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [debounced, filter, sort])

  const displayed = filter === 'Live Now'
    ? creators.filter(c => c.is_live)
    : filter === 'Verified'
    ? creators.filter(c => c.verified)
    : creators

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white mb-1">Explore Creators</h1>
          <p className="text-[#505065] text-sm">Find your next favorite creator</p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#505065] text-sm">🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or bio..."
            className="w-full bg-[#12121A] border border-[#1E1E30] rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-[#505065] focus:outline-none focus:border-[#00E5CC]/30"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'none' }}>
          {FILTER_CHIPS.map(chip => (
            <button
              key={chip}
              onClick={() => setFilter(chip)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                filter === chip
                  ? 'bg-[#00E5CC] text-[#0A0A0F]'
                  : 'bg-[#12121A] text-[#505065] border border-[#1E1E30] hover:text-white'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex justify-end mb-5">
          <select
            value={sort}
            onChange={e => setSort(e.target.value as any)}
            className="bg-[#12121A] border border-[#1E1E30] rounded-lg px-3 py-1.5 text-xs text-[#A0A0B0] focus:outline-none"
          >
            <option value="popular">Most Popular</option>
            <option value="new">Newest</option>
            <option value="live">Live First</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#505065]">No creators found{debounced ? ` for "${debounced}"` : ''}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {displayed.map(creator => (
              <Link
                key={creator.username}
                href={`/creator/${creator.username}`}
                className="bg-[#12121A] rounded-xl border border-[#1E1E30] p-4 hover:border-[#00E5CC]/40 transition-all group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#00E5CC] to-[#0099AA] flex items-center justify-center text-sm font-black text-[#0A0A0F] shrink-0">
                    {creator.display_name[0]}
                    {creator.is_live && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-[#12121A]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-white truncate">{creator.display_name}</span>
                      {creator.verified && <span className="text-[#00E5CC] text-xs shrink-0">✓</span>}
                    </div>
                    <div className="text-xs text-[#505065]">@{creator.username}</div>
                  </div>
                </div>
                <p className="text-xs text-[#A0A0B0] mb-3 line-clamp-2 leading-relaxed">{creator.bio}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#505065]">{Number(creator.subscriber_count).toLocaleString()} subs</span>
                  {creator.is_live && (
                    <span className="text-[10px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full">LIVE</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
