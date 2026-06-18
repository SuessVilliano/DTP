'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, Tooltip, Legend } from 'chart.js'
import 'chartjs-adapter-date-fns'

ChartJS.register(CategoryScale, LinearScale, TimeScale, Tooltip, Legend)

export interface OHLCBar {
  x: number
  o: number
  h: number
  l: number
  c: number
}

interface CandlestickChartProps {
  symbol?: string
  height?: number
  showVolume?: boolean
  miniMode?: boolean
}

const BINANCE_INTERVALS = ['1m', '5m', '15m', '1h', '4h', '1d']

async function fetchKlines(symbol: string, interval: string, limit = 200): Promise<OHLCBar[]> {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch klines')
  const data: Array<[number, string, string, string, string, ...unknown[]]> = await res.json()
  return data.map(([t, o, h, l, c]) => ({ x: t, o: parseFloat(o), h: parseFloat(h), l: parseFloat(l), c: parseFloat(c) }))
}

export function CandlestickChart({ symbol = 'BTCUSDT', height = 400, showVolume = false, miniMode = false }: CandlestickChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [interval, setIntervalVal] = useState('5m')
  const [candles, setCandles] = useState<OHLCBar[]>([])
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const wsRef = useRef<WebSocket | null>(null)

  const loadKlines = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchKlines(symbol, interval)
      setCandles(data)
      if (data.length > 0) {
        const last = data[data.length - 1]
        setCurrentPrice(last.c)
        setPriceChange(((last.c - data[0].o) / data[0].o) * 100)
      }
    } catch (err) { console.error('[klines]', err) }
    finally { setLoading(false) }
  }, [symbol, interval])

  useEffect(() => { loadKlines() }, [loadKlines])

  useEffect(() => {
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
    let ws: WebSocket
    function connect() {
      ws = new WebSocket(wsUrl)
      wsRef.current = ws
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data); const k = msg.k
          if (!k) return
          const newBar: OHLCBar = { x: k.t, o: parseFloat(k.o), h: parseFloat(k.h), l: parseFloat(k.l), c: parseFloat(k.c) }
          setCurrentPrice(newBar.c)
          setCandles((prev) => {
            const updated = [...prev]
            const lastBar = updated[updated.length - 1]
            if (lastBar && lastBar.x === newBar.x) { updated[updated.length - 1] = newBar }
            else if (k.x) { updated.push(newBar); if (updated.length > 300) updated.shift() }
            return updated
          })
        } catch { /* ignore */ }
      }
      ws.onclose = () => setTimeout(connect, 3000)
    }
    connect()
    return () => ws?.close()
  }, [symbol, interval])

  useEffect(() => {
    if (!canvasRef.current || candles.length === 0) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    const W = rect.width; const H = rect.height
    const pL = miniMode ? 8 : 48; const pR = 12; const pT = 12; const pB = miniMode ? 8 : 30
    const chartW = W - pL - pR; const chartH = H - pT - pB
    ctx.fillStyle = miniMode ? 'transparent' : '#12121A'
    ctx.clearRect(0, 0, W, H)
    if (!miniMode) ctx.fillRect(0, 0, W, H)
    const maxPrice = Math.max(...candles.map(c => c.h))
    const minPrice = Math.min(...candles.map(c => c.l))
    const priceRange = maxPrice - minPrice || 1
    const priceToY = (p: number) => pT + chartH - ((p - minPrice) / priceRange) * chartH
    const barWidth = chartW / candles.length
    const candleWidth = Math.max(barWidth * 0.7, 1)
    if (!miniMode) {
      ctx.strokeStyle = 'rgba(30,30,48,0.8)'; ctx.lineWidth = 1
      for (let i = 0; i <= 5; i++) {
        const y = pT + (chartH / 5) * i
        ctx.beginPath(); ctx.moveTo(pL, y); ctx.lineTo(W - pR, y); ctx.stroke()
        const price = maxPrice - (priceRange / 5) * i
        ctx.fillStyle = '#505065'; ctx.font = '10px monospace'; ctx.textAlign = 'right'
        ctx.fillText(price >= 1000 ? price.toLocaleString('en-US', { maximumFractionDigits: 0 }) : price.toFixed(2), pL - 4, y + 4)
      }
    }
    candles.forEach((candle, i) => {
      const x = pL + i * barWidth; const isGreen = candle.c >= candle.o
      const color = isGreen ? '#26a69a' : '#ef5350'
      ctx.fillStyle = color; ctx.strokeStyle = color
      const openY = priceToY(candle.o); const closeY = priceToY(candle.c)
      const highY = priceToY(candle.h); const lowY = priceToY(candle.l)
      const bodyTop = Math.min(openY, closeY); const bodyHeight = Math.max(Math.abs(closeY - openY), 1)
      const centerX = x + barWidth / 2
      ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(centerX, highY); ctx.lineTo(centerX, lowY); ctx.stroke()
      ctx.fillRect(x + (barWidth - candleWidth) / 2, bodyTop, candleWidth, bodyHeight)
    })
    if (currentPrice) {
      const y = priceToY(currentPrice)
      ctx.strokeStyle = 'rgba(0, 229, 204, 0.6)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4])
      ctx.beginPath(); ctx.moveTo(pL, y); ctx.lineTo(W - pR, y); ctx.stroke(); ctx.setLineDash([])
    }
    if (miniMode) { ctx.fillStyle = 'rgba(0,229,204,0.6)'; ctx.font = '8px monospace'; ctx.textAlign = 'left'; ctx.fillText('Entertainment only. Not financial advice.', 4, H - 4) }
  }, [candles, currentPrice, miniMode])

  const displaySymbol = symbol.replace('USDT', '/USD')

  return (
    <div className={`relative ${miniMode ? '' : 'bg-[#12121A] border border-[#1E1E30] rounded-lg'}`} style={{ height }}>
      {!miniMode && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E30]">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-white">{displaySymbol}</span>
            {currentPrice && (
              <>
                <span className="font-mono text-lg font-bold text-white">${currentPrice >= 1000 ? currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 }) : currentPrice.toFixed(4)}</span>
                <span className={`text-sm font-mono ${priceChange >= 0 ? 'text-[#00FF88]' : 'text-[#FF3366]'}`}>{priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%</span>
              </>
            )}
          </div>
          <div className="flex gap-1">
            {BINANCE_INTERVALS.map((iv) => (
              <button key={iv} onClick={() => setIntervalVal(iv)} className={`px-2 py-1 text-xs font-mono rounded transition-colors ${interval === iv ? 'bg-[#00E5CC] text-[#0A0A0F] font-bold' : 'text-[#505065] hover:text-white hover:bg-[#1A1A26]'}`}>{iv.toUpperCase()}</button>
            ))}
          </div>
        </div>
      )}
      <div className="relative" style={{ height: miniMode ? height : height - 52 }}>
        {loading && <div className="absolute inset-0 flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#00E5CC] border-t-transparent rounded-full animate-spin" /></div>}
        <canvas ref={canvasRef} className="w-full h-full" style={{ display: loading ? 'none' : 'block' }} />
      </div>
      {!miniMode && <div className="absolute bottom-2 left-0 right-0 text-center"><span className="text-[10px] text-[#505065] font-mono">Charts for entertainment only. Not financial advice. Data: Binance</span></div>}
    </div>
  )
}
