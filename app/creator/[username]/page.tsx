'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { TickerTape } from '@/components/TickerTape'
import { ContentGrid, ContentItem } from '@/components/ContentGrid'
import { TipButton } from '@/components/TipButton'

const MOCK_CREATOR = {
  id: 'stonkqueen',
  username: 'stonkqueen',
  displayName: 'StonkQueen',
  avatar: 'https://picsum.photos/seed/stonkqueen/400/400',
  banner: 'https://picsum.photos/seed/stonkqueen-banner/1200/300',
  bio: 'Professional day trader turned content creator. 7 years in the markets, 3 years creating. I trade BTC, ETH, and NQ futures while you watch. Not financial advice.',
  subscriberCount: 4200,
  totalTipsSOL: 182.5,
  totalTipsUSD: 24800,
  isLive: true,
  contentCount: 68,
  verified: true,
  walletAddress: 'PLACEHOLDER_WALLET_ADDRESS',
  joinedAt: '2024-09-01',
  socialLinks: { twitter: 'https://twitter.com/placeholder' },
}

const MOCK_CONTENT: ContentItem[] = [
  { id: 'v001', title: 'After-Hours Rally', thumbnail: 'https://picsum.photos/seed/sq1/640/360', duration: 842, views: 24500, creatorName: 'StonkQueen', creatorId: 'stonkqueen', category: 'after-hours', isLocked: false, isPPV: false, publishedAt: '2026-06-15T08:00:00Z' },
  { id: 'v005', title: 'Short Squeeze Special', thumbnail: 'https://picsum.photos/seed/sq2/640/360', duration: 756, views: 28900, creatorName: 'StonkQueen', creatorId: 'stonkqueen', category: 'short-squeeze', isLocked: false, isPPV: false, publishedAt: '2026-06-11T15:00:00Z' },
  { id: 'v007', title: 'Exclusive: Degen Mode', thumbnail: 'https://picsum.photos/seed/sq3/640/360', duration: 1024, views: 8200, creatorName: 'StonkQueen', creatorId: 'stonkqueen', category: 'degen-mode', isLocked: true, isPPV: true, ppvPrice: 9.99, publishedAt: '2026-06-08T10:00:00Z' },
]

export default function CreatorPage() {
  const { username } = useParams<{ username: string }>()
  const creator = MOCK_CREATOR
  const [subscribed, setSubscribed] = useState(false)
  const [activeTab, setActiveTab] = useState<'videos' | 'live' | 'about'>('videos')

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <TickerTape />

      {/* Banner */}
      <div className="w-full h-40 md:h-56 bg-cover bg-center relative" style={{ backgroundImage: `url(${creator.banner})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F33] to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 mb-6 relative z-10">
          <div className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-[#0A0A0F] flex-shrink-0" style={{ backgroundImage: `url(${creator.avatar})` }} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-white">{creator.displayName}</h1>
              {creator.verified && <span className="text-[#00E5CC]">✓</span>}
              {creator.isLive && <span className="badge badge-live">LIVE</span>}
            </div>
            <p className="text-[#505065] text-sm">@{creator.username}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <TipButton creatorId={creator.id} creatorName={creator.displayName} recipientWallet={creator.walletAddress} />
            <button onClick={() => setSubscribed(!subscribed)} className={`btn ${subscribed ? 'btn-ghost' : 'btn-cyan'} text-sm`}>
              {subscribed ? '✓ Subscribed' : 'Subscribe'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-[#1E1E30]">
          {[
            { label: 'Subscribers', value: creator.subscriberCount.toLocaleString() },
            { label: 'Videos', value: creator.contentCount.toString() },
            { label: 'SOL earned', value: `${creator.totalTipsSOL.toFixed(2)} SOL`, color: '#FFD700' },
            { label: 'USD equiv', value: `$${creator.totalTipsUSD.toLocaleString()}`, color: '#00FF88' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-xl font-black" style={{ color: stat.color || '#FFFFFF' }}>{stat.value}</div>
              <div className="text-xs text-[#505065] font-mono">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 mb-6 border-b border-[#1E1E30]">
          {(['videos', 'live', 'about'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab ? 'border-[#00E5CC] text-[#00E5CC]' : 'border-transparent text-[#505065] hover:text-white'
              }`}
            >{tab}</button>
          ))}
        </div>

        {activeTab === 'videos' && <ContentGrid items={MOCK_CONTENT} columns={3} />}
        {activeTab === 'live' && (
          <div className="text-center py-16">
            {creator.isLive ? (
              <div className="space-y-4">
                <div className="badge badge-live mx-auto">LIVE NOW</div>
                <p className="text-[#A0A0B0]">Join the live session</p>
                <button className="btn btn-cyan">Enter Live Room →</button>
              </div>
            ) : <p className="text-[#505065]">No live sessions currently scheduled.</p>}
          </div>
        )}
        {activeTab === 'about' && (
          <div className="max-w-2xl space-y-4">
            <p className="text-[#A0A0B0] leading-relaxed">{creator.bio}</p>
            <div className="flex items-center gap-2 text-sm text-[#505065]">
              <span>📅 Member since {new Date(creator.joinedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
            </div>
          </div>
        )}
      </div>
      <div className="pb-16" />
    </div>
  )
}
