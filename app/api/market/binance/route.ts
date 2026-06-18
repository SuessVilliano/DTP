import { NextResponse } from 'next/server'

export const revalidate = 30

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = (searchParams.get('symbol') || 'BTCUSDT').toUpperCase()
  const interval = searchParams.get('interval') || '1h'
  const limit = Math.min(Number(searchParams.get('limit') || '100'), 500)

  try {
    const res = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
      { next: { revalidate: 30 } }
    )
    if (!res.ok) throw new Error(`Binance ${res.status}`)
    const raw: any[][] = await res.json()

    const candles = raw.map(k => ({
      t: k[0],          // open time ms
      o: parseFloat(k[1]),
      h: parseFloat(k[2]),
      l: parseFloat(k[3]),
      c: parseFloat(k[4]),
      v: parseFloat(k[5]),
      tc: k[6],         // close time ms
    }))

    return NextResponse.json(candles, {
      headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Market data temporarily unavailable', detail: err.message },
      { status: 503 }
    )
  }
}
