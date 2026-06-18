import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { TickerTape } from '@/components/TickerTape'
import { CandlestickChart } from '@/components/CandlestickChart'

export const metadata: Metadata = {
  title: 'Markets — Trading Dashboard',
  description: 'Live crypto and futures charts. Entertainment purposes only. Not financial advice.',
}

// IMPORTANT: Affiliate/broker links ONLY on this page, NEVER on content pages.
// Include financial disclaimer on all charts.

const INSTRUMENTS = [
  { symbol: 'BTCUSDT', label: 'Bitcoin', flag: '₿', description: 'BTC/USD Perpetual' },
  { symbol: 'ETHUSDT', label: 'Ethereum', flag: 'Ξ', description: 'ETH/USD Perpetual' },
  { symbol: 'SOLUSDT', label: 'Solana', flag: '◎', description: 'SOL/USD Perpetual' },
]

export default function MarketsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <TickerTape />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">Trading Room</h1>
            <p className="text-[#505065] text-sm mt-1 font-mono">
              Watch markets & content simultaneously
            </p>
          </div>
          <div className="bg-[#FF336611] border border-[#FF336633] rounded-lg px-4 py-2 text-right max-w-xs">
            <p className="text-[#FF3366] text-xs font-bold font-mono">⚠ DISCLAIMER</p>
            <p className="text-[10px] text-[#A0A0B0] mt-0.5 leading-relaxed">
              Charts provided for entertainment only. Not financial advice.
              Day trading involves substantial risk of loss.
            </p>
          </div>
        </div>

        {/* Main BTC chart */}
        <div className="mb-6">
          <CandlestickChart symbol="BTCUSDT" height={450} showVolume />
        </div>

        {/* ETH + SOL side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <CandlestickChart symbol="ETHUSDT" height={300} />
          <CandlestickChart symbol="SOLUSDT" height={300} />
        </div>

        {/* NQ Futures via Alpha Vantage */}
        <div className="bg-[#12121A] border border-[#1E1E30] rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-mono font-bold text-white">NQ / Nasdaq Futures</span>
              <p className="text-xs text-[#505065] font-mono">Via Alpha Vantage — 15-min delay</p>
            </div>
            <a
              href="/api/market/alphavantage?symbol=NQ&interval=5min"
              className="text-xs text-[#00E5CC] hover:underline font-mono"
            >
              Refresh →
            </a>
          </div>
          {/* NQ chart rendered client-side via AlphaVantage data */}
          <div className="h-48 flex items-center justify-center bg-[#0A0A0F] rounded-lg border border-[#1E1E30]">
            <p className="text-[#505065] text-xs font-mono">
              NQ chart — Configure ALPHA_VANTAGE_API_KEY to enable
            </p>
          </div>
          <p className="text-[9px] text-[#505065] font-mono mt-2 text-center">
            ⚠ Charts for entertainment only. Not financial advice. Past performance does not indicate future results.
          </p>
        </div>

        {/* Watchlist */}
        <div className="bg-[#12121A] border border-[#1E1E30] rounded-lg p-4 mb-6">
          <h2 className="font-bold text-white mb-3">Watchlist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {INSTRUMENTS.map((inst) => (
              <div key={inst.symbol} className="bg-[#1A1A26] border border-[#1E1E30] rounded-lg p-3 flex items-center gap-3">
                <span className="text-2xl font-bold text-[#00E5CC]">{inst.flag}</span>
                <div>
                  <div className="font-bold text-sm text-white">{inst.label}</div>
                  <div className="text-xs text-[#505065] font-mono">{inst.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliate section — ONLY appears on /markets, NOT on content pages */}
        <div className="bg-[#12121A] border border-[#FFD70022] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-whale">Sponsored</span>
            <span className="text-xs text-[#505065] font-mono">Affiliate links — Disclosure: DTP earns commission</span>
          </div>
          <h3 className="font-bold text-white mb-2">Trade the markets you watch</h3>
          <p className="text-[#A0A0B0] text-sm mb-4 leading-relaxed">
            Partner brokers for DTP Whale members. Not financial advice — do your own research.
            Day trading involves substantial risk of loss and is not suitable for all investors.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'Phemex (Crypto Futures)', url: '#', discount: 'Up to 20% fee discount' },
              { name: 'Bybit', url: '#', discount: 'Deposit bonus' },
            ].map((broker) => (
              <a
                key={broker.name}
                href={broker.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex flex-col gap-0.5 px-4 py-2.5 bg-[#1A1A26] border border-[#1E1E30] rounded-lg hover:border-[#FFD70033] transition-colors"
              >
                <span className="text-sm font-semibold text-white">{broker.name}</span>
                <span className="text-xs text-[#FFD700]">{broker.discount}</span>
              </a>
            ))}
          </div>
          <p className="text-[9px] text-[#505065] mt-3">
            ⚠ Trading is risky. Only trade what you can afford to lose. These are affiliate links.
            DTP is not responsible for trading losses.
          </p>
        </div>
      </div>
    </div>
  )
}
