'use client'

import { useEffect, useRef } from 'react'
import { useTokenTier } from './TokenGate'

type AdFormat = '300x250' | '728x90' | 'native'

interface ExoClickAdProps {
  format: AdFormat
  className?: string
}

const FORMAT_ZONES: Record<AdFormat, string> = {
  '300x250': process.env.NEXT_PUBLIC_EXOCLICK_ZONE_300x250 || 'PLACEHOLDER',
  '728x90': process.env.NEXT_PUBLIC_EXOCLICK_ZONE_728x90 || 'PLACEHOLDER',
  'native': process.env.NEXT_PUBLIC_EXOCLICK_ZONE_NATIVE || 'PLACEHOLDER',
}

const FORMAT_DIMENSIONS: Record<AdFormat, { w: number; h: number }> = {
  '300x250': { w: 300, h: 250 },
  '728x90': { w: 728, h: 90 },
  'native': { w: 0, h: 0 },
}

export function ExoClickAd({ format, className = '' }: ExoClickAdProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { tier } = useTokenTier()

  if (tier === 'bull' || tier === 'whale') return null

  useEffect(() => {
    if (!containerRef.current) return
    const publisherId = process.env.NEXT_PUBLIC_EXOCLICK_PUBLISHER_ID
    const zoneId = FORMAT_ZONES[format]
    if (!publisherId || publisherId === 'PLACEHOLDER' || zoneId === 'PLACEHOLDER') return
    const scriptId = `exo-${format}-${zoneId}`
    if (document.getElementById(scriptId)) return
    const script = document.createElement('script')
    script.id = scriptId
    script.async = true
    script.src = `https://a.magsrv.com/ad-provider.js`
    script.setAttribute('data-zone', zoneId)
    script.setAttribute('data-publisher', publisherId)
    containerRef.current.appendChild(script)
    return () => { script.remove() }
  }, [format])

  const dims = FORMAT_DIMENSIONS[format]
  const isPlaceholder = !process.env.NEXT_PUBLIC_EXOCLICK_PUBLISHER_ID || process.env.NEXT_PUBLIC_EXOCLICK_PUBLISHER_ID === 'PLACEHOLDER'

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`} style={dims.w ? { width: dims.w, height: dims.h } : {}}>
      {isPlaceholder && (
        <div className="flex items-center justify-center bg-[#1A1A26] border border-dashed border-[#1E1E30] rounded text-[#505065] text-xs font-mono" style={dims.w ? { width: dims.w, height: dims.h } : { width: '100%', height: 80 }}>
          <span>Ad Zone: {format} (configure ExoClick publisher ID in .env)</span>
        </div>
      )}
    </div>
  )
}
