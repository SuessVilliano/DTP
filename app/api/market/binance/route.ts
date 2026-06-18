import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const symbol = searchParams.get('symbol') || 'BTCUSDT'
  const interval = searchParams.get('interval') || '5m'
  const limit = Math.min(parseInt(searchParams.get('limit') || '200'), 1000)

  try {
    const binanceUrl = `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
    const res = await fetch(binanceUrl, { headers: { 'User-Agent': 'DTP/1.0' }, next: { revalidate: 60 } })

    if (!res.ok) {
      const error = await res.text()
      console.error('[binance proxy]', res.status, error)
      return NextResponse.json({ error: `Binance API error: ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    const ohlc = data.map((k: number[]) => ({
      t: k[0],
      o: parseFloat(k[1] as unknown as string),
      h: parseFloat(k[2] as unknown as string),
      l: parseFloat(k[3] as unknown as string),
      c: parseFloat(k[4] as unknown as string),
      v: parseFloat(k[5] as unknown as string),
    }))

    return NextResponse.json(ohlc, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } })
  } catch (error) {
    console.error('[binance proxy]', error)
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}
