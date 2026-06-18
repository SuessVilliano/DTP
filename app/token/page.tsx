import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { TickerTape } from '@/components/TickerTape'

export const metadata: Metadata = {
  title: 'DTP Token — Solana',
  description: 'The DTP token is a Solana SPL token powering access tiers, tipping, and revenue sharing on Day Trader Porn.',
}

const TOKENOMICS = [
  { label: 'Total Supply', value: '1,000,000,000', unit: 'DTP', color: '#00E5CC' },
  { label: 'Platform Rewards', value: '30%', unit: '300M DTP', color: '#00FF88' },
  { label: 'Creator Pool', value: '25%', unit: '250M DTP', color: '#FFD700' },
  { label: 'Public Sale', value: '20%', unit: '200M DTP', color: '#9945FF' },
  { label: 'Team & Dev', value: '15%', unit: '150M DTP', color: '#FF6B35' },
  { label: 'Reserve', value: '10%', unit: '100M DTP', color: '#505065' },
]

const UTILITY = [
  { emoji: '🐂', title: 'Bull Tier Access', description: 'Hold 1,000 DTP to unlock full Bull-tier membership automatically. No monthly fee while you hold.' },
  { emoji: '🐋', title: 'Whale Tier Access', description: 'Hold 10,000 DTP for Whale-tier access including private DMs, exclusive content, and live sessions.' },
  { emoji: '💰', title: 'Creator Tips', description: 'Tip your favorite creators directly in DTP tokens. Low fees, instant settlement on Solana.' },
  { emoji: '📈', title: 'Revenue Sharing', description: 'Whale holders earn a share of platform revenue distributed weekly in USDC. The more you hold, the more you earn.' },
  { emoji: '🗳', title: 'Governance', description: 'Vote on platform features, creator promotions, and fee structures. 1 DTP = 1 vote.' },
  { emoji: '🎟', title: 'Exclusive Events', description: 'Token-gated live events, AMA sessions, and IRL meet-ups for DTP holders.' },
]

export default function TokenPage() {
  const mintAddress = process.env.NEXT_PUBLIC_DTP_TOKEN_MINT || 'PLACEHOLDER_DTP_TOKEN_MINT_ADDRESS'

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <TickerTape />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🪙</div>
          <h1 className="text-4xl font-black text-white mb-3">The <span className="text-[#FFD700]">DTP Token</span></h1>
          <p className="text-[#A0A0B0] text-lg max-w-xl mx-auto mb-6">A Solana SPL token powering access, tipping, and revenue sharing on the platform. Hold tokens to unlock tiers — no subscription needed.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={`https://solscan.io/token/${mintAddress}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline text-sm">View on Solscan →</a>
            <Link href="/join" className="btn btn-gold text-sm">Buy DTP Token</Link>
          </div>
        </div>

        <div className="bg-[#12121A] border border-[#FFD70033] rounded-xl p-4 mb-8 text-center">
          <p className="text-xs text-[#505065] font-mono mb-1">CONTRACT ADDRESS (Solana)</p>
          <code className="text-[#FFD700] font-mono text-sm break-all">{mintAddress}</code>
          <p className="text-[10px] text-[#505065] mt-2">⚠ Only buy from verified sources. DTP team will never DM you first.</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Token Utility</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {UTILITY.map((u) => (<div key={u.title} className="card p-5"><div className="text-3xl mb-3">{u.emoji}</div><h3 className="font-bold text-white mb-2">{u.title}</h3><p className="text-[#A0A0B0] text-sm leading-relaxed">{u.description}</p></div>))}
          </div>
        </div>

        <div className="bg-[#12121A] border border-[#1E1E30] rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Tokenomics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TOKENOMICS.map((item) => (<div key={item.label} className="bg-[#1A1A26] rounded-lg p-4"><div className="text-xl font-black mb-0.5" style={{ color: item.color }}>{item.value}</div><div className="text-xs text-[#505065] font-mono">{item.unit}</div><div className="text-sm text-[#A0A0B0] mt-1">{item.label}</div></div>))}
          </div>
        </div>

        <div className="bg-[#12121A] border border-[#1E1E30] rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 text-center">Buy DTP via Jupiter</h2>
          <p className="text-[#A0A0B0] text-sm text-center mb-4">Swap SOL or USDC for DTP tokens directly using Jupiter DEX aggregator.</p>
          <div id="integrated-terminal" className="w-full" data-endpoint={process.env.NEXT_PUBLIC_SOLANA_RPC_URL} data-mint={mintAddress} />
          <p className="text-[10px] text-[#505065] text-center mt-3">⚠ Token not yet deployed. Jupiter widget will be active post-launch.</p>
        </div>

        <div className="bg-[#FF336611] border border-[#FF336633] rounded-xl p-4 text-sm text-[#A0A0B0] text-center">
          <strong className="text-[#FF3366]">Not financial advice.</strong>{' '}
          DTP tokens provide platform utility only. They are not investment instruments. Holding DTP tokens does not guarantee any financial return. Do your own research.
        </div>
      </div>
    </div>
  )
}
