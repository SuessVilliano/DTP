'use client'

import { useState, useEffect, useCallback } from 'react'

const STEPS = [
  {
    title: 'Welcome to DayTraderPorn 🚀',
    body: "The premium platform where trading meets exclusive content. Let's take a 30-second tour.",
    selector: null,
  },
  {
    title: 'Discover Creators',
    body: 'Browse creators who blend finance expertise with exclusive content. Filter by live status, niche, and more.',
    selector: '[data-tour="explore"]',
  },
  {
    title: 'Live Market Data',
    body: 'Real-time charts, price alerts, and market commentary — because great content and great trades go hand-in-hand.',
    selector: '[data-tour="markets"]',
  },
  {
    title: 'Subscribe & Unlock',
    body: 'Pay by credit card via SextPanther, Fanvue, and other partner platforms, or send crypto directly from your wallet.',
    selector: '[data-tour="subscribe"]',
  },
  {
    title: 'Earn XP & Rank Up',
    body: 'Every interaction earns XP. Rise from Paperhand all the way to Whale and unlock exclusive creator perks.',
    selector: '[data-tour="xpbar"]',
  },
]

const PAD = 10

interface OnboardingTourProps {
  onComplete?: () => void
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const current = STEPS[step]

  useEffect(() => {
    if (!current.selector) { setRect(null); return }
    const el = document.querySelector(current.selector) as HTMLElement | null
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // small delay so scroll settles before we measure
      const t = setTimeout(() => setRect(el.getBoundingClientRect()), 300)
      return () => clearTimeout(t)
    } else {
      setRect(null)
    }
  }, [step, current.selector])

  const finish = useCallback(() => {
    if (typeof window !== 'undefined') localStorage.setItem('dtp_tour_done', '1')
    onComplete?.()
  }, [onComplete])

  const next = useCallback(() => {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else finish()
  }, [step, finish])

  // Tooltip position
  const tooltipStyle = (): React.CSSProperties => {
    if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }
    const tH = 220
    const tW = 320
    const vw = window.innerWidth
    const vh = window.innerHeight
    let top = rect.bottom + 16
    let left = rect.left + rect.width / 2 - tW / 2
    if (top + tH > vh) top = rect.top - tH - 16
    if (left < 12) left = 12
    if (left + tW > vw - 12) left = vw - tW - 12
    return { position: 'fixed', top, left, width: tW }
  }

  return (
    <>
      {/* Dimmed overlay */}
      <div
        className="fixed inset-0 z-[9990] pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.75)' }}
      >
        {rect && (
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ mixBlendMode: 'destination-out' } as React.CSSProperties}
          >
            <rect
              x={rect.left - PAD} y={rect.top - PAD}
              width={rect.width + PAD * 2} height={rect.height + PAD * 2}
              rx={12} ry={12} fill="white"
            />
          </svg>
        )}
      </div>

      {/* Click-blocker (allows tooltip clicks through) */}
      <div className="fixed inset-0 z-[9991]" onClick={finish} />

      {/* Tooltip */}
      <div
        className="z-[9999] pointer-events-auto"
        style={tooltipStyle()}
      >
        <div
          className="bg-[#12121A] rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 0 0 1px #00E5CC40, 0 24px 48px rgba(0,0,0,0.9)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Progress bar */}
          <div className="flex gap-1 px-5 pt-4">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{ background: i <= step ? '#00E5CC' : '#1E1E30' }}
              />
            ))}
          </div>

          <div className="p-5">
            <p className="text-xs font-black text-[#00E5CC] mb-1">{step + 1} of {STEPS.length}</p>
            <h3 className="text-base font-black text-white mb-2">{current.title}</h3>
            <p className="text-sm text-[#A0A0B0] leading-relaxed">{current.body}</p>
          </div>

          <div className="flex items-center justify-between px-5 pb-5">
            <button
              onClick={finish}
              className="text-xs text-[#505065] hover:text-white transition-colors"
            >
              Skip
            </button>
            <button
              onClick={next}
              className="px-5 py-2 rounded-xl text-sm font-black text-[#0A0A0F] transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#00E5CC,#0099AA)' }}
            >
              {step < STEPS.length - 1 ? 'Next →' : 'Get Started 🚀'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
