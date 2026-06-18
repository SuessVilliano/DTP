'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { CandlestickChart } from './CandlestickChart'
import { PaywallModal } from './PaywallModal'

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  videoId: string
  isPPV?: boolean
  ppvPrice?: number
  ppvPriceCrypto?: string
  isLocked?: boolean
  showChartOverlay?: boolean
  autoPlay?: boolean
  onTip?: () => void
}

interface PlayerState {
  playing: boolean; muted: boolean; volume: number; currentTime: number
  duration: number; buffered: number; fullscreen: boolean; showControls: boolean
}

export function VideoPlayer({ src, poster, title, videoId, isPPV = false, ppvPrice, ppvPriceCrypto, isLocked = false, showChartOverlay: initialShowChart = false, autoPlay = false, onTip }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const [state, setState] = useState<PlayerState>({ playing: false, muted: false, volume: 1, currentTime: 0, duration: 0, buffered: 0, fullscreen: false, showControls: true })
  const [showChart, setShowChart] = useState(initialShowChart)
  const [showPaywall, setShowPaywall] = useState(false)
  const [hlsLoaded, setHlsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLocked) return
    import('hls.js').then(({ default: Hls }) => {
      const video = videoRef.current
      if (!video || !src) return
      if (Hls.isSupported()) {
        const hls = new Hls({ maxBufferLength: 30, maxMaxBufferLength: 60, enableWorker: true })
        hls.loadSource(src)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => { setHlsLoaded(true); if (autoPlay) video.play().catch(() => {}) })
        hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal) setError('Failed to load video. Please try again.') })
        return () => hls.destroy()
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src; setHlsLoaded(true)
      } else { setError('Your browser does not support HLS video playback.') }
    })
  }, [src, isLocked, autoPlay])

  const hideControlsAfterDelay = useCallback(() => {
    clearTimeout(controlsTimerRef.current)
    setState((s) => ({ ...s, showControls: true }))
    controlsTimerRef.current = setTimeout(() => { if (state.playing) setState((s) => ({ ...s, showControls: false })) }, 3000)
  }, [state.playing])

  function togglePlay() {
    const v = videoRef.current; if (!v) return
    if (v.paused) { v.play(); setState((s) => ({ ...s, playing: true })) }
    else { v.pause(); setState((s) => ({ ...s, playing: false })) }
  }
  function toggleMute() { const v = videoRef.current; if (!v) return; v.muted = !v.muted; setState((s) => ({ ...s, muted: v.muted })) }
  function handleVolumeChange(val: number) { const v = videoRef.current; if (!v) return; v.volume = val; v.muted = val === 0; setState((s) => ({ ...s, volume: val, muted: val === 0 })) }
  function handleSeek(val: number) { const v = videoRef.current; if (!v) return; v.currentTime = val; setState((s) => ({ ...s, currentTime: val })) }
  function toggleFullscreen() { const el = containerRef.current; if (!el) return; if (!document.fullscreenElement) { el.requestFullscreen(); setState((s) => ({ ...s, fullscreen: true })) } else { document.exitFullscreen(); setState((s) => ({ ...s, fullscreen: false })) } }
  function formatTime(sec: number): string { const m = Math.floor(sec / 60); const s = Math.floor(sec % 60); return `${m}:${s.toString().padStart(2, '0')}` }

  return (
    <>
      <div ref={containerRef} className="relative bg-black rounded-lg overflow-hidden group" style={{ aspectRatio: '16/9' }} onMouseMove={hideControlsAfterDelay} onMouseLeave={() => state.playing && setState((s) => ({ ...s, showControls: false }))}>
        <video ref={videoRef} poster={poster} className={`w-full h-full object-contain ${isLocked ? 'content-blur' : ''}`} playsInline
          onTimeUpdate={(e) => { const v = e.currentTarget; const buffered = v.buffered.length > 0 ? v.buffered.end(v.buffered.length - 1) : 0; setState((s) => ({ ...s, currentTime: v.currentTime, duration: v.duration || 0, buffered })) }}
          onPlay={() => setState((s) => ({ ...s, playing: true }))} onPause={() => setState((s) => ({ ...s, playing: false }))} onEnded={() => setState((s) => ({ ...s, playing: false }))} />
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-20">
            <div className="text-center px-6">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-white mb-2">{title || 'Premium Content'}</h3>
              {isPPV ? (<><p className="text-[#A0A0B0] text-sm mb-4">Pay-per-view • {ppvPriceCrypto || `$${ppvPrice}`}</p><button onClick={() => setShowPaywall(true)} className="btn btn-cyan text-base px-8 py-3">🔓 Unlock with Crypto</button></>) : (<><p className="text-[#A0A0B0] text-sm mb-4">Bull or Whale membership required</p><a href="/join" className="btn btn-gold text-base px-8 py-3">⚡ Upgrade Access</a></>)}
            </div>
          </div>
        )}
        {error && !isLocked && <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20"><p className="text-[#FF3366] text-sm font-mono">{error}</p></div>}
        {!hlsLoaded && !isLocked && !error && <div className="absolute inset-0 flex items-center justify-center"><div className="w-10 h-10 border-2 border-[#00E5CC] border-t-transparent rounded-full animate-spin" /></div>}
        {showChart && !isLocked && <div className="absolute top-2 right-2 w-48 h-28 rounded-lg overflow-hidden bg-black/80 border border-[#00E5CC33] z-10"><CandlestickChart symbol="BTCUSDT" height={112} miniMode /></div>}
        {!isLocked && hlsLoaded && (
          <div className={`absolute inset-0 flex flex-col justify-end z-10 transition-opacity duration-300 ${state.showControls ? 'opacity-100' : 'opacity-0'}`}>
            {title && <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-3"><p className="text-white text-sm font-semibold truncate">{title}</p></div>}
            <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 space-y-2">
              <div className="relative h-1 bg-white/20 rounded cursor-pointer" onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); handleSeek((e.clientX - rect.left) / rect.width * state.duration) }}>
                <div className="absolute inset-y-0 left-0 bg-white/20 rounded" style={{ width: `${state.duration ? (state.buffered / state.duration) * 100 : 0}%` }} />
                <div className="absolute inset-y-0 left-0 bg-[#00E5CC] rounded" style={{ width: `${state.duration ? (state.currentTime / state.duration) * 100 : 0}%` }} />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={togglePlay} className="text-white hover:text-[#00E5CC] transition-colors p-1">{state.playing ? <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> : <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}</button>
                <button onClick={toggleMute} className="text-white hover:text-[#00E5CC] transition-colors p-1"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg></button>
                <input type="range" min="0" max="1" step="0.05" value={state.muted ? 0 : state.volume} onChange={(e) => handleVolumeChange(parseFloat(e.target.value))} className="w-16 h-1 accent-[#00E5CC] cursor-pointer" />
                <span className="text-white text-xs font-mono ml-1">{formatTime(state.currentTime)} / {formatTime(state.duration)}</span>
                <div className="flex-1" />
                <button onClick={() => setShowChart((v) => !v)} className={`p-1 transition-colors text-xs font-mono rounded ${showChart ? 'text-[#00E5CC]' : 'text-white/50 hover:text-white'}`} title="Toggle chart">📈</button>
                {onTip && <button onClick={onTip} className="p-1 text-[#FFD700] hover:text-[#FFE44D] transition-colors text-xs" title="Send tip">💰</button>}
                <button onClick={toggleFullscreen} className="text-white hover:text-[#00E5CC] transition-colors p-1"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg></button>
              </div>
            </div>
          </div>
        )}
        {!isLocked && hlsLoaded && !state.playing && (
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer z-5" onClick={togglePlay}>
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-[#00E5CC33] hover:border-[#00E5CC] transition-colors">
              <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        )}
      </div>
      {showPaywall && <PaywallModal videoId={videoId} title={title} price={ppvPrice} priceCrypto={ppvPriceCrypto} onClose={() => setShowPaywall(false)} onSuccess={() => setShowPaywall(false)} />}
    </>
  )
}
