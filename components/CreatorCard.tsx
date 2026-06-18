'use client'

import Link from 'next/link'

export interface Creator {
  id: string
  username: string
  displayName: string
  avatar: string
  bio?: string
  subscriberCount: number
  totalTipsSOL: number
  totalTipsUSD: number
  isLive: boolean
  contentCount: number
  verified: boolean
}

interface CreatorCardProps {
  creator: Creator
  compact?: boolean
}

export function CreatorCard({ creator, compact = false }: CreatorCardProps) {
  if (compact) return (
    <Link href={`/creator/${creator.username}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1A1A26] transition-colors group">
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-[#1E1E30] group-hover:border-[#00E5CC33] transition-colors" style={{ backgroundImage: `url(${creator.avatar})` }} />
        {creator.isLive && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#FF3366] rounded-full border-2 border-[#0A0A0F]" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-white truncate">{creator.displayName}</span>
          {creator.verified && <span className="text-[#00E5CC] text-xs">✓</span>}
        </div>
        <span className="text-xs text-[#505065]">@{creator.username}</span>
      </div>
      {creator.isLive && <span className="badge badge-live text-[10px]">LIVE</span>}
    </Link>
  )

  return (
    <Link href={`/creator/${creator.username}`} className="card p-4 hover:border-[#00E5CC33] transition-all group block">
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-cover bg-center border-2 border-[#1E1E30] group-hover:border-[#00E5CC44] transition-colors" style={{ backgroundImage: `url(${creator.avatar})` }} />
          {creator.isLive && <span className="absolute -bottom-1 -right-1 badge badge-live text-[9px] px-1">LIVE</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white group-hover:text-[#00E5CC] transition-colors truncate">{creator.displayName}</h3>
            {creator.verified && <span className="text-[#00E5CC] text-sm" title="Verified">✓</span>}
          </div>
          <p className="text-[#505065] text-xs">@{creator.username}</p>
          {creator.bio && <p className="text-[#A0A0B0] text-xs mt-1.5 line-clamp-2">{creator.bio}</p>}
          <div className="flex gap-4 mt-2 text-xs font-mono">
            <span className="text-[#505065]"><span className="text-white font-bold">{creator.subscriberCount.toLocaleString()}</span> subs</span>
            <span className="text-[#505065]"><span className="text-[#FFD700] font-bold">{creator.totalTipsSOL.toFixed(2)} SOL</span> tips</span>
            <span className="text-[#505065]"><span className="text-white font-bold">{creator.contentCount}</span> vids</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
