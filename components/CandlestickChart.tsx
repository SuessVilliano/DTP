'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface OHLCBar { x: number; o: number; h: number; l: number; c: number }

interface CandlestickChartProps {
  symbol?: string
  height?: number
  showVolume?: boolean
  miniMode?: boolean
}

const INTERVALS = ['1m', '5m', '15m', '1h', '4h', '1d']

async function fetchKlines(symbol: string, interval: string): Promise<OHLCBar[]> {
  const res = await fetch(`/api/market/binance?symbol=${symbol}&interval=${interval}&limit=100`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch')
  const data: Array<{ t: number; o: number; h: number; l: number; c: number }> = await res.json()
  if (!Array.isArray(data)) throw new Error('Invalid data')
  return data.map((k) => ({ x: k.t, o: k.o, h: k.h, l: k.l, c: k.c }))
}

export function CandlestickChart({ symbol = 'BTCUSDT', height = 400, miniMode = false }: CandlestickChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [interval, setIntervalVal] = useState('5m')
  const [candles, setCandles] = useState<OHLCBar[]>([])
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastKnownPrice, setLastKnownPrice] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadData = useCallback(async () => {
    try {
      const data = await fetchKlines(symbol, interval)
      setCandles(data)
      setError(null)
      if (data.length > 0) {
        const latest = data[data.length - 1]
        setCurrentPrice(latest.c)
        setLastKnownPrice(latest.c)
        setPriceChange(((latest.c - data[0].o) / data[0].o) * 100)
      }
    } catch { setError('Live data unavailable') }
    finally { setLoading(false) }
  }, [symbol, interval])

  useEffect(() => {
    setLoading(true)
    loadData()
    intervalRef.current = setInterval(loadData, 30_000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [loadData])

  useEffect(() => {
    if (!canvasRef.current || candles.length === 0) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const w = canvas.offsetWidth || 600
    canvas.width = w; canvas.height = height
    ctx.clearRect(0, 0, w, height)
    ctx.fillStyle = '#0A0A0F'; ctx.fillRect(0, 0, w, height)

    const prices = candles.flatMap(c => [c.h, c.l])
    const minP = Math.min(...prices), maxP = Math.max(...prices)
    const range = maxP - minP || 1
    const padX = miniMode ? 4 : 8, padY = 20
    const chartW = w - padX * 2, chartH = height - padY * 2
    const barW = Math.max(1, chartW / candles.length - 1)

    candles.forEach((c, i) => {
      const x = padX + i * (chartW / candles.length)
      const bull = c.c >= c.o
      ctx.strokeStyle = bull ? '#00E5CC' : '#FF3366'; ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x + barW / 2, padY + ((maxP - c.h) / range) * chartH)
      ctx.lineTo(x + barW / 2, padY + ((maxP - c.l) / range) * chartH)
      ctx.stroke()
      ctx.fillStyle = bull ? 'rgba(0,229,204,0.8)' : 'rgba(255,51,102,0.8)'
      const bodyTop = padY + ((maxP - Math.max(c.o, c.c)) / range) * chartH
      ctx.fillRect(x, bodyTop, barW, Math.max(Math.abs(((c.c - c.o) / range) * chartH), 1))
    })
    if (!miniMode) {
      ctx.fillStyle = '#505065'; ctx.font = '10px monospace'
      ctx.fillText(maxP.toFixed(0), 2, padY + 10)
      ctx.fillText(minP.toFixed(0), 2, height - padY + 10)
    }
  }, [candles, height, miniMode])

  if (loading) return <div className="w-full rounded-xl bg-[#12121A] border border-[#1E1E30] animate-pulse" style={{ height }} />

  return (
    <div className="w-full rounded-xl overflow-hidden bg-[#0A0A0F] border border-[#1E1E30]">
      {!miniMode && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#1E1E30]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white">{symbol}</span>
            {error ? (
              <span className="text-xs text-[#FF3366]">⚠ {error}{lastKnownPrice ? ` — last: $${lastKnownPrice.toLocaleString()}` : ''}</span>
            ) : currentPrice !== null ? (
              <>
                <span className="text-sm font-mono text-white">${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                <span className={`text-xs font-medium ${priceChange >= 0 ? 'text-[#00E5CC]' : 'text-[#FF3366]'}`}>{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%</span>
              </>
            ) : null}
          </div>
          <div className="flex gap-1">
            {INTERVALS.map(iv => (
              <button key={iv} onClick={() => setIntervalVal(iv)} className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${interval === iv ? 'bg-[#00E5CC]/20 text-[#00E5CC]' : 'text-[#505065] hover:text-white'}`}>{iv}</button>
            ))}
          </div>
        </div>
      )}
      <canvas ref={canvasRef} style={{ width: '100%', height }} />
    </div>
  )
}
