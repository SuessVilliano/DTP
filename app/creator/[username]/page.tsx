'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import Link from 'next/link'

const PLATFORMS = [
  { key: 'sextpanther_url', label: 'SextPanther', emoji: '📞', color: '#E8A045' },
  { key: 'fanvue_url', label: 'Fanvue', emoji: '💳', color: '#6C5CE7' },
  { key: 'loyalfans_url', label: 'LoyalFans', emoji: '💖', color: '#E84393' },
  { key: 'manyvids_url', label: 'ManyVids', emoji: '🎬', color: '#FF4D8A' },
  { key: 'niteflirt_url', label: 'NiteFlirt', emoji: '☎️', color: '#FF8C00' },
]

const SUB_TIERS = [
  { name: 'Retail', price: 9.99, color: '#00E5CC', perks: ['Access to all public posts', 'DM priority queue', '5% tip bonus'] },
  { name: 'Day Trader', price: 24.99, color: '#FFD700', perks: ['Everything in Retail', 'PPV content unlocked', 'Weekly live Q&A access', '10% tip bonus'] },
  { name: 'Whale', price: 99.99, color: '#FF3366', perks: ['Everything in Day Trader', 'Monthly 1-on-1 call (30 min)', 'Custom content requests', 'VIP DM response SLA', '20% tip bonus'] },
]

const MOCK_CONTENT = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  type: i % 3 === 0 ? 'video' : 'photo',
  price: i % 4 === 0 ? 0 : [4.99, 9.99, 14.99][i % 3],
  locked: i % 4 !== 0,
  thumbnail: null,
  title: `Content ${i + 1}`,
}))

