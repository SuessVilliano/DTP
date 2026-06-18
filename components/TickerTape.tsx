'use client'

import { useEffect, useRef, useState } from 'react'

interface TickerItem {
  symbol: string
  price: number
  change: number
  changePct: number
}

const DEFAULT_TICKERS: TickerItem[] = [
  { symbol: 'BTC/USD', price: 67800, change: 1250, changePct: 1.88 },
  { symbol: 'ETH/USD', price: 3420, change: 85, changePct: 2.55 },
  { symbol: 'SOL/USD', price: 178.5, change: -3.2, changePct: -1.76 },
  { symbol: 'NQ/F', price: 19850, change: 125, changePct: 0.63 },
  { symbol: 'BNB/USD', price: 595, change: 12, changePct: 2.06 },
  { symbol: 'XRP/USD', price: 0.654, change: 0.021, changePct: 3.32 },
  { symbol: 'DOGE/USD', price: 0.185, change: -0.008, changePct: -4.15 },
]

const BINANCE_SYMBOLS = ['btcusdt', 'ethusdt', 'solusdt', 'bnbusdt', 'xrpusdt', 'dogeusdt']

export function TickerTape() {
  const [tickers, setTickers] = useState<TickerItem[]>(DEFAULT_TICKERS)
  const wsRef = useRef<WebSocket | null>(null)
  const tickerMapRef = useRef<Map<string, TickerItem>>(new Map(DEFAULT_TICKERS.map(t => [t.symbol, t])))

  useEffect(() => {
    const streams = BINANCE_SYMBOLS.map(s => `${s}@ticker`).join('/')
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`
    let ws: WebSocket
    let reconnectTimer: ReturnType<typeof setTimeout>

    function connect() {
      try {
        ws = new WebSocket(wsUrl)
        wsRef.current = ws
        ws.onmessage = (event) => {
          try {
            const { data } = JSON.parse(event.data)
            if (!data) return
            const symbolMap: Record<string, string> = { BTCUSDT: 'BTC/USD', ETHUSDT: 'ETH/USD', SOLUSDT: 'SOL/USD', BNBUSDT: 'BNB/USD', XRPUSDT: 'XRP/USD', DOGEUSDT: 'DOGE/USD' }
            const displaySymbol = symbolMap[data.s]
            if (!displaySymbol) return
            tickerMapRef.current.set(displaySymbol, { symbol: displaySymbol, price: parseFloat(data.c), change: parseFloat(data.p), changePct: parseFloat(data.P) })
            setTickers([...tickerMapRef.current.values()])
          } catch { /* ignore */ }
        }
        ws.onclose = () => { reconnectTimer = setTimeout(connect, 5000) }
        ws.onerror = () => { ws.close() }
      } catch { reconnectTimer = setTimeout(connect, 5000) }
    }

    connect()
    return () => { clearTimeout(reconnectTimer); ws?.close() }
  }, [])

  function formatPrice(price: number, symbol: string): string {
    if (symbol.includes('BTC') || symbol.includes('NQ') || symbol.includes('ETH')) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    if (price < 1) return price.toFixed(4)
    return price.toFixed(2)
  }

  const displayTickers = [...tickers, ...tickers]

  return (
    <div className="w-full bg-[#12121A] border-b border-[#1E1E30] overflow-hidden py-1.5 select-none z-30">
      <div className="flex gap-6 whitespace-nowrap" style={{ animation: 'ticker 40s linear infinite', display: 'inline-flex', width: 'max-content' }}>
        {displayTickers.map((ticker, i) => (
          <span key={`${ticker.symbol}-${i}`} className="flex items-center gap-1.5 text-xs font-mono px-2">
            <span className="text-[#A0A0B0] font-semibold">{ticker.symbol}</span>
            <span className="text-white font-bold">${formatPrice(ticker.price, ticker.symbol)}</span>
            <span className={`font-semibold ${ticker.changePct >= 0 ? 'text-[#00FF88]' : 'text-[#FF3366]'}`}>{ticker.changePct >= 0 ? '▲' : '▼'} {Math.abs(ticker.changePct).toFixed(2)}%</span>
            <span className="text-[#1E1E30] mx-1">|</span>
          </span>
        ))}
      </div>
    </div>
  )
}
