'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { TickerTape } from '@/components/TickerTape'
import { VideoPlayer } from '@/components/VideoPlayer'
import { TipButton } from '@/components/TipButton'
import { ContentGrid, ContentItem } from '@/components/ContentGrid'
import { ExoClickAd } from '@/components/ExoClickAd'
import Link from 'next/link'

interface VideoData {
  id: string
  title: string
  description: string
  hlsUrl: string
  poster: string
  duration: number
  views: number
  likes: number
  creator: {
    id: string
    username: string
    displayName: string
    avatar: string
    subscriberCount: number
  }
  category: string
  isPPV: boolean
  ppvPrice: number
  isLocked: boolean
  tags: string[]
  publishedAt: string
}

// Mock fetch — replace with real API call
async function fetchVideo(id: string): Promise<VideoData> {
  return {
    id,
    title: 'After-Hours Rally — She Bought the Dip',
    description:
      'When the market dips after hours, she knows exactly what to do. Premium content for Bull and Whale members. Filmed in 4K.',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', // Public test HLS
    poster: `https://picsum.photos/seed/${id}/1280/720`,
    duration: 842,
    views: 24500,
    likes: 1820,
    creator: {
      id: 'stonkqueen',
      username: 'stonkqueen',
      displayName: 'StonkQueen',
      avatar: `https://picsum.photos/seed/stonkqueen/200/200`,
      subscriberCount: 4200,
    },
    category: 'after-hours',
    isPPV: false,
    ppvPrice: 4.99,
    isLocked: false,
    tags: ['after-hours', 'dip-buyer', 'BTC'],
    publishedAt: '2026-06-15T08:00:00Z',
  }
}

const RELATED: ContentItem[] = [
  {
    id: 'v002',
    title: 'Bull Run Energy — All In',
    thumbnail: 'https://picsum.photos/seed/rel1/640/360',
    duration: 614,
    views: 18200,
    creatorName: 'MoonTrader',
    creatorId: 'moontrader',
    category: 'bull-run',
    isLocked: true,
    isPPV: false,
    publishedAt: '2026-06-14T12:00:00Z',
  },
  {
    id: 'v003',
    title: 'Bear Trap Squeeze',
    thumbnail: 'https://picsum.photos/seed/rel2/640/360',
    duration: 1205,
    views: 31700,
    creatorName: 'CryptoKitten',
    creatorId: 'cryptokitten',
    category: 'bear-trap',
    isLocked: false,
    isPPV: true,
    ppvPrice: 4.99,
    publishedAt: '2026-06-13T18:00:00Z',
  },
  {
    id: 'v005',
    title: 'Short Squeeze — Obliterates Bears',
    thumbnail: 'https://picsum.photos/seed/rel3/640/360',
    duration: 756,
    views: 28900,
    creatorName: 'StonkQueen',
    creatorId: 'stonkqueen',
    category: 'short-squeeze',
    isLocked: false,
    isPPV: false,
    publishedAt: '2026-06-11T15:00:00Z',
  },
]

export default function WatchPage() {
  const { id } = useParams<{ id: string }>()
  const [video, setVideo] = useState<VideoData | null>(null)
  const [liked, setLiked] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<string[]>([])

  useEffect(() => {
    if (id) fetchVideo(id).then(setVideo)
  }, [id])

  if (!video) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00E5CC] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <TickerTape />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main player area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video player */}
            <VideoPlayer
              src={video.hlsUrl}
              poster={video.poster}
              title={video.title}
              videoId={video.id}
              isPPV={video.isPPV}
              ppvPrice={video.ppvPrice}
              ppvPriceCrypto={`${(video.ppvPrice * 0.014).toFixed(3)} SOL`}
              isLocked={video.isLocked}
              showChartOverlay={false}
            />

            {/* Video meta */}
            <div className="space-y-3">
              <h1 className="text-xl font-bold text-white leading-tight">{video.title}</h1>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-[#505065] font-mono">
                  {video.views.toLocaleString()} views
                </span>
                <span className="text-[#1E1E30]">·</span>
                <span className="text-sm text-[#505065] font-mono">
                  {new Date(video.publishedAt).toLocaleDateString()}
                </span>

                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      liked
                        ? 'border-[#FF3366] text-[#FF3366] bg-[#FF336611]'
                        : 'border-[#1E1E30] text-[#A0A0B0] hover:border-[#FF336633] hover:text-[#FF3366]'
                    }`}
                  >
                    ♥ {liked ? video.likes + 1 : video.likes}
                  </button>

                  <TipButton
                    creatorId={video.creator.id}
                    creatorName={video.creator.displayName}
                  />

                  <button
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-[#1E1E30] text-[#A0A0B0] hover:text-white hover:border-[#00E5CC33] transition-all"
                  >
                    🔗 Share
                  </button>
                </div>
              </div>

              {/* Creator */}
              <div className="flex items-center justify-between p-4 bg-[#12121A] rounded-xl border border-[#1E1E30]">
                <Link href={`/creator/${video.creator.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div
                    className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-[#1E1E30]"
                    style={{ backgroundImage: `url(${video.creator.avatar})` }}
                  />
                  <div>
                    <div className="font-bold text-white">{video.creator.displayName}</div>
                    <div className="text-[#505065] text-xs">
                      {video.creator.subscriberCount.toLocaleString()} subscribers
                    </div>
                  </div>
                </Link>
                <Link href={`/creator/${video.creator.username}`} className="btn btn-outline text-sm">
                  Subscribe
                </Link>
              </div>

              {/* Description */}
              <div className="bg-[#12121A] rounded-xl border border-[#1E1E30] p-4">
                <p className="text-[#A0A0B0] text-sm leading-relaxed">{video.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {video.tags.map((tag) => (
                    <span key={tag} className="text-xs text-[#00E5CC] bg-[#00E5CC11] border border-[#00E5CC22] px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-3">
                <h3 className="font-bold text-white">Comments</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && comment.trim()) {
                        setComments([comment, ...comments])
                        setComment('')
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (comment.trim()) {
                        setComments([comment, ...comments])
                        setComment('')
                      }
                    }}
                    className="btn btn-cyan px-4"
                  >
                    Post
                  </button>
                </div>
                <div className="space-y-2">
                  {comments.map((c, i) => (
                    <div key={i} className="bg-[#12121A] rounded-lg p-3 border border-[#1E1E30]">
                      <span className="text-sm text-white">{c}</span>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-[#505065] text-sm text-center py-4">
                      Be the first to comment.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <ExoClickAd format="300x250" />
            <div>
              <h3 className="font-bold text-white mb-3">Related</h3>
              <ContentGrid items={RELATED} columns={2} />
            </div>
            <div className="text-[10px] text-[#505065] text-center leading-relaxed px-2">
              All performers are 18+ years of age.{' '}
              <a href="/2257" className="text-[#A0A0B0] hover:underline">18 U.S.C. § 2257 Statement</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
