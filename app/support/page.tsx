'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

export default function SupportPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  useEffect(() => {
    // Load Tawk.to live chat widget
    const tawkId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || 'TAWK_PROPERTY_ID'
    if (tawkId && tawkId !== 'TAWK_PROPERTY_ID') {
      const s1 = document.createElement('script')
      s1.async = true
      s1.src = `https://embed.tawk.to/${tawkId}/default`
      s1.charset = 'UTF-8'
      s1.setAttribute('crossorigin', '*')
      document.head.appendChild(s1)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/support/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-3">Support</h1>
          <p className="text-[#A0A0B0]">We&apos;re here to help. Choose the fastest way to reach us.</p>
        </div>

        {/* Business Hours Banner */}
        <div className="bg-[#00E5CC]/10 border border-[#00E5CC]/30 rounded-xl px-5 py-3 mb-8 flex items-center gap-3">
          <span className="text-[#00E5CC] text-lg">🕐</span>
          <p className="text-sm text-[#A0A0B0]">
            <span className="text-white font-semibold">Live support available Mon–Fri 9am–6pm EST.</span>{' '}
            After hours? Use our contact form or Telegram — we respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Telegram */}
          <div className="bg-[#12121A] border border-[#1E1E30] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0088CC]/20 flex items-center justify-center text-xl">✈️</div>
              <div>
                <h2 className="text-white font-bold">Telegram Support</h2>
                <p className="text-xs text-[#505065]">Fastest response</p>
              </div>
            </div>
            <p className="text-[#A0A0B0] text-sm mb-5 leading-relaxed">
              Join our Telegram support channel for real-time help from the DTP team. Community members and staff monitor the channel daily.
            </p>
            <a
              href="https://t.me/DTPSupport"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white text-sm transition-all"
              style={{ background: '#0088CC' }}
            >
              <span>Open DTP Telegram</span>
              <span>→</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="bg-[#12121A] border border-[#1E1E30] rounded-xl p-6">
            <h2 className="text-white font-bold mb-4">Self-Service Resources</h2>
            <div className="space-y-3">
              {[
                { label: '📖 Documentation', href: '/docs', desc: 'Wallets, payments, creator program' },
                { label: '❓ FAQ', href: '/faq', desc: '15+ common questions answered' },
                { label: '⚖️ Terms of Service', href: '/terms', desc: 'Platform rules and policies' },
                { label: '🔒 Privacy Policy', href: '/privacy', desc: 'How we handle your data' },
                { label: '🚨 DMCA', href: '/dmca', desc: 'Report copyright infringement' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#1E1E30] hover:border-[#505065] hover:bg-[#1A1A26] transition-all group"
                >
                  <div>
                    <span className="text-sm text-white font-medium">{link.label}</span>
                    <p className="text-xs text-[#505065]">{link.desc}</p>
                  </div>
                  <span className="text-[#505065] group-hover:text-[#00E5CC] transition-colors">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#12121A] border border-[#1E1E30] rounded-xl p-6">
          <h2 className="text-white font-bold text-lg mb-2">Send Us a Message</h2>
          <p className="text-[#505065] text-sm mb-6">We respond to all inquiries within 24 hours (often much faster).</p>

          {status === 'success' ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-white font-bold mb-1">Message sent!</p>
              <p className="text-[#A0A0B0] text-sm">We&apos;ll get back to you at the email provided within 24 hours.</p>
              <button onClick={() => setStatus('idle')} className="mt-4 text-[#00E5CC] text-sm hover:underline">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#505065] mb-1.5 font-mono uppercase">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#505065] mb-1.5 font-mono uppercase">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="input w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#505065] mb-1.5 font-mono uppercase">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your issue or question in detail..."
                  className="input w-full resize-none"
                />
              </div>
              {status === 'error' && (
                <p className="text-[#FF3366] text-sm">Failed to send. Please try Telegram instead.</p>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn btn-primary w-full py-3 font-bold disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-[#505065] mt-8">
          For legal inquiries:{' '}
          <a href="mailto:legal@daytraderporn.com" className="text-[#00E5CC] hover:underline">
            legal@daytraderporn.com
          </a>
          {' '}| For DMCA:{' '}
          <a href="mailto:dmca@daytraderporn.com" className="text-[#00E5CC] hover:underline">
            dmca@daytraderporn.com
          </a>
        </p>
      </div>
    </div>
  )
}