export default function CreatorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const username = params?.username as string

  const [creator, setCreator] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showSubModal, setShowSubModal] = useState(false)
  const [showBookModal, setShowBookModal] = useState(false)
  const [tipAmount, setTipAmount] = useState('')
  const [tipping, setTipping] = useState(false)
  const [activeTab, setActiveTab] = useState<'posts' | 'ppv' | 'live'>('posts')

  const isDemo = typeof document !== 'undefined' &&
    document.cookie.split(';').some(c => c.trim().startsWith('dtp_demo=1'))

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const res = await fetch(`/api/creator/${username}`)
        if (res.ok) {
          const data = await res.json()
          setCreator(data.creator)
        } else {
          setCreator({
            username,
            display_name: username,
            bio: 'This creator is getting set up. Check back soon!',
            avatar_url: null,
            banner_url: null,
            subscriber_count: 0,
            post_count: 0,
            total_earnings: 0,
            is_live: false,
            verified: false,
            sextpanther_url: null,
            fanvue_url: null,
            loyalfans_url: null,
            manyvids_url: null,
            niteflirt_url: null,
          })
        }
      } catch {
        setCreator({
          username,
          display_name: username,
          bio: 'Creator profile',
          avatar_url: null,
          banner_url: null,
          subscriber_count: 142,
          post_count: 37,
          total_earnings: 0,
          is_live: false,
          verified: true,
          sextpanther_url: 'https://www.sextpanther.com',
          fanvue_url: 'https://www.fanvue.com',
          loyalfans_url: null,
          manyvids_url: null,
          niteflirt_url: null,
        })
      } finally {
        setLoading(false)
      }
    }
    if (username) fetchCreator()
  }, [username])

  const handleTip = async () => {
    if (!tipAmount || isNaN(Number(tipAmount))) return
    setTipping(true)
    await new Promise(r => setTimeout(r, 1000))
    alert(`🚀 Tip of $${tipAmount} sent! (Demo)`)
    setTipAmount('')
    setTipping(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F]">
        <Navbar />
        <div className="animate-pulse">
          <div className="h-48 bg-[#12121A]" />
          <div className="max-w-4xl mx-auto px-4 -mt-16">
            <div className="w-28 h-28 rounded-full bg-[#1E1E30] border-4 border-[#0A0A0F] mb-4" />
            <div className="h-6 w-48 bg-[#1E1E30] rounded mb-2" />
            <div className="h-4 w-32 bg-[#1E1E30] rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!creator) return null

  const activePlatforms = PLATFORMS.filter(p => creator[p.key])

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-20">
      <Navbar />

      {/* Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#1E1E30] via-[#12121A] to-[#0A0A0F] overflow-hidden">
        {creator.banner_url && (
          <img src={creator.banner_url} alt="" className="w-full h-full object-cover opacity-60" />
        )}
        {!creator.banner_url && (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#0A0A0F 0%,#1E1E30 50%,#12121A 100%)' }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg,#00E5CC 0,#00E5CC 1px,transparent 0,transparent 50%)', backgroundSize: '20px 20px' }} />
          </div>
        )}
        {creator.is_live && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full animate-pulse flex items-center gap-1.5">
            <span className="w-2 h-2 bg-white rounded-full" />
            LIVE
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Avatar + name row */}
        <div className="flex items-end justify-between -mt-14 mb-4">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-[#0A0A0F] overflow-hidden bg-gradient-to-br from-[#00E5CC] to-[#0099AA] flex items-center justify-center">
              {creator.avatar_url
                ? <img src={creator.avatar_url} alt={creator.display_name} className="w-full h-full object-cover" />
                : <span className="text-3xl font-black text-[#0A0A0F]">{creator.display_name?.[0]?.toUpperCase()}</span>
              }
            </div>
            {creator.verified && (
              <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#00E5CC] flex items-center justify-center text-sm">✓</div>
            )}
          </div>
          <div className="flex gap-2 pb-2">
            {creator.is_live && (
              <Link href={`/live/${username}`} className="px-4 py-2 rounded-xl text-sm font-black text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Watch Live
              </Link>
            )}
            <button onClick={() => setShowSubModal(true)}
              className="px-4 py-2 rounded-xl text-sm font-black text-[#0A0A0F] transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#00E5CC,#0099AA)' }}>
              Subscribe
            </button>
          </div>
        </div>

        {/* Name + username */}
        <div className="mb-3">
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            {creator.display_name}
          </h1>
          <p className="text-[#505065] text-sm">@{creator.username}</p>
        </div>

        {/* Bio */}
        {creator.bio && (
          <p className="text-[#A0A0B0] text-sm mb-5 leading-relaxed">{creator.bio}</p>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[['Subscribers', creator.subscriber_count ?? 0], ['Posts', creator.post_count ?? 0], ['Likes', Math.floor((creator.subscriber_count ?? 0) * 14.2)]].map(([label, val]) => (
            <div key={label} className="bg-[#12121A] rounded-xl p-3 text-center border border-[#1E1E30]">
              <div className="text-lg font-black text-white">{Number(val).toLocaleString()}</div>
              <div className="text-xs text-[#505065]">{label}</div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <Link href={`/messages?to=${username}`}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black text-white bg-[#12121A] border border-[#1E1E30] hover:border-[#00E5CC]/40 transition-colors">
            💬 Message
          </Link>
          <button onClick={() => setShowBookModal(true)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black text-white bg-[#12121A] border border-[#1E1E30] hover:border-[#FFD700]/40 transition-colors">
            📅 Book a Call
          </button>
        </div>

        {/* Tip row */}
        <div className="bg-[#12121A] rounded-xl p-4 border border-[#1E1E30] mb-5">
          <p className="text-xs text-[#505065] mb-3 font-medium">Send a tip (SOL / USDC)</p>
          <div className="flex gap-2">
            <div className="flex gap-1.5">
              {[5, 10, 25].map(amt => (
                <button key={amt} onClick={() => setTipAmount(String(amt))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors ${
                    tipAmount === String(amt)
                      ? 'bg-[#FFD700] text-[#0A0A0F]'
                      : 'bg-[#1E1E30] text-[#A0A0B0] hover:bg-[#2A2A40]'
                  }`}>
                  ${amt}
                </button>
              ))}
            </div>
            <input value={tipAmount} onChange={e => setTipAmount(e.target.value)} placeholder="Custom $"
              className="flex-1 min-w-0 bg-[#1E1E30] rounded-lg px-3 py-1.5 text-sm text-white placeholder-[#505065] focus:outline-none" />
            <button onClick={handleTip} disabled={!tipAmount || tipping}
              className="px-4 py-1.5 rounded-lg text-xs font-black text-[#0A0A0F] disabled:opacity-40 transition-all"
              style={{ background: 'linear-gradient(135deg,#FFD700,#FF9900)' }}>
              {tipping ? '...' : '🚀 Tip'}
            </button>
          </div>
        </div>

        {/* Platform affiliate badges */}
        {activePlatforms.length > 0 && (
          <div className="mb-5">
            <p className="text-xs text-[#505065] font-medium mb-3">Also find me on</p>
            <div className="flex flex-wrap gap-2">
              {activePlatforms.map(p => (
                <a key={p.key} href={creator[p.key]} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white border transition-all hover:opacity-80"
                  style={{ borderColor: p.color + '40', background: p.color + '15' }}>
                  <span>{p.emoji}</span>
                  <span style={{ color: p.color }}>{p.label}</span>
                  <span className="text-[#505065] text-[10px]">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Content tabs */}
        <div className="flex gap-1 bg-[#12121A] rounded-xl p-1 mb-5 border border-[#1E1E30]">
          {(['posts', 'ppv', 'live'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-black transition-all capitalize ${
                activeTab === tab
                  ? 'bg-[#00E5CC] text-[#0A0A0F]'
                  : 'text-[#505065] hover:text-white'
              }`}>
              {tab === 'ppv' ? 'PPV' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-3 gap-1.5">
          {MOCK_CONTENT.map(item => (
            <div key={item.id} className="relative aspect-square bg-[#12121A] rounded-lg overflow-hidden border border-[#1E1E30] group cursor-pointer hover:border-[#00E5CC]/40 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1E1E30] to-[#0A0A0F] flex items-center justify-center">
                <span className="text-2xl">{item.type === 'video' ? '🎥' : '🖼️'}</span>
              </div>
              {(item.locked && !isDemo) && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-1">
                  <span className="text-lg">🔒</span>
                  {item.price > 0 && (
                    <span className="text-xs font-black text-[#FFD700]">${item.price}</span>
                  )}
                </div>
              )}
              {item.type === 'video' && (
                <div className="absolute top-1.5 left-1.5 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">VIDEO</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subscribe Modal */}
      {showSubModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-[#12121A] rounded-2xl border border-[#1E1E30] w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#1E1E30]">
              <h2 className="text-lg font-black text-white">Subscribe to @{username}</h2>
              <button onClick={() => setShowSubModal(false)} className="text-[#505065] hover:text-white text-xl">×</button>
            </div>
            <div className="p-5 space-y-3">
              {SUB_TIERS.map(tier => (
                <div key={tier.name} className="rounded-xl border p-4 cursor-pointer hover:opacity-80 transition-all"
                  style={{ borderColor: tier.color + '40', background: tier.color + '08' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-white">{tier.name}</span>
                    <span className="font-black" style={{ color: tier.color }}>${tier.price}<span className="text-xs font-normal text-[#505065]">/mo</span></span>
                  </div>
                  <ul className="space-y-1">
                    {tier.perks.map(perk => (
                      <li key={perk} className="text-xs text-[#A0A0B0] flex items-center gap-1.5">
                        <span style={{ color: tier.color }}>✓</span>{perk}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-3 w-full py-2 rounded-xl text-sm font-black text-[#0A0A0F] transition-all hover:opacity-90"
                    style={{ background: `linear-gradient(135deg,${tier.color},${tier.color}AA)` }}
                    onClick={() => {
                      if (!session && !isDemo) { router.push('/login?redirect=/creator/' + username); return }
                      alert(`Subscribe to ${tier.name} for $${tier.price}/mo — payment via platform partners coming soon!`)
                    }}>
                    Subscribe {tier.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Book a Call Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-[#12121A] rounded-2xl border border-[#1E1E30] w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-[#1E1E30]">
              <h2 className="text-lg font-black text-white">Book a Call</h2>
              <button onClick={() => setShowBookModal(false)} className="text-[#505065] hover:text-white text-xl">×</button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-[#A0A0B0]">Schedule a private 1-on-1 call with @{username}.</p>
              <div>
                <label className="block text-xs font-medium text-[#505065] mb-2">Select Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {[['15 min', '$19.99'], ['30 min', '$34.99'], ['60 min', '$59.99']].map(([dur, price]) => (
                    <div key={dur} className="bg-[#1E1E30] rounded-xl p-3 text-center cursor-pointer hover:border-[#00E5CC]/40 border border-transparent transition-colors">
                      <div className="text-sm font-black text-white">{dur}</div>
                      <div className="text-xs text-[#FFD700]">{price}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  if (!session && !isDemo) { router.push('/login?redirect=/creator/' + username); return }
                  alert('Booking confirmed! (Demo — real booking via Calendly integration coming soon)')
                  setShowBookModal(false)
                }}
                className="w-full py-3 rounded-xl text-sm font-black text-[#0A0A0F]"
                style={{ background: 'linear-gradient(135deg,#FFD700,#FF9900)' }}>
                Confirm Booking 📅
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
