'use client'

import { useState } from 'react'

interface Props {
  creatorUsername: string
  sextpantherUrl: string
  isLive?: boolean
  compact?: boolean
}

export function SextPantherCTA({ creatorUsername, sextpantherUrl, isLive = false, compact = false }: Props) {
  const [tracking, setTracking] = useState(false)
  const affiliateId = process.env.NEXT_PUBLIC_SEXTPANTHER_AFFILIATE_ID || ''

  const buildUrl = (type: 'call' | 'text') => {
    const base = sextpantherUrl.replace(/\/$/, '')
    const params = new URLSearchParams({ ref: `dtp_${affiliateId}`, utm_source: 'dtp', utm_medium: 'creator_profile', utm_campaign: creatorUsername, type })
    return `${base}?${params}`
  }

  const handleClick = async (type: 'call' | 'text') => {
    if (tracking) return
    setTracking(true)
    try {
      await fetch('/api/creators/sp-click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ creatorUsername, type }) })
    } catch { /* non-blocking */ } finally { setTracking(false) }
  }

  if (compact) return (
    <div className="flex gap-2">
      <a href={buildUrl('call')} target="_blank" rel="noopener noreferrer sponsored" onClick={() => handleClick('call')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-[#0A0A0F]" style={{ background: '#00E5CC', boxShadow: isLive ? '0 0 10px rgba(0,229,204,0.4)' : undefined }}>
        📞 {isLive ? 'Live Call' : 'Call Now'}
      </a>
      <a href={buildUrl('text')} target="_blank" rel="noopener noreferrer sponsored" onClick={() => handleClick('text')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-[#00E5CC]/40 text-[#00E5CC] hover:bg-[#00E5CC]/10 transition-all">
        💬 Text
      </a>
    </div>
  )

  return (
    <div className="rounded-xl border border-[#1E1E30] p-4" style={{ background: '#12121A' }}>
      <div className="flex items-center gap-2 mb-3">
        {isLive && <span className="w-2 h-2 rounded-full bg-[#FF3366] animate-pulse" />}
        <span className="text-sm font-bold text-white">{isLive ? '🔴 Available Now on SextPanther' : 'Connect via SextPanther'}</span>
      </div>
      <p className="text-xs text-[#505065] mb-4">{isLive ? `${creatorUsername} is available for calls and texts right now.` : `Request a call or text message session with ${creatorUsername}.`}</p>
      <div className="flex gap-3">
        <a href={buildUrl('call')} target="_blank" rel="noopener noreferrer sponsored" onClick={() => handleClick('call')} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-[#0A0A0F] transition-all" style={{ background: '#00E5CC', boxShadow: isLive ? '0 0 15px rgba(0,229,204,0.3)' : undefined }}>
          📞 {isLive ? 'Call Now' : 'Request Call'}
        </a>
        <a href={buildUrl('text')} target="_blank" rel="noopener noreferrer sponsored" onClick={() => handleClick('text')} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold border border-[#00E5CC]/30 text-[#00E5CC] hover:bg-[#00E5CC]/10 transition-all">
          💬 Send Message
        </a>
      </div>
      <p className="text-xs text-[#505065] mt-3 text-center">Via SextPanther · DTP earns affiliate commission</p>
    </div>
  )
}
