'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'

const PLATFORMS = [
  { key: 'sextpanther_url', label: 'SextPanther', desc: 'Phone/chat platform — earn per-minute for calls', url: 'https://www.sextpanther.com', emoji: '📞', color: '#E8A045' },
  { key: 'fanvue_url', label: 'Fanvue', desc: 'Subscription platform, accepts credit cards', url: 'https://www.fanvue.com', emoji: '💳', color: '#6C5CE7' },
  { key: 'loyalfans_url', label: 'LoyalFans', desc: 'Subscription + PPV platform, accepts CC', url: 'https://www.loyalfans.com', emoji: '💖', color: '#E84393' },
  { key: 'manyvids_url', label: 'ManyVids', desc: 'Sell videos and clips, accepts CC', url: 'https://www.manyvids.com', emoji: '🎬', color: '#FF4D8A' },
  { key: 'niteflirt_url', label: 'NiteFlirt', desc: 'Pay-per-call phone/chat platform', url: 'https://www.niteflirt.com', emoji: '☎️', color: '#FF8C00' },
]

export default function BecomeACreatorPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    username: '', display_name: '', bio: '', wallet_address: '',
    sextpanther_url: '', fanvue_url: '', loyalfans_url: '', manyvids_url: '', niteflirt_url: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0A0F]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-black text-white mb-3">Application Submitted!</h1>
          <p className="text-[#A0A0B0] mb-8">We review applications within 48 hours. We'll email you when you're approved.</p>
          <Link href="/home" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-2">Become a Creator</h1>
          <p className="text-[#505065]">Set up your profile and connect your monetization platforms.</p>
        </div>
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-colors ${s <= step ? 'bg-[#00E5CC] text-[#0A0A0F]' : 'bg-[#1E1E30] text-[#505065]'}`}>{s}</div>
              {s < 3 && <div className={`flex-1 h-0.5 w-12 transition-colors ${s < step ? 'bg-[#00E5CC]' : 'bg-[#1E1E30]'}`} />}
            </div>
          ))}
          <div className="ml-2 text-sm text-[#505065]">{['Profile', 'Platforms', 'Crypto'][step - 1]}</div>
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-black text-white">Your Profile</h2>
            {[{ key: 'username', label: 'Username', placeholder: '@stonkqueen' }, { key: 'display_name', label: 'Display Name', placeholder: 'StonkQueen' }].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-[#A0A0B0] mb-2">{field.label}</label>
                <input value={form[field.key as keyof typeof form]} onChange={update(field.key)} placeholder={field.placeholder}
                  className="w-full bg-[#12121A] border border-[#1E1E30] rounded-xl px-4 py-3 text-white placeholder-[#505065] focus:outline-none focus:border-[#00E5CC]/30" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-[#A0A0B0] mb-2">Bio</label>
              <textarea value={form.bio} onChange={update('bio')} rows={3} placeholder="Tell fans what you create..."
                className="w-full bg-[#12121A] border border-[#1E1E30] rounded-xl px-4 py-3 text-white placeholder-[#505065] focus:outline-none focus:border-[#00E5CC]/30 resize-none" />
            </div>
            <button onClick={() => setStep(2)} disabled={!form.username || !form.display_name}
              className="w-full py-3 rounded-xl font-black text-sm text-[#0A0A0F] disabled:opacity-40" style={{ background: 'linear-gradient(135deg,#00E5CC,#0099AA)' }}>
              Next: Connect Platforms →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-white mb-1">Connect Your Platforms</h2>
              <p className="text-sm text-[#505065] mb-4">These platforms handle credit card billing for your fans. DTP earns a small affiliate commission. You keep all earnings.</p>
            </div>
            {PLATFORMS.map(p => (
              <div key={p.key} className="rounded-xl border border-[#1E1E30] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{p.emoji}</span>
                  <div><div className="text-sm font-bold text-white">{p.label}</div><div className="text-xs text-[#505065]">{p.desc}</div></div>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-[#00E5CC] hover:underline">Sign Up →</a>
                </div>
                <input value={form[p.key as keyof typeof form]} onChange={update(p.key)}
                  placeholder={`Your ${p.label} profile URL (optional)`}
                  className="w-full bg-[#0A0A0F] border border-[#1E1E30] rounded-lg px-3 py-2 text-sm text-white placeholder-[#505065] focus:outline-none focus:border-[#00E5CC]/30" />
              </div>
            ))}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl font-medium text-sm text-[#505065] border border-[#1E1E30] hover:text-white">← Back</button>
              <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl font-black text-sm text-[#0A0A0F]" style={{ background: 'linear-gradient(135deg,#00E5CC,#0099AA)' }}>Next: Crypto Setup →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-white mb-1">Crypto Wallet</h2>
              <p className="text-sm text-[#505065] mb-4">Receive SOL tips directly. Optional if you use platform partners for billing.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A0A0B0] mb-2">Solana Wallet Address <span className="text-[#505065] font-normal">(optional)</span></label>
              <input value={form.wallet_address} onChange={update('wallet_address')} placeholder="Your Solana wallet address..."
                className="w-full bg-[#12121A] border border-[#1E1E30] rounded-xl px-4 py-3 text-sm text-white placeholder-[#505065] focus:outline-none focus:border-[#00E5CC]/30 font-mono" />
            </div>
            <div className="bg-[#12121A] rounded-xl p-4 border border-[#1E1E30]">
              <h3 className="text-sm font-bold text-white mb-3">Payment summary</h3>
              <ul className="space-y-2 text-xs text-[#A0A0B0]">
                <li>💳 <strong className="text-white">Credit Card</strong> — via SextPanther, Fanvue, LoyalFans etc. DTP earns affiliate commission.</li>
                <li>◎ <strong className="text-white">Crypto (SOL/USDC)</strong> — via your wallet above. Instant, low-fee, non-custodial.</li>
                <li>🪙 <strong className="text-white">DTP Token</strong> — coming soon. Platform-native token for tips, unlocks, and rewards.</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl font-medium text-sm text-[#505065] border border-[#1E1E30] hover:text-white">← Back</button>
              <button onClick={() => setSubmitted(true)} className="flex-1 py-3 rounded-xl font-black text-sm text-[#0A0A0F]" style={{ background: 'linear-gradient(135deg,#FFD700,#FF9900)' }}>Submit Application 🚀</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
