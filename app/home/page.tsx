'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { TickerTape } from '@/components/TickerTape'
import { CandlestickChart } from '@/components/CandlestickChart'

function HeroBG() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number
    let w = canvas.offsetWidth, h = canvas.offsetHeight
    canvas.width = w; canvas.height = h
    const particles = Array.from({ length: 60 }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.4 + 0.1 }))
    const candleData = Array.from({ length: 24 }, (_, i) => { const base = 0.35 + Math.sin(i * 0.7) * 0.15 + Math.random() * 0.1; const open = base + (Math.random() - 0.5) * 0.08; const close = base + (Math.random() - 0.5) * 0.08; return { open, close, high: Math.max(open, close) + Math.random() * 0.06, low: Math.min(open, close) - Math.random() * 0.06 } })
    function draw() {
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(0,229,204,0.03)'; ctx.lineWidth = 1
      for (let x = 0; x < w; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
      for (let y = 0; y < h; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }
      const cw = w / 24, chartH = h * 0.55, chartY = h * 0.22
      candleData.forEach((c, i) => { const x = i * cw + cw / 2, bull = c.close >= c.open; const openY = chartY + (1 - c.open) * chartH, closeY = chartY + (1 - c.close) * chartH; ctx.strokeStyle = bull ? 'rgba(0,229,204,0.12)' : 'rgba(255,51,102,0.10)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, chartY + (1 - c.high) * chartH); ctx.lineTo(x, chartY + (1 - c.low) * chartH); ctx.stroke(); ctx.fillStyle = bull ? 'rgba(0,229,204,0.08)' : 'rgba(255,51,102,0.06)'; ctx.fillRect(x - cw * 0.3, Math.min(openY, closeY), cw * 0.6, Math.abs(closeY - openY) || 1) })
      particles.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(0,229,204,${p.alpha})`; ctx.fill() })
      for (let i = 0; i < particles.length; i++) { for (let j = i + 1; j < particles.length; j++) { const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y; const d = Math.sqrt(dx * dx + dy * dy); if (d < 100) { ctx.beginPath(); ctx.strokeStyle = `rgba(0,229,204,${0.04 * (1 - d / 100)})`; ctx.lineWidth = 0.5; ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke() } } }
      raf = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => { w = canvas.offsetWidth; h = canvas.offsetHeight; canvas.width = w; canvas.height = h }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

function Counter({ end, prefix = '', suffix = '', duration = 2000 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; obs.disconnect(); const start = Date.now(); const tick = () => { const p = Math.min((Date.now() - start) / duration, 1); setVal(Math.round((1 - Math.pow(1 - p, 3)) * end)); if (p < 1) requestAnimationFrame(tick) }; requestAnimationFrame(tick) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
}

function ExitModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)' }}>
      <div className="relative max-w-md w-full rounded-2xl border border-[#00E5CC]/30 p-8 text-center" style={{ background: '#12121A', boxShadow: '0 0 60px rgba(0,229,204,0.15)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#505065] hover:text-white text-xl leading-none">✕</button>
        <div className="text-5xl mb-4">📈</div>
        <h2 className="text-2xl font-black text-white mb-3">Hold the phone.</h2>
        <p className="text-[#A0A0B0] mb-6 leading-relaxed">Before you exit — get <span className="text-[#FFD700] font-bold">7 days of Bull access</span> for just <span className="text-[#00E5CC] font-bold">0.01 SOL</span>. ~$1–2. No commitment.</p>
        <Link href="/join?tier=bull&offer=7day" onClick={onClose} className="btn btn-gold w-full block text-center py-3 rounded-xl font-black text-[#0A0A0F] text-base">Claim 7-Day Bull Access →</Link>
        <button onClick={onClose} className="mt-3 text-sm text-[#505065] hover:text-[#A0A0B0]">No thanks, I prefer full price</button>
      </div>
    </div>
  )
}

function FirstVisitModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(3px)' }}>
      <div className="max-w-sm w-full rounded-2xl border border-[#1E1E30] p-6" style={{ background: '#12121A' }}>
        {!submitted ? (<>
          <div className="flex justify-between items-start mb-4"><div><div className="text-xs text-[#00E5CC] font-black uppercase tracking-widest mb-1">You're on the floor</div><h3 className="text-xl font-black text-white">Join the Inner Circle.</h3></div><button onClick={onClose} className="text-[#505065] hover:text-white ml-4 text-lg">✕</button></div>
          <p className="text-sm text-[#A0A0B0] mb-4">Get early access. Know when elite creators go live. Crypto payments only.</p>
          <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} className="input mb-3" />
          <button onClick={() => setSubmitted(true)} className="btn btn-cyan w-full py-3 rounded-xl font-black text-[#0A0A0F]">Get Early Access</button>
        </>) : (
          <div className="text-center py-4">
            <div className="text-3xl mb-3 text-[#00E5CC]">✓</div>
            <p className="font-black text-white">You're on the list.</p>
            <p className="text-sm text-[#A0A0B0] mt-1">We'll reach out when your access is ready.</p>
            <button onClick={onClose} className="mt-4 text-sm text-[#505065] hover:text-white">Close</button>
          </div>
        )}
      </div>
    </div>
  )
}

const TEASERS = [
  { id: 1, creator: 'MarketMaven_X', category: 'Bull Run', views: '12.4K', tag: 'Premium', color: '#00E5CC' },
  { id: 2, creator: 'BearTrapQueen', category: 'After Hours', views: '8.9K', tag: 'PPV', color: '#FF3366' },
  { id: 3, creator: 'SolanaSelene', category: 'HODL', views: '21.2K', tag: 'Bull+', color: '#00E5CC' },
  { id: 4, creator: 'ChartWitch', category: 'Short Squeeze', views: '15.7K', tag: 'Premium', color: '#FFD700' },
  { id: 5, creator: 'DegenDiva', category: 'Degen Mode', views: '9.3K', tag: 'Free Preview', color: '#00FF88' },
  { id: 6, creator: 'NQNadia', category: 'Bear Trap', views: '18.1K', tag: 'Whale', color: '#FFD700' },
]

const CREATORS = [
  { name: 'MarketMaven_X', subs: '4,821', earned: '$48,200', badge: 'Top Earner' },
  { name: 'SolanaSelene', subs: '3,140', earned: '$31,400', badge: 'Whale Favorite' },
  { name: 'ChartWitch', subs: '2,905', earned: '$29,050', badge: 'Rising Star' },
]

export default function HomePage() {
  const [showExit, setShowExit] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const floorRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (!sessionStorage.getItem('dtp_welcomed')) { const t = setTimeout(() => { setShowWelcome(true); sessionStorage.setItem('dtp_welcomed', '1') }, 8000); return () => clearTimeout(t) } }, [])
  useEffect(() => { const onLeave = (e: MouseEvent) => { if (e.clientY < 10 && !sessionStorage.getItem('dtp_exit')) { setShowExit(true); sessionStorage.setItem('dtp_exit', '1') } }; document.addEventListener('mouseleave', onLeave); return () => document.removeEventListener('mouseleave', onLeave) }, [])
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 80); window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn) }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0A0F]/95 border-b border-[#1E1E30] backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2"><span className="text-[#00E5CC] font-black text-xl">DTP</span><span className="hidden sm:block text-xs text-[#505065] uppercase tracking-widest font-mono">Day Trader Porn</span></Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#A0A0B0]"><Link href="/markets" className="hover:text-white transition-colors">Trading Room</Link><Link href="/become-a-creator" className="hover:text-[#00E5CC] transition-colors">Creators</Link><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></nav>
          <Link href="/join" className="btn btn-cyan text-sm py-2 px-5 rounded-lg font-black text-[#0A0A0F]">Join Now</Link>
        </div>
      </header>
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        <HeroBG />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F]/10 via-transparent to-[#0A0A0F] pointer-events-none" />
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00E5CC]/20 bg-[#00E5CC]/5 text-xs text-[#00E5CC] font-black uppercase tracking-widest mb-8"><span className="w-1.5 h-1.5 rounded-full bg-[#00E5CC] animate-pulse" />Invite-Only · Crypto Native · After Hours</div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight mb-6 max-w-5xl">Where the Market<br /><span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00E5CC 0%, #0099AA 100%)' }}>Never Closes.</span></h1>
          <p className="text-lg sm:text-xl text-[#A0A0B0] max-w-2xl mx-auto mb-10 leading-relaxed">Elite adult content for traders who know the difference between a <span className="text-[#00FF88] font-bold">bull run</span> and a <span className="text-[#FF3366] font-bold">bull trap.</span><br className="hidden sm:block" /> Crypto-only. No banks. No censorship.</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none sm:w-auto justify-center">
            <Link href="/join" className="btn btn-cyan text-base py-4 px-10 rounded-xl font-black text-[#0A0A0F]" style={{ boxShadow: '0 0 40px rgba(0,229,204,0.35)' }}>Join the Inner Circle →</Link>
            <button onClick={() => floorRef.current?.scrollIntoView({ behavior: 'smooth' })} className="btn text-base py-4 px-8 rounded-xl font-black border border-[#1E1E30] text-[#A0A0B0] hover:border-[#00E5CC]/40 hover:text-white bg-transparent transition-all">Preview the Floor ↓</button>
          </div>
          <div className="flex flex-wrap justify-center gap-10 sm:gap-16 mt-16 text-center">
            {[{ label: 'Members', end: 2847 }, { label: 'Elite Creators', end: 47 }, { label: 'In Creator Earnings', end: 1200000, prefix: '$' }].map(s => (<div key={s.label}><div className="text-3xl sm:text-4xl font-black text-white tabular-nums"><Counter end={s.end} prefix={s.prefix} /></div><div className="text-xs text-[#505065] uppercase tracking-widest mt-1 font-mono">{s.label}</div></div>))}
          </div>
        </div>
        <div className="relative z-10 w-full"><TickerTape /></div>
      </section>
      <section className="border-y border-[#1E1E30] bg-[#12121A]/60 py-5">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">{['₿ Bitcoin', 'Ξ Ethereum', '◎ Solana', '⬡ USDC', '+ 100 More'].map(c => (<span key={c} className="px-3 py-1 rounded-full border border-[#1E1E30] text-[#A0A0B0] text-xs font-mono bg-[#0A0A0F]">{c}</span>))}</div>
          <p className="text-sm text-[#A0A0B0] font-medium">🔒 No banks. No censorship. No payment processor risk.</p>
        </div>
      </section>
      <section ref={floorRef} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12"><div className="text-xs text-[#00E5CC] font-black uppercase tracking-widest mb-3 font-mono">The Floor</div><h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Members Only Content</h2><p className="text-[#A0A0B0] text-lg max-w-xl mx-auto">Elite creators. Trading-themed. Crypto payouts. You can see it exists. You just can't access it yet.</p></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-10">
            {TEASERS.map(item => (
              <div key={item.id} className="group relative rounded-xl overflow-hidden border border-[#1E1E30] hover:border-[#00E5CC]/30 transition-all duration-300 cursor-pointer" style={{ aspectRatio: '9/12', background: '#12121A' }}>
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${item.color}08, #0A0A1A)` }}><div className="w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 12px)' }} /></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 transition-all duration-300" style={{ backdropFilter: 'blur(10px)', background: 'rgba(10,10,15,0.65)' }}>
                  <div className="text-3xl sm:text-4xl mb-3 group-hover:opacity-50 transition-opacity">🔒</div>
                  <Link href="/join" className="opacity-0 group-hover:opacity-100 transition-all duration-200 btn btn-cyan text-xs py-2 px-4 rounded-lg font-black text-[#0A0A0F]">Unlock Access</Link>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 z-20 bg-gradient-to-t from-black/85 to-transparent"><div className="flex items-end justify-between"><div><div className="text-xs font-bold text-white leading-tight">{item.creator}</div><div className="text-xs text-[#505065]">{item.views} views</div></div><span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}30` }}>{item.category}</span></div></div>
                <div className="absolute top-3 right-3 z-20"><span className={`text-xs px-2 py-0.5 rounded font-bold ${item.tag === 'Free Preview' ? 'bg-[#00FF88]/20 text-[#00FF88]' : item.tag === 'Whale' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-[#1E1E30] text-[#505065]'}`}>{item.tag}</span></div>
              </div>
            ))}
          </div>
          <div className="text-center"><Link href="/join" className="btn btn-outline inline-flex py-3 px-8 rounded-xl font-black border-[#00E5CC]/30 text-[#00E5CC] hover:bg-[#00E5CC]/10 transition-all">Unlock The Floor →</Link></div>
        </div>
      </section>
      <section className="py-20 px-4 border-t border-[#1E1E30]" style={{ background: '#12121A' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12"><div className="text-xs text-[#FFD700] font-black uppercase tracking-widest mb-3 font-mono">Elite Creators</div><h2 className="text-4xl font-black text-white mb-4">Hand-Picked. Verified. Exclusive.</h2><p className="text-[#A0A0B0] max-w-xl mx-auto">We don't accept everyone. DTP is invite-only. We curate the best performers in the niche.</p></div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {CREATORS.map(c => (<div key={c.name} className="rounded-xl border border-[#1E1E30] p-6 hover:border-[#FFD700]/30 transition-all group" style={{ background: '#0A0A0F' }}><div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00E5CC]/20 to-[#FFD700]/20 flex items-center justify-center mb-4 border border-[#1E1E30] text-xl font-black text-[#00E5CC]">{c.name[0]}</div><div className="flex items-center gap-2 mb-1"><span className="font-black text-white">{c.name}</span><span className="text-xs px-1.5 py-0.5 rounded bg-[#00E5CC]/15 text-[#00E5CC] font-black">✓</span></div><div className="text-xs text-[#505065] mb-4 font-mono">{c.badge}</div><div className="flex justify-between text-sm mb-5"><div><span className="text-white font-bold">{c.subs}</span> <span className="text-[#505065]">fans</span></div><div><span className="text-[#FFD700] font-bold">{c.earned}</span> <span className="text-[#505065]">tips</span></div></div><Link href={`/creator/${c.name}`} className="btn btn-ghost w-full text-center py-2 text-sm rounded-lg border-[#1E1E30] group-hover:border-[#FFD700]/20 transition-all">View Profile</Link></div>))}
          </div>
          <div className="text-center p-6 rounded-xl border border-dashed border-[#1E1E30]"><p className="text-[#A0A0B0] mb-3">Are you a creator? <span className="text-white font-bold">We're curating the elite.</span></p><Link href="/become-a-creator" className="text-[#00E5CC] font-black hover:underline">Apply for your invite →</Link></div>
        </div>
      </section>
      <section className="py-20 px-4 bg-[#0A0A0F]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs text-[#00E5CC] font-black uppercase tracking-widest mb-4 font-mono">The Trading Room</div>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">Watch the charts<br /><span className="text-[#00E5CC]">and the action.</span><br />Simultaneously.</h2>
              <p className="text-[#A0A0B0] text-lg mb-8 leading-relaxed">The only platform where BTC candlesticks and premium content share the same screen. Built for traders who never fully disconnect.</p>
              <Link href="/join" className="btn btn-cyan py-3 px-6 rounded-xl font-black text-[#0A0A0F]">Access the Trading Room →</Link>
              <p className="text-xs text-[#505065] mt-3">Charts for entertainment only. Not financial advice.</p>
            </div>
            <div className="rounded-xl overflow-hidden border border-[#1E1E30]"><div className="bg-[#12121A] px-4 py-2.5 border-b border-[#1E1E30] flex items-center justify-between"><span className="text-xs font-mono text-[#00E5CC] font-bold">BTC/USD · Live</span><span className="text-xs text-[#505065]">Entertainment only</span></div><div className="h-[280px]"><CandlestickChart symbol="btcusdt" /></div></div>
          </div>
        </div>
      </section>
      <section className="py-20 px-4 border-t border-[#1E1E30]" style={{ background: '#12121A' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12"><div className="text-xs text-[#00E5CC] font-black uppercase tracking-widest mb-3 font-mono">The Inner Circle</div><h2 className="text-4xl font-black text-white mb-4">Choose Your Position</h2><p className="text-[#A0A0B0]">No credit cards. No banks. Crypto only. Hold DTP tokens or pay in SOL, USDC, and 100+ coins.</p></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[{ label: 'Free Trader', color: '#505065', price: '$0', sub: 'Forever free', cta: 'Get Started', href: '/join', features: ['Browse public content','Live ticker tape','Basic chart access','Ad-supported'] }, { label: 'Bull', color: '#00E5CC', price: '$9.99', sub: 'or 1,000 DTP tokens/mo', cta: 'Become a Bull', href: '/join?tier=bull', popular: true, features: ['All free features','Bull-tier content','HD streaming','No ads','Creator DMs'] }, { label: 'Whale', color: '#FFD700', price: '$49.99', sub: 'or 10,000 DTP tokens/mo', cta: 'Go Whale', href: '/join?tier=whale', features: ['Everything in Bull','Exclusive Whale content','1-on-1 sessions','Live Trading Room','Priority support','DTP token rewards'] }].map(t => (<div key={t.label} className={`rounded-xl border p-6 relative bg-[#0A0A0F] ${(t as {popular?: boolean}).popular ? `border-[${t.color}]/40` : 'border-[#1E1E30]'}`} style={(t as {popular?: boolean}).popular ? { borderColor: t.color + '66', boxShadow: `0 0 40px ${t.color}18` } : {}}>{(t as {popular?: boolean}).popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-black text-[#0A0A0F]" style={{ background: t.color }}>MOST POPULAR</div>}<div className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: t.color }}>{t.label}</div><div className="text-4xl font-black text-white mb-1">{t.price}<span className="text-base font-normal text-[#505065]">{t.price !== '$0' ? '/mo' : ''}</span></div><div className="text-xs text-[#505065] mb-6 font-mono">{t.sub}</div><ul className="space-y-2.5 mb-8">{t.features.map(f => (<li key={f} className="flex items-center gap-2 text-sm text-[#A0A0B0]"><span style={{ color: t.color }}>{(t as {popular?: boolean}).popular ? '✓' : t.label === 'Whale' ? '★' : '○'}</span>{f}</li>))}</ul><Link href={t.href} className={`w-full block text-center py-3 rounded-xl font-black text-sm transition-all ${(t as {popular?: boolean}).popular ? 'btn btn-cyan text-[#0A0A0F]' : t.label === 'Whale' ? 'btn btn-gold text-[#0A0A0F]' : 'btn btn-ghost border-[#1E1E30]'}`}>{t.cta}</Link></div>))}
          </div>
        </div>
      </section>
      <section className="py-24 px-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D0D1A 0%, #111120 100%)' }}>
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #00E5CC 0px, #00E5CC 1px, transparent 1px, transparent 28px)' }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="text-xs text-[#00E5CC] font-black uppercase tracking-widest mb-4 font-mono">Are You an Elite Creator?</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">We're curating<br /><span className="text-[#00E5CC]">the elite.</span></h2>
          <p className="text-[#A0A0B0] text-lg mb-6 max-w-2xl mx-auto leading-relaxed">DTP is invite-only. We hand-pick creators who can command the room. No payment processors. <span className="text-white font-bold">70% revenue on PPV. 90% on tips.</span> Crypto-only payouts. Trader demographic = highest-earning niche online.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#505065] mb-10"><span>✓ No Stripe chargebacks</span><span>✓ No OnlyFans 20% cut</span><span>✓ High-income trader fans</span><span>✓ Instant crypto payouts</span></div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/become-a-creator" className="btn btn-cyan py-4 px-10 rounded-xl font-black text-[#0A0A0F] text-base" style={{ boxShadow: '0 0 30px rgba(0,229,204,0.25)' }}>Apply for Creator Access →</Link>
            <Link href="/login" className="btn py-4 px-8 rounded-xl font-black text-base bg-transparent border border-[#1E1E30] text-[#A0A0B0] hover:border-[#00E5CC]/30 hover:text-white transition-all">Already invited? Sign in →</Link>
          </div>
        </div>
      </section>
      <footer className="border-t border-[#1E1E30] py-14 px-4 bg-[#0A0A0F]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            <div><div className="text-[#00E5CC] font-black text-2xl mb-1">DTP</div><div className="text-xs text-[#505065] uppercase tracking-widest font-mono mb-3">Day Trader Porn</div><p className="text-sm text-[#505065] max-w-xs leading-relaxed">Where the market never closes. Crypto-native. Invite-only. After hours.</p></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">{[{ title: 'Platform', links: [['Home','/home'],['Pricing','/join'],['Trading Room','/markets'],['DTP Token','/token']] }, { title: 'Creators', links: [['Become a Creator','/become-a-creator'],['Apply','/creator/apply'],['Sign In','/login'],['Dashboard','/dashboard']] }, { title: 'Legal', links: [['2257','/2257'],['Terms','/terms'],['Privacy','/privacy'],['DMCA','/dmca']] }].map(col => (<div key={col.title}><div className="text-xs text-[#505065] uppercase tracking-widest mb-3 font-black">{col.title}</div><div className="space-y-2">{col.links.map(([l,h]) => <div key={l}><Link href={h} className="text-[#A0A0B0] hover:text-white transition-colors">{l}</Link></div>)}</div></div>))}</div>
          </div>
          <div className="border-t border-[#1E1E30] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#505065]"><div className="flex flex-wrap gap-x-4 gap-y-1"><span>🔒 All transactions encrypted</span><span>·</span><span>Crypto payments only</span><span>·</span><span>18+ only</span></div><div className="flex items-center gap-5"><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#A0A0B0] transition-colors">𝕏 Twitter</a><a href="https://t.me" target="_blank" rel="noopener noreferrer" className="hover:text-[#A0A0B0] transition-colors">Telegram</a><a href="https://reddit.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#A0A0B0] transition-colors">Reddit</a></div></div>
        </div>
      </footer>
      {showExit && <ExitModal onClose={() => setShowExit(false)} />}
      {showWelcome && <FirstVisitModal onClose={() => setShowWelcome(false)} />}
    </div>
  )
}
