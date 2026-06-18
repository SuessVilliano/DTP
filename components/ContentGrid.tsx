'use client'

import Link from 'next/link'
import { useTokenTier } from './TokenGate'

export interface ContentItem {
  id: string; title: string; thumbnail: string; duration: number; views: number
  creatorName: string; creatorId: string; category: string; isLocked: boolean
  isPPV: boolean; ppvPrice?: number; publishedAt: string; aspectRatio?: '16:9' | '9:16'
}

interface ContentGridProps { items: ContentItem[]; columns?: 2 | 3 | 4 }

const CATEGORIES: Record<string, { label: string; color: string }> = {
  'after-hours': { label: 'After Hours', color: '#00E5CC' }, 'bull-run': { label: 'Bull Run', color: '#00FF88' },
  'bear-trap': { label: 'Bear Trap', color: '#FF3366' }, 'hodl': { label: 'HODL', color: '#FFD700' },
  'short-squeeze': { label: 'Short Squeeze', color: '#FF6B35' }, 'degen-mode': { label: 'Degen Mode', color: '#9945FF' },
}

function formatDuration(seconds: number): string { const m = Math.floor(seconds / 60); const s = seconds % 60; return `${m}:${s.toString().padStart(2, '0')}` }
function formatViews(views: number): string { if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`; if (views >= 1000) return `${(views / 1000).toFixed(1)}K`; return views.toString() }

export function ContentGrid({ items, columns = 3 }: ContentGridProps) {
  const { tier } = useTokenTier()
  const gridClass = { 2: 'grid-cols-1 sm:grid-cols-2', 3: 'grid-cols-2 sm:grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' }[columns]

  return (
    <div className={`grid ${gridClass} gap-3 md:gap-4`}>
      {items.map((item) => {
        const isLocked = item.isLocked && tier === 'free'
        const cat = CATEGORIES[item.category]
        return (
          <Link key={item.id} href={`/watch/${item.id}`} className="group block">
            <div className="card overflow-hidden">
              <div className="relative overflow-hidden" style={{ aspectRatio: item.aspectRatio === '9:16' ? '9/16' : '16/9' }}>
                <div className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 ${isLocked ? 'content-blur' : ''}`} style={{ backgroundImage: `url(${item.thumbnail})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {isLocked && <div className="absolute inset-0 flex items-center justify-center"><div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-[#00E5CC33]"><svg className="w-8 h-8 text-[#00E5CC]" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg></div></div>}
                {item.isPPV && <div className="absolute top-2 left-2"><span className="bg-[#FFD70022] border border-[#FFD70044] text-[#FFD700] text-[10px] font-bold font-mono px-1.5 py-0.5 rounded">PPV ${item.ppvPrice}</span></div>}
                <div className="absolute bottom-2 right-2"><span className="bg-black/70 text-white text-xs font-mono px-1.5 py-0.5 rounded">{formatDuration(item.duration)}</span></div>
                {cat && <div className="absolute top-2 right-2"><span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: `${cat.color}22`, border: `1px solid ${cat.color}44`, color: cat.color }}>{cat.label}</span></div>}
                {!isLocked && <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><div className="w-12 h-12 rounded-full bg-[#00E5CC]/90 flex items-center justify-center"><svg className="w-6 h-6 text-[#0A0A0F] ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div></div>}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover:text-[#00E5CC] transition-colors">{isLocked ? '🔒 ' : ''}{item.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <Link href={`/creator/${item.creatorId}`} className="text-xs text-[#A0A0B0] hover:text-[#00E5CC] transition-colors" onClick={(e) => e.stopPropagation()}>@{item.creatorName}</Link>
                  <span className="text-xs text-[#505065] font-mono">{formatViews(item.views)} views</span>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
