import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const symbol = searchParams.get('symbol') || 'BTCUSDT'
  const interval = searchParams.get('interval') || '1m'
  const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000)

  try {
    const binanceUrl = `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
    const res = await fetch(binanceUrl, { headers: { 'User-Agent': 'DTP/1.0' }, cache: 'no-store' })

    if (!res.ok) {
      console.error('[binance proxy]', res.status)
      return NextResponse.json({ error: `Binance API error: ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    const ohlc = data.map((k: (string | number)[]) => ({
      t: Number(k[0]),
      o: parseFloat(k[1] as string),
      h: parseFloat(k[2] as string),
      l: parseFloat(k[3] as string),
      c: parseFloat(k[4] as string),
      v: parseFloat(k[5] as string),
    }))

    return NextResponse.json(ohlc, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  } catch (error) {
    console.error('[binance proxy]', error)
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}
