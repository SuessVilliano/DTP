'use client'

import { useState } from 'react'

interface PaywallModalProps {
  videoId: string; title?: string; price?: number; priceCrypto?: string
  onClose: () => void; onSuccess: () => void
}

type PaymentMethod = 'nowpayments' | 'tiplink' | 'x402' | null

export function PaywallModal({ videoId, title, price = 4.99, priceCrypto = '0.01 SOL', onClose, onSuccess }: PaywallModalProps) {
  const [method, setMethod] = useState<PaymentMethod>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [invoiceUrl, setInvoiceUrl] = useState('')

  async function handleNOWPayments() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/payments/nowpayments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ videoId, amount: price, currency: 'usd', description: `DTP PPV: ${title || videoId}` }) })
      const data = await res.json()
      if (!res.ok) throw new Error('Failed to create invoice')
      setInvoiceUrl(data.invoice_url)
      startPolling(data.id)
    } catch { setError('Failed to create payment. Please try again.') } finally { setLoading(false) }
  }

  async function handleTipLink() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/payments/tiplink', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ videoId, amount: price }) })
      const data = await res.json()
      if (!res.ok) throw new Error('Failed to create TipLink')
      window.open(data.url, 'tiplink', 'width=480,height=640')
      startPolling(data.sessionId)
    } catch { setError('Failed to create TipLink session.') } finally { setLoading(false) }
  }

  async function handleX402() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/payments/x402', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ videoId, amount: price }) })
      const data = await res.json()
      if (!res.ok) throw new Error('Failed to init x402')
      console.log('x402 payment details:', data.paymentDetails)
    } catch { setError('x402 payment failed. Ensure you have USDC on Base.') } finally { setLoading(false) }
  }

  function startPolling(paymentId: string) {
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      if (attempts > 60) { clearInterval(interval); setError('Payment timeout. Contact support if charged.'); return }
      try {
        const res = await fetch(`/api/payments/nowpayments?id=${paymentId}`)
        const data = await res.json()
        if (data.status === 'confirmed' || data.status === 'finished') { clearInterval(interval); onSuccess() }
      } catch { /* continue */ }
    }, 5000)
  }

  const paymentOptions = [
    { id: 'nowpayments' as PaymentMethod, name: 'Crypto (100+ coins)', description: 'BTC, ETH, SOL, USDT, and 100+ more', icon: '₿', color: '#F7931A', action: handleNOWPayments },
    { id: 'tiplink' as PaymentMethod, name: 'TipLink (SOL)', description: 'Pay instantly with Solana — no wallet needed', icon: '⚡', color: '#00E5CC', action: handleTipLink },
    { id: 'x402' as PaymentMethod, name: 'USDC Stream (x402)', description: 'Pay-as-you-watch with Base USDC micropayments', icon: '💎', color: '#2775CA', action: handleX402 },
  ]

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative bg-[#12121A] border border-[#1E1E30] rounded-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#1E1E30]">
          <div><h2 className="text-xl font-bold text-white">Unlock Content</h2><p className="text-[#A0A0B0] text-sm mt-0.5 truncate max-w-[280px]">{title || 'Premium video'}</p></div>
          <button onClick={onClose} className="text-[#505065] hover:text-white transition-colors p-1 ml-2"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
        </div>
        <div className="px-5 py-4 bg-[#0A0A0F] flex items-center justify-between">
          <div><span className="text-3xl font-black text-white">${price}</span><span className="text-[#A0A0B0] text-sm ml-2">or {priceCrypto}</span></div>
          <div className="text-right"><div className="text-xs text-[#505065] font-mono">ONE-TIME ACCESS</div><div className="text-xs text-[#00E5CC] font-mono">NO SUBSCRIPTION</div></div>
        </div>
        {invoiceUrl && (
          <div className="px-5 py-4 border-t border-[#1E1E30]">
            <p className="text-sm text-[#A0A0B0] mb-3">Complete payment in the window below:</p>
            <a href={invoiceUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 rounded-lg bg-[#F7931A] text-white font-bold hover:opacity-90 transition-opacity">Open Payment Page ↗</a>
            <p className="text-xs text-[#505065] text-center mt-2 font-mono">Waiting for payment confirmation...</p>
            <div className="flex justify-center mt-2"><div className="w-4 h-4 border-2 border-[#00E5CC] border-t-transparent rounded-full animate-spin" /></div>
          </div>
        )}
        {!invoiceUrl && (
          <div className="p-5 space-y-3">
            <p className="text-xs text-[#505065] font-mono uppercase tracking-wider">Select payment method</p>
            {paymentOptions.map((opt) => (
              <button key={opt.id} onClick={() => { setMethod(opt.id); opt.action() }} disabled={loading}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-[#1E1E30] bg-[#1A1A26] hover:border-[#00E5CC33] hover:bg-[#1E1E30] transition-all text-left group disabled:opacity-50">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${opt.color}22`, border: `1px solid ${opt.color}44` }}>{opt.icon}</div>
                <div className="flex-1 min-w-0"><div className="text-white font-semibold text-sm">{opt.name}</div><div className="text-[#505065] text-xs mt-0.5">{opt.description}</div></div>
                {loading && method === opt.id ? <div className="w-4 h-4 border-2 border-[#00E5CC] border-t-transparent rounded-full animate-spin" /> : <svg className="w-4 h-4 text-[#505065] group-hover:text-[#00E5CC] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>}
              </button>
            ))}
            {error && <p className="text-[#FF3366] text-sm text-center py-2">{error}</p>}
          </div>
        )}
        <div className="px-5 pb-4 text-center"><p className="text-[10px] text-[#505065] leading-relaxed">Secure crypto payment. No personal info required. <a href="/terms" className="text-[#A0A0B0] hover:underline">Terms</a></p></div>
      </div>
    </div>
  )
}
