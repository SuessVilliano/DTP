'use client'

import { useEffect, useRef, useState } from 'react'

interface TickerItem { symbol: string; price: number; change: number; changePct: number }

const DEFAULT_TICKERS: TickerItem[] = [
  { symbol: 'BTC/USD', price: 67800, change: 1250, changePct: 1.88 },
  { symbol: 'ETH/USD', price: 3420, change: 85, changePct: 2.55 },
  { symbol: 'SOL/USD', price: 178.5, change: -3.2, changePct: -1.76 },
  { symbol: 'NQ/F', price: 19850, change: 125, changePct: 0.63 },
  { symbol: 'BNB/USD', price: 595, change: 12, changePct: 2.06 },
  { symbol: 'XRP/USD', price: 0.654, change: 0.021, changePct: 3.32 },
]

const SYMBOL_MAP: Record<string, string> = {
  btcusdt: 'BTC/USD', ethusdt: 'ETH/USD', solusdt: 'SOL/USD',
  bnbusdt: 'BNB/USD', xrpusdt: 'XRP/USD', dogeusdt: 'DOGE/USD',
}

export function TickerTape() {
  const [tickers, setTickers] = useState<TickerItem[]>(DEFAULT_TICKERS)
  const wsRef = useRef<WebSocket | null>(null)
  const tickerMapRef = useRef<Map<string, TickerItem>>(new Map(DEFAULT_TICKERS.map(t => [t.symbol, t])))

  useEffect(() => {
    const streams = Object.keys(SYMBOL_MAP).map(s => `${s}@ticker`).join('/')
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`
    let ws: WebSocket, reconnectTimer: ReturnType<typeof setTimeout>

    function connect() {
      try {
        ws = new WebSocket(wsUrl)
        wsRef.current = ws
        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data)
            const d = msg.data || msg
            const streamSymbol = (msg.stream || '').replace('@ticker', '').toLowerCase()
            const displaySymbol = SYMBOL_MAP[streamSymbol] || SYMBOL_MAP[d.s?.toLowerCase()]
            if (!displaySymbol) return
            const item: TickerItem = { symbol: displaySymbol, price: parseFloat(d.c || 0), change: parseFloat(d.p || 0), changePct: parseFloat(d.P || 0) }
            tickerMapRef.current.set(displaySymbol, item)
            setTickers(Array.from(tickerMapRef.current.values()))
          } catch {}
        }
        ws.onerror = () => {}
        ws.onclose = () => { reconnectTimer = setTimeout(connect, 5000) }
      } catch { reconnectTimer = setTimeout(connect, 5000) }
    }

    connect()
    return () => { clearTimeout(reconnectTimer); wsRef.current?.close() }
  }, [])

  const displayTickers = [...tickers, ...tickers]

  return (
    <div className="w-full overflow-hidden bg-[#0A0A0F] border-b border-[#1E1E30] py-1.5">
      <div className="ticker-scroll flex gap-8 whitespace-nowrap">
        {displayTickers.map((t, i) => (
          <span key={`${t.symbol}-${i}`} className="inline-flex items-center gap-2 text-xs">
            <span className="text-[#505065] font-medium">{t.symbol}</span>
            <span className="text-white font-mono font-medium">${t.price < 1 ? t.price.toFixed(4) : t.price < 100 ? t.price.toFixed(2) : t.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className={`font-medium ${t.changePct >= 0 ? 'text-[#00E5CC]' : 'text-[#FF3366]'}`}>{t.changePct >= 0 ? '+' : ''}{t.changePct.toFixed(2)}%</span>
          </span>
        ))}
      </div>
    </div>
  )
}
