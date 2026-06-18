'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AGE_GATE_COOKIE = 'dtp_age_verified'

function setAgeVerifiedCookie() {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${AGE_GATE_COOKIE}=1; max-age=86400; SameSite=Strict; path=/${secure}`
}

function getAgeVerifiedCookie(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.split(';').some((c) => c.trim().startsWith(`${AGE_GATE_COOKIE}=1`))
}

export function AgeGate() {
  const router = useRouter()
  const [showDOB, setShowDOB] = useState(false)
  const [dob, setDob] = useState({ year: '', month: '', day: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (getAgeVerifiedCookie()) {
      router.replace('/home')
    }
  }, [router])

  function handleConfirm() {
    setLoading(true)
    setAgeVerifiedCookie()
    setTimeout(() => router.replace('/home'), 400)
  }

  function handleDOBSubmit() {
    setError('')
    const year = parseInt(dob.year, 10)
    const month = parseInt(dob.month, 10)
    const day = parseInt(dob.day, 10)
    if (!year || !month || !day || dob.year.length !== 4) { setError('Please enter a valid date of birth.'); return }
    const birthDate = new Date(year, month - 1, day)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
    if (isNaN(age) || age < 18) { setError('You must be 18 or older to enter this site.'); return }
    handleConfirm()
  }

  function handleDeny() { window.location.href = 'https://www.google.com' }

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#0A0A0F] terminal-bg">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(0,229,204,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,204,0.15) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E5CC22] to-transparent pointer-events-none" style={{ animation: 'scan 8s linear infinite', top: 0 }} />
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-md w-full">
        <div className="text-center select-none">
          <div className="text-xs font-mono tracking-[0.3em] text-[#00E5CC] mb-2 uppercase">Access Verification</div>
          <h1 className="text-5xl font-black tracking-tight" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #00E5CC 50%, #FFFFFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>DTP</h1>
          <div className="text-2xl font-bold text-white mt-1">Day Trader Porn</div>
          <p className="text-[#A0A0B0] text-sm mt-3 font-mono">"Where the market never closes."</p>
        </div>
        <div className="w-full border border-[#1E1E30] bg-[#12121A] rounded-lg p-5 text-center">
          <p className="text-[#A0A0B0] text-sm leading-relaxed">This website contains <span className="text-white font-semibold">adult content (18+)</span> and explicit material. By entering, you confirm you are of legal age in your jurisdiction to view adult content.</p>
        </div>
        {!showDOB ? (
          <div className="w-full flex flex-col gap-3">
            <button onClick={handleConfirm} disabled={loading} className="w-full py-4 rounded-lg font-bold text-lg text-[#0A0A0F] bg-[#00E5CC] hover:bg-[#00B8A3] transition-all duration-200 hover:shadow-[0_0_30px_rgba(0,229,204,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Entering...' : 'I am 18 or older — Enter'}
            </button>
            <button onClick={() => setShowDOB(true)} className="w-full py-3 rounded-lg font-medium text-sm text-[#A0A0B0] border border-[#1E1E30] bg-transparent hover:bg-[#12121A] hover:border-[#00E5CC33] transition-all duration-200">Verify with Date of Birth</button>
            <button onClick={handleDeny} className="w-full py-2 text-sm text-[#505065] hover:text-[#A0A0B0] transition-colors">Exit — I am under 18</button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <div className="text-center text-sm text-[#A0A0B0] font-mono">Enter your date of birth</div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 flex-1"><label className="text-xs text-[#505065] font-mono">MONTH</label><input type="number" min="1" max="12" placeholder="MM" value={dob.month} onChange={(e) => setDob({ ...dob, month: e.target.value })} className="input text-center" autoFocus /></div>
              <div className="flex flex-col gap-1 flex-1"><label className="text-xs text-[#505065] font-mono">DAY</label><input type="number" min="1" max="31" placeholder="DD" value={dob.day} onChange={(e) => setDob({ ...dob, day: e.target.value })} className="input text-center" /></div>
              <div className="flex flex-col gap-1 flex-[2]"><label className="text-xs text-[#505065] font-mono">YEAR</label><input type="number" min="1900" max={new Date().getFullYear()} placeholder="YYYY" value={dob.year} onChange={(e) => setDob({ ...dob, year: e.target.value })} className="input text-center" /></div>
            </div>
            {error && <p className="text-[#FF3366] text-sm text-center">{error}</p>}
            <button onClick={handleDOBSubmit} disabled={loading} className="w-full py-4 rounded-lg font-bold text-lg text-[#0A0A0F] bg-[#00E5CC] hover:bg-[#00B8A3] transition-all disabled:opacity-50">{loading ? 'Entering...' : 'Confirm & Enter'}</button>
            <button onClick={() => { setShowDOB(false); setError('') }} className="text-sm text-[#505065] hover:text-[#A0A0B0] transition-colors">← Back</button>
          </div>
        )}
        <p className="text-[11px] text-[#505065] text-center leading-relaxed max-w-xs">By entering you agree to our <a href="/terms" target="_blank" className="text-[#A0A0B0] hover:text-white underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-[#A0A0B0] hover:text-white underline">Privacy Policy</a>. All performers are 18+. <a href="/2257" target="_blank" className="text-[#A0A0B0] hover:text-white underline">18 U.S.C. § 2257</a></p>
      </div>
    </div>
  )
}
