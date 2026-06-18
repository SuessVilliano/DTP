import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// TipLink API integration for SOL tipping
// Docs: https://docs.tiplink.io/api

export async function POST(req: NextRequest) {
  const apiKey = process.env.TIPLINK_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'TipLink not configured' }, { status: 503 })
  }

  try {
    const {
      videoId,
      creatorId,
      recipientWallet,
      amount,
      isTip = false,
    } = await req.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const sessionId = uuidv4()

    const tipLinkPayload = {
      apiKey,
      amount: amount.toString(),
      currency: 'USD',
      ...(recipientWallet && { recipientWalletAddress: recipientWallet }),
      memo: isTip
        ? `DTP Tip for @${creatorId}`
        : `DTP PPV: ${videoId}`,
      externalId: sessionId,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/tiplink/webhook`,
    }

    const res = await fetch('https://api.tiplink.io/api/v1/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(tipLinkPayload),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('[tiplink create]', res.status, error)

      const fallbackUrl = `https://tiplink.io/i#amount=${amount}&currency=USD&memo=${encodeURIComponent(`DTP ${isTip ? 'Tip' : 'PPV'}: ${videoId || creatorId}`)}`

      return NextResponse.json({
        url: fallbackUrl,
        sessionId,
        fallback: true,
      })
    }

    const data = await res.json()

    return NextResponse.json({
      url: data.url,
      sessionId,
      linkId: data.id,
    })
  } catch (error) {
    console.error('[tiplink]', error)
    return NextResponse.json({ error: 'TipLink creation failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('sessionId')
  const apiKey = process.env.TIPLINK_API_KEY

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }

  try {
    if (apiKey) {
      const res = await fetch(`https://api.tiplink.io/api/v1/links?externalId=${sessionId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })

      if (res.ok) {
        const data = await res.json()
        const completed = data.status === 'paid' || data.status === 'claimed'
        return NextResponse.json({ completed, status: data.status })
      }
    }

    return NextResponse.json({ completed: false, status: 'pending' })
  } catch {
    return NextResponse.json({ completed: false, status: 'error' })
  }
}
