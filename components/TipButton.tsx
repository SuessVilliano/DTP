'use client'

import { useState } from 'react'

interface TipButtonProps {
  creatorId: string
  creatorName?: string
  recipientWallet?: string
}

const TIP_AMOUNTS = [1, 5, 10, 25, 50, 100]

export function TipButton({ creatorId, creatorName = 'Creator', recipientWallet }: TipButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [amount, setAmount] = useState(5)
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleTip() {
    setLoading(true); setError('')
    const finalAmount = customAmount ? parseFloat(customAmount) : amount
    try {
      const res = await fetch('/api/payments/tiplink', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ creatorId, recipientWallet, amount: finalAmount, isTip: true }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Tip failed')
      const popup = window.open(data.url, 'tiplink-tip', 'width=480,height=640')
      let attempts = 0
      const poll = setInterval(async () => {
        attempts++
        if (attempts > 30 || popup?.closed) { clearInterval(poll); if (attempts > 30) setError('Tip timed out.'); setLoading(false); return }
        const statusRes = await fetch(`/api/payments/tiplink?sessionId=${data.sessionId}`)
        const status = await statusRes.json()
        if (status.completed) { clearInterval(poll); setSuccess(true); setLoading(false); setTimeout(() => { setSuccess(false); setShowModal(false) }, 3000) }
      }, 3000)
    } catch { setError('Tip failed. Please try again.'); setLoading(false) }
  }

  return (
    <>
      <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD70022] border border-[#FFD70033] text-[#FFD700] hover:bg-[#FFD70033] hover:border-[#FFD700] transition-all text-sm font-semibold">💰 Tip</button>
      {showModal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-[#12121A] border border-[#1E1E30] rounded-xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="p-5 border-b border-[#1E1E30] flex items-center justify-between">
              <div><h3 className="font-bold text-white">Send a Tip</h3><p className="text-[#A0A0B0] text-sm">to {creatorName}</p></div>
              <button onClick={() => setShowModal(false)} className="text-[#505065] hover:text-white"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
            <div className="p-5 space-y-4">
              {success ? (
                <div className="text-center py-4"><div className="text-4xl mb-2">🎉</div><p className="text-[#00FF88] font-bold">Tip sent!</p><p className="text-[#A0A0B0] text-sm">Thanks for supporting {creatorName}</p></div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {TIP_AMOUNTS.map((a) => <button key={a} onClick={() => { setAmount(a); setCustomAmount('') }} className={`py-2 rounded-lg text-sm font-bold transition-all ${amount === a && !customAmount ? 'bg-[#FFD700] text-[#0A0A0F]' : 'bg-[#1A1A26] text-[#A0A0B0] border border-[#1E1E30] hover:border-[#FFD70033] hover:text-white'}`}>${a}</button>)}
                  </div>
                  <input type="number" placeholder="Custom amount (USD)" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setAmount(0) }} className="input" min="1" max="500" />
                  {error && <p className="text-[#FF3366] text-sm">{error}</p>}
                  <button onClick={handleTip} disabled={loading || (!amount && !customAmount)} className="w-full py-3 rounded-lg font-bold text-[#0A0A0F] bg-[#FFD700] hover:bg-[#CCAC00] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? <><div className="w-4 h-4 border-2 border-[#0A0A0F] border-t-transparent rounded-full animate-spin" />Processing...</> : `💰 Send $${customAmount || amount} via TipLink`}
                  </button>
                  <p className="text-[10px] text-[#505065] text-center">Powered by TipLink · Instant SOL transfer · No wallet required</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
