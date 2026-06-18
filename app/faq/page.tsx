'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

interface FAQItem {
  q: string
  a: string
  category: string
}

const FAQ_ITEMS: FAQItem[] = [
  // Legal
  { category: 'Legal', q: 'Is this site legal?', a: 'Yes. Day Trader Porn operates in full compliance with applicable law. All content creators are verified to be 18+ years of age, and we maintain 2257 compliance documentation for all content. We operate on an invite-only creator model with rigorous ID verification. See our /2257 page for the full compliance statement.' },
  { category: 'Legal', q: 'Is my information safe?', a: 'We take privacy seriously. DTP is crypto-native: no credit cards are stored, no personal banking data is collected, and no personal information is sold to third parties. Wallet addresses are pseudonymous by nature. Our infrastructure uses end-to-end encryption for all data in transit.' },
  { category: 'Legal', q: 'How is DTP different from OnlyFans?', a: 'DTP is crypto-native and trader-themed. Unlike OnlyFans: we accept no fiat payments (crypto only), creators get paid directly to their Solana wallets, there\'s no payment processor risk, access tiers are controlled by token holdings rather than subscriptions, and all creators are invite-only with strict verification.' },
  // Payments
  { category: 'Payments', q: 'How do I pay?', a: 'DTP accepts crypto only. Three payment methods: (1) TipLink — pay with USDC using just your Google account, no wallet needed; (2) NOWPayments — 100+ cryptocurrencies including BTC, ETH, LTC, DOGE, and more; (3) x402 — instant USDC micropayments on Coinbase Base for the lowest fees.' },
  { category: 'Payments', q: 'Why crypto only?', a: 'Crypto payments eliminate payment processor risk (no chargebacks, no deplatforming), enable instant global payouts to creators, offer better privacy for users, and align with the platform\'s trader-native identity. Every DTP transaction is transparent, fast, and final.' },
  { category: 'Payments', q: 'Can I cancel?', a: 'Membership on DTP is not a traditional subscription — it\'s determined by your DTP token balance. To "cancel," simply reduce your token holdings below the tier threshold. There are no recurring charges. For PPV content, purchases are final and non-refundable once content has been accessed.' },
  { category: 'Payments', q: 'How long does crypto payment confirmation take?', a: 'TipLink and x402 (USDC on Base) confirm in seconds. NOWPayments varies by cryptocurrency: Bitcoin ~10–30 minutes, Ethereum ~2–5 minutes, Litecoin ~3–5 minutes, Solana ~1–3 seconds. Access is granted automatically once the payment confirms on-chain.' },
  // Membership & DTP Token
  { category: 'Membership', q: 'What is the DTP token?', a: 'DTP is a Solana SPL token that powers the entire platform. Holding 1,000 DTP unlocks Bull tier (full video access, no ads). Holding 10,000 DTP unlocks Whale tier (all Bull perks plus exclusive content, creator DMs, revenue sharing, and governance voting). The token is tradeable on Raydium and Jupiter.' },
  { category: 'Membership', q: 'Do I need a wallet?', a: 'A wallet is required for Bull and Whale tier access (since tier is determined by DTP token balance). For Free Trader access or PPV purchases via TipLink, no wallet is needed. Supported wallets: Phantom (recommended for Solana/DTP tokens) and MetaMask (for x402/Base payments).' },
  { category: 'Membership', q: 'How do I get Bull or Whale access?', a: 'Purchase DTP tokens on Raydium or Jupiter (search the DTP token contract address listed on the /token page). Transfer them to your Phantom wallet. Connect your Phantom wallet on DTP. Your tier upgrades automatically based on your balance — no further action needed.' },
  // Creators
  { category: 'Creators', q: 'How do creators get paid?', a: 'Creators earn 70% of PPV sales and 90% of all direct tips. Payouts go directly to the creator\'s Solana wallet — no delay, no minimum threshold, no chargebacks. Revenue is settled in SOL or USDC depending on the payment method used by the fan.' },
  { category: 'Creators', q: 'How do I apply as a creator?', a: 'Visit /become-a-creator and complete the application. You\'ll need a government-issued ID (front + back), a selfie holding the ID, at least one existing social profile link, and a Solana wallet address for payouts. Applications are reviewed within 48 hours.' },
  { category: 'Creators', q: 'What content categories are on DTP?', a: 'Content is organized around trading themes: Bull Run, Bear Trap, HODL, After Hours, Degen Mode, Short Squeeze, and more. Creators choose their categories when uploading. This keeps the content thematically consistent with the platform\'s trader identity.' },
  // Content & Platform
  { category: 'Content', q: 'What is the Trading Room?', a: 'The Trading Room (/markets) is a live charts dashboard featuring real-time BTC, ETH, SOL, and NQ Futures candlestick charts. It\'s designed so traders can monitor markets and browse content simultaneously. All charts are for entertainment purposes only and do not constitute financial advice.' },
  { category: 'Content', q: 'What is DTP?', a: 'Day Trader Porn — the only adult platform built specifically for traders. Crypto-native payments, a live Trading Room, token-gated access tiers, and a creator program for trading-themed adult content. Where the market never closes.' },
  { category: 'Content', q: 'How is content moderated?', a: 'All creators are invite-only with verified ID documents. Content is reviewed before going live. Any content featuring minors is strictly prohibited and will result in permanent account termination and law enforcement reporting. We comply with all applicable regulations including DMCA.' },
]

const CATEGORIES = ['All', ...Array.from(new Set(FAQ_ITEMS.map(f => f.category)))]

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All' ? FAQ_ITEMS : FAQ_ITEMS.filter(f => f.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-[#A0A0B0]">Got questions? We&apos;ve got answers.</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIdx(null) }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#00E5CC] text-[#0A0A0F] font-bold'
                  : 'bg-[#12121A] border border-[#1E1E30] text-[#A0A0B0] hover:text-white hover:border-[#505065]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {filtered.map((item, i) => {
            const globalIdx = FAQ_ITEMS.indexOf(item)
            const isOpen = openIdx === globalIdx
            return (
              <div key={globalIdx} className="bg-[#12121A] border border-[#1E1E30] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : globalIdx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-[#1A1A26] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1A26] border border-[#1E1E30] text-[#505065] font-mono flex-shrink-0">
                      {item.category}
                    </span>
                    <span className="font-semibold text-white text-sm">{item.q}</span>
                  </div>
                  <span className={`text-[#00E5CC] flex-shrink-0 transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <p className="text-[#A0A0B0] text-sm leading-relaxed border-t border-[#1E1E30] pt-4">{item.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-[#12121A] border border-[#1E1E30] rounded-xl p-6 text-center">
          <p className="text-white font-bold mb-1">Still have questions?</p>
          <p className="text-[#A0A0B0] text-sm mb-4">Our support team is here to help.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/docs" className="btn btn-outline text-sm py-2 px-5">Read Docs</Link>
            <Link href="/support" className="btn btn-primary text-sm py-2 px-5">Get Support</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
