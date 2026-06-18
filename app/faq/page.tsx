'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import Link from 'next/link'

const FAQS = [
  {
    q: 'What is DayTraderPorn?',
    a: 'DayTraderPorn (DTP) is a premium platform where traders and financial creators share exclusive content, market insights, and personalized coaching. Think of it as the intersection of trading expertise and the creator economy.',
  },
  {
    q: 'How can I pay?',
    a: 'We support three payment methods: (1) Credit card — subscribe via our trusted affiliate platforms like SextPanther, Fanvue, LoyalFans, ManyVids, or NiteFlirt. These platforms are adult-friendly and accept all major credit cards. (2) Crypto — pay with SOL or USDC directly from your Solana wallet. Fast, cheap, and no KYC required. (3) DTP Token — our native platform token launching soon, with staking rewards and creator revenue share.',
  },
  {
    q: 'Is my privacy protected?',
    a: 'Yes. DTP never sees your credit card details — all CC billing is handled entirely by our partner platforms. Crypto payments are pseudonymous. We do not sell or share your personal data with third parties.',
  },
  {
    q: 'How do I become a creator?',
    a: 'Visit the Become a Creator page and complete the 3-step application: set up your profile and bio, connect your external platforms for credit card billing, and optionally add a Solana wallet for direct crypto tips. Applications are reviewed within 48 hours.',
  },
  {
    q: 'What is Demo Mode?',
    a: 'Demo Mode lets you explore the full platform without creating an account. Visit /demo to activate it — all premium content is shown as unlocked so you can preview the experience. Exit demo by clicking the red banner at the top of any page.',
  },
  {
    q: 'What is the DTP Token?',
    a: 'The DTP Token is our native cryptocurrency launching on the Solana blockchain. It will power XP rewards, platform staking for premium access, creator revenue share, and governance voting. It is currently in development — visit the Token page for updates.',
  },
  {
    q: 'How does the affiliate commission model work?',
    a: 'When fans subscribe to creators via SextPanther, Fanvue, or other partner platforms, DTP earns a small affiliate commission from those platforms. Creators keep all their earnings from those platforms — the commission is paid by the platform, not deducted from creators.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Subscription refunds are handled by the respective billing platform per their own policies. Crypto tip transactions are on-chain and non-reversible by nature. For billing concerns, contact support@daytraderporn.com.',
  },
  {
    q: 'What is XP and how do I earn it?',
    a: 'XP (Experience Points) are earned through platform activity — subscribing, messaging creators, sending tips, watching live streams, and unlocking content. Accumulate XP to rank up from Paperhand → Retail → Chartist → Swing Trader → Day Trader → Prop Funded → Whale, each unlocking additional perks.',
  },
]

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-20">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-2">Frequently Asked Questions</h1>
          <p className="text-[#505065] text-sm">Everything you need to know about DTP.</p>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-[#12121A] rounded-xl border border-[#1E1E30] overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#1E1E30]/50 transition-colors"
              >
                <span className="text-sm font-bold text-white pr-4">{faq.q}</span>
                <span className="text-[#505065] text-lg shrink-0 font-black">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-[#A0A0B0] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 bg-[#12121A] rounded-2xl border border-[#1E1E30] p-6 text-center">
          <p className="text-sm text-[#A0A0B0] mb-4">Still have questions?</p>
          <a
            href="mailto:support@daytraderporn.com"
            className="inline-block px-6 py-3 rounded-xl text-sm font-black text-[#0A0A0F] transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#00E5CC,#0099AA)' }}
          >
            Contact Support →
          </a>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
