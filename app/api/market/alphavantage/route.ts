import { NextRequest, NextResponse } from 'next/server'

// Alpha Vantage proxy — for NQ futures and stock data
// Free tier: 25 requests/day, 5 requests/minute
// DISCLAIMER: Data is for entertainment only. Not financial advice.

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const symbol = searchParams.get('symbol') || 'NQ'
  const interval = searchParams.get('interval') || '5min'
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Alpha Vantage API key not configured', disclaimer: 'Set ALPHA_VANTAGE_API_KEY in .env' },
      { status: 503 }
    )
  }

  try {
    const avSymbol = symbol === 'NQ' ? 'QQQ' : symbol
    const avUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${avSymbol}&interval=${interval}&apikey=${apiKey}&outputsize=compact`

    const res = await fetch(avUrl, { next: { revalidate: 300 } })

    if (!res.ok) {
      return NextResponse.json({ error: 'Alpha Vantage API error' }, { status: res.status })
    }

    const data = await res.json()

    if (data['Note']) {
      return NextResponse.json({ error: 'API rate limit exceeded. Try again in 1 minute.', raw: data }, { status: 429 })
    }

    const timeSeries = data[`Time Series (${interval})`]
    if (!timeSeries) {
      return NextResponse.json({ error: 'No data returned', raw: data }, { status: 404 })
    }

    const ohlc = Object.entries(timeSeries)
      .slice(0, 200)
      .reverse()
      .map(([timestamp, values]) => {
        const v = values as Record<string, string>
        return { t: new Date(timestamp).getTime(), o: parseFloat(v['1. open']), h: parseFloat(v['2. high']), l: parseFloat(v['3. low']), c: parseFloat(v['4. close']), vol: parseFloat(v['5. volume']) }
      })

    return NextResponse.json(
      { symbol: avSymbol, displaySymbol: symbol, interval, ohlc, disclaimer: 'Data for entertainment purposes only. 15-min delay. NOT financial advice.', source: 'Alpha Vantage' },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    )
  } catch (error) {
    console.error('[alphavantage]', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
