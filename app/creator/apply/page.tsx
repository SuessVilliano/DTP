'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const CONTENT_CATEGORIES = ['Bull Run', 'Bear Trap', 'After Hours', 'HODL', 'Short Squeeze', 'Degen Mode', 'Trading Floor', 'Earnings Season', 'Pre-Market']

type FormData = {
  name: string; email: string; phone: string
  onlyfans: string; sextpanther: string; twitter: string; instagram: string; fansly: string
  categories: string[]
  solanaWallet: string; tiplinkEmail: string
  agreedTerms: boolean; agreed2257: boolean
  idFront: File | null; idBack: File | null; selfie: File | null
}

const STEPS = ['Basic Info', 'Content & Socials', 'ID Verification', 'Payment Setup', 'Review & Submit']

export default function CreatorApplyPage() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<FormData>({
    name: '', email: '', phone: '', onlyfans: '', sextpanther: '', twitter: '', instagram: '', fansly: '',
    categories: [], solanaWallet: '', tiplinkEmail: '', agreedTerms: false, agreed2257: false,
    idFront: null, idBack: null, selfie: null,
  })

  const update = (k: keyof FormData, v: unknown) => setData(d => ({ ...d, [k]: v }))
  const toggleCategory = (cat: string) => setData(d => ({ ...d, categories: d.categories.includes(cat) ? d.categories.filter(c => c !== cat) : [...d.categories, cat] }))
  const canNext = () => {
    if (step === 0) return data.name && data.email
    if (step === 1) return data.categories.length > 0
    if (step === 2) return data.idFront && data.idBack && data.selfie
    if (step === 3) return data.solanaWallet || data.tiplinkEmail
    if (step === 4) return data.agreedTerms && data.agreed2257
    return true
  }

  const handleSubmit = async () => {
    if (!canNext()) return
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => {
        if (v instanceof File) formData.append(k, v)
        else if (Array.isArray(v)) formData.append(k, JSON.stringify(v))
        else if (v !== null) formData.append(k, String(v))
      })
      const res = await fetch('/api/creators/apply', { method: 'POST', body: formData })
      if (!res.ok) throw new Error(await res.text())
      setSubmitted(true)
    } catch { toast.error('Submission failed. Please try again.') } finally { setLoading(false) }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">✓</div>
          <h1 className="text-3xl font-black text-white mb-4">You're on the waitlist.</h1>
          <p className="text-[#A0A0B0] leading-relaxed mb-6">Our team reviews every submission manually. You'll hear back within <span className="text-white font-bold">48 hours</span> via email if selected.</p>
          <Link href="/home" className="btn btn-ghost inline-flex py-3 px-6 rounded-xl border-[#1E1E30] text-[#A0A0B0]">← Back to DTP</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <Link href="/become-a-creator" className="text-[#00E5CC] font-black text-xl">DTP</Link>
          <h1 className="text-3xl font-black text-white mt-4 mb-2">Creator Application</h1>
          <p className="text-[#505065] text-sm">Invite-only. We review every application manually.</p>
        </div>
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${i < step ? 'bg-[#00E5CC] border-[#00E5CC] text-[#0A0A0F]' : i === step ? 'border-[#00E5CC] text-[#00E5CC] bg-transparent' : 'border-[#1E1E30] text-[#505065] bg-transparent'}`}>{i < step ? '✓' : i + 1}</div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i < step ? 'bg-[#00E5CC]' : 'bg-[#1E1E30]'}`} />}
            </div>
          ))}
        </div>
        <div className="text-xs text-[#505065] text-center mb-8 uppercase tracking-widest font-mono">{STEPS[step]}</div>
        <div className="rounded-2xl border border-[#1E1E30] p-6 sm:p-8" style={{ background: '#12121A' }}>
          {step === 0 && (
            <div className="space-y-4">
              <div><label className="block text-xs text-[#505065] uppercase tracking-widest mb-2 font-mono">Full Name *</label><input className="input" placeholder="Your real name (kept private)" value={data.name} onChange={e => update('name', e.target.value)} /></div>
              <div><label className="block text-xs text-[#505065] uppercase tracking-widest mb-2 font-mono">Email Address *</label><input className="input" type="email" placeholder="you@example.com" value={data.email} onChange={e => update('email', e.target.value)} /></div>
              <div><label className="block text-xs text-[#505065] uppercase tracking-widest mb-2 font-mono">Phone (optional)</label><input className="input" type="tel" placeholder="+1 555 000 0000" value={data.phone} onChange={e => update('phone', e.target.value)} /></div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <div className="text-sm font-bold text-white mb-4">Your Social Profiles</div>
                {[{ key: 'onlyfans', label: 'OnlyFans', placeholder: 'onlyfans.com/username' }, { key: 'sextpanther', label: 'SextPanther', placeholder: 'sextpanther.com/username' }, { key: 'twitter', label: 'Twitter / X', placeholder: '@username' }, { key: 'instagram', label: 'Instagram', placeholder: '@username (optional)' }, { key: 'fansly', label: 'Fansly', placeholder: 'fansly.com/username (optional)' }].map(f => (
                  <div key={f.key} className="mb-3"><label className="block text-xs text-[#505065] mb-1.5 font-mono">{f.label}</label><input className="input" placeholder={f.placeholder} value={data[f.key as keyof FormData] as string} onChange={e => update(f.key as keyof FormData, e.target.value)} /></div>
                ))}
              </div>
              <div>
                <div className="text-sm font-bold text-white mb-3">Content Categories *</div>
                <div className="flex flex-wrap gap-2">
                  {CONTENT_CATEGORIES.map(cat => (
                    <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${data.categories.includes(cat) ? 'border-[#00E5CC] bg-[#00E5CC]/15 text-[#00E5CC]' : 'border-[#1E1E30] text-[#505065] hover:border-[#00E5CC]/30'}`}>{cat}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#FFD700]/20 p-4 bg-[#FFD700]/5">
                <div className="text-xs text-[#FFD700] font-black uppercase tracking-widest mb-2">18 U.S.C. § 2257 Compliance Required</div>
                <p className="text-sm text-[#A0A0B0] leading-relaxed">Federal law requires age verification records for all performers. Your ID is stored in a private vault — never shared or made public.</p>
              </div>
              {[{ key: 'idFront', label: 'Government ID — Front', hint: 'Passport, driver license, or national ID. Must show name and DOB.' }, { key: 'idBack', label: 'Government ID — Back', hint: 'Back of the same document.' }, { key: 'selfie', label: 'Selfie Holding Your ID', hint: 'Clear photo of you holding your ID. Both face and ID must be visible.' }].map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-[#505065] uppercase tracking-widest mb-1.5 font-mono">{f.label} *</label>
                  <p className="text-xs text-[#505065] mb-2">{f.hint}</p>
                  <input type="file" accept="image/*" onChange={e => update(f.key as keyof FormData, e.target.files?.[0] ?? null)} className="block w-full text-sm text-[#A0A0B0] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#1A1A26] file:text-[#00E5CC] hover:file:bg-[#1E1E2E] cursor-pointer" />
                  {data[f.key as keyof FormData] && <p className="text-xs text-[#00E5CC] mt-1">✓ {(data[f.key as keyof FormData] as File)?.name}</p>}
                </div>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-6">
              <p className="text-sm text-[#A0A0B0]">How should we pay you? You need at least one method.</p>
              <div><label className="block text-xs text-[#505065] uppercase tracking-widest mb-2 font-mono">Solana Wallet Address</label><input className="input font-mono text-sm" placeholder="Your SOL wallet (e.g. 5xEE...)" value={data.solanaWallet} onChange={e => update('solanaWallet', e.target.value)} /></div>
              <div className="text-center text-xs text-[#505065]">OR</div>
              <div><label className="block text-xs text-[#505065] uppercase tracking-widest mb-2 font-mono">Email for TipLink (no wallet needed)</label><input className="input" type="email" placeholder="your@email.com" value={data.tiplinkEmail} onChange={e => update('tiplinkEmail', e.target.value)} /></div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">{[['Name', data.name], ['Email', data.email], ['Categories', data.categories.join(', ') || 'None'], ['ID Docs', [data.idFront, data.idBack, data.selfie].filter(Boolean).length + ' of 3 uploaded'], ['Payment', data.solanaWallet ? 'Solana wallet' : data.tiplinkEmail ? 'TipLink' : '⚠️ None']].map(([k, v]) => (<div key={k} className="flex justify-between py-2 border-b border-[#1E1E30] text-sm"><span className="text-[#505065]">{k}</span><span className="text-white text-right max-w-[60%] truncate">{v}</span></div>))}</div>
              <div className="space-y-4 pt-2">
                <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={data.agreedTerms} onChange={e => update('agreedTerms', e.target.checked)} className="mt-1 accent-[#00E5CC]" /><span className="text-sm text-[#A0A0B0]">I agree to the <Link href="/terms" className="text-[#00E5CC] hover:underline" target="_blank">Creator Terms</Link>. I am 18+.</span></label>
                <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={data.agreed2257} onChange={e => update('agreed2257', e.target.checked)} className="mt-1 accent-[#00E5CC]" /><span className="text-sm text-[#A0A0B0]">I understand <Link href="/2257" className="text-[#00E5CC] hover:underline" target="_blank">18 U.S.C. § 2257</Link> requirements. All performers are 18+.</span></label>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-6 gap-4">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="btn btn-ghost py-3 px-6 rounded-xl border-[#1E1E30] text-[#A0A0B0] disabled:opacity-40">← Back</button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="btn btn-cyan py-3 px-8 rounded-xl font-black text-[#0A0A0F] disabled:opacity-40 flex-1 sm:flex-none">Continue →</button>
          ) : (
            <button onClick={handleSubmit} disabled={!canNext() || loading} className="btn btn-cyan py-3 px-8 rounded-xl font-black text-[#0A0A0F] disabled:opacity-40 flex-1 sm:flex-none">{loading ? 'Submitting...' : 'Submit Application →'}</button>
          )}
        </div>
      </div>
    </div>
  )
}
