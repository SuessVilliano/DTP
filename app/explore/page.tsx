'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { TickerTape } from '@/components/TickerTape'
import { SkeletonCard } from '@/components/SkeletonCard'
import Link from 'next/link'

const MOCK_CREATORS = [
  { id: 'stonkqueen', name: 'StonkQueen', avatar: 'https://picsum.photos/seed/stonkqueen/400/400', tags: ['crypto', 'nq-futures', 'live'], isLive: true, subscribers: 4200 },
  { id: 'btcbabe', name: 'BTCBabe', avatar: 'https://picsum.photos/seed/btcbabe/400/400', tags: ['bitcoin', 'analysis'], isLive: false, subscribers: 3100 },
  { id: 'degenqueen', name: 'DegenQueen', avatar: 'https://picsum.photos/seed/degenqueen/400/400', tags: ['meme-coins', 'entertainment'], isLive: false, subscribers: 2800 },
  { id: 'alphamaven', name: 'AlphaMaven', avatar: 'https://picsum.photos/seed/alphamaven/400/400', tags: ['options', 'education'], isLive: true, subscribers: 5400 },
  { id: 'ethgirl', name: 'ETHGirl', avatar: 'https://picsum.photos/seed/ethgirl/400/400', tags: ['ethereum', 'defi'], isLive: false, subscribers: 1900 },
  { id: 'chartwhisperer', name: 'ChartWhisperer', avatar: 'https://picsum.photos/seed/chartwhisperer/400/400', tags: ['technical-analysis', 'education'], isLive: false, subscribers: 3700 },
]

const FILTER_CHIPS = ['All', 'Live Now', 'Crypto', 'Futures', 'Education', 'Entertainment']

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [sort, setSort] = useState<'popular' | 'newest' | 'live'>('popular')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(MOCK_CREATORS)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => { setDebouncedQuery(query); setLoading(false) }, 300)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    let filtered = MOCK_CREATORS
    if (debouncedQuery) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        c.tags.some(t => t.includes(debouncedQuery.toLowerCase()))
      )
    }
    if (activeFilter === 'Live Now') filtered = filtered.filter(c => c.isLive)
    if (activeFilter === 'Crypto') filtered = filtered.filter(c => c.tags.some(t => ['bitcoin','crypto','ethereum','defi'].includes(t)))
    if (activeFilter === 'Futures') filtered = filtered.filter(c => c.tags.some(t => t.includes('futures') || t.includes('options')))
    if (activeFilter === 'Education') filtered = filtered.filter(c => c.tags.includes('education'))
    if (sort === 'popular') filtered.sort((a, b) => b.subscribers - a.subscribers)
    if (sort === 'live') filtered.sort((a, b) => (b.isLive ? 1 : 0) - (a.isLive ? 1 : 0))
    setResults(filtered)
  }, [debouncedQuery, activeFilter, sort])

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <TickerTape />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-white mb-6">Explore Creators</h1>
        <div className="relative mb-4">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#505065]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search creators, topics..."
            className="w-full bg-[#12121A] border border-[#1E1E30] rounded-xl pl-10 pr-4 py-3 text-white placeholder-[#505065] focus:outline-none focus:border-[#00E5CC]/30 text-sm"
          />
          {query && <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#505065] hover:text-white text-xs">✕</button>}
        </div>
        <div className="flex items-center justify-between mb-6 gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-2 flex-shrink-0">
            {FILTER_CHIPS.map(chip => (
              <button key={chip} onClick={() => setActiveFilter(chip)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeFilter === chip ? 'bg-[#00E5CC] text-[#0A0A0F]' : 'bg-[#12121A] border border-[#1E1E30] text-[#A0A0B0] hover:text-white'}`}
              >{chip}</button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}
            className="flex-shrink-0 bg-[#12121A] border border-[#1E1E30] rounded-lg px-3 py-1.5 text-xs text-[#A0A0B0] focus:outline-none">
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="live">Live First</option>
          </select>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16 text-[#505065]"><div className="text-4xl mb-3">🔍</div><p>No creators found for "{debouncedQuery}"</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(creator => (
              <Link key={creator.id} href={`/creator/${creator.id}`} className="card group hover:border-[#00E5CC]/20 transition-colors overflow-hidden">
                <div className="relative">
                  <img src={creator.avatar} alt={creator.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
                  {creator.isLive && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#FF3366] text-white text-xs font-black rounded-full flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse" />LIVE
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="font-bold text-sm text-white">{creator.name}</div>
                  <div className="text-xs text-[#505065] mt-0.5">{creator.subscribers.toLocaleString()} subscribers</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {creator.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[#1E1E30] text-[#A0A0B0]">#{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
