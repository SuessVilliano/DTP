import { NextRequest, NextResponse } from 'next/server'

// x402 Protocol — USDC micropayments via Coinbase Base
// Docs: https://x402.org | https://docs.cdp.coinbase.com

export async function POST(req: NextRequest) {
  try {
    const { videoId, amount } = await req.json()

    if (!videoId) {
      return NextResponse.json({ error: 'videoId required' }, { status: 400 })
    }

    const paymentAmount = amount || 4.99
    const usdcAmount = (paymentAmount * 1_000_000).toString() // USDC has 6 decimals

    // Base USDC contract address (mainnet)
    const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
    const receivingAddress = process.env.X402_RECEIVING_ADDRESS || '0xYOUR_RECEIVING_ADDRESS'

    const paymentDetails = {
      network: 'base',
      scheme: 'exact',
      maxAmountRequired: usdcAmount,
      resource: `${process.env.NEXT_PUBLIC_APP_URL}/watch/${videoId}`,
      description: `DTP PPV: ${videoId}`,
      mimeType: 'application/json',
      payTo: receivingAddress,
      maxTimeoutSeconds: 300,
      asset: USDC_BASE,
      outputSchema: {
        type: 'object',
        properties: {
          access_token: { type: 'string' },
        },
      },
      extra: {
        name: 'Day Trader Porn PPV',
        version: '1.0',
      },
    }

    return NextResponse.json(
      {
        paymentRequired: true,
        paymentDetails,
        message: 'Payment required. Send USDC on Base to access this content.',
        accepts: [paymentDetails],
      },
      {
        status: 402,
        headers: {
          'X-Payment-Required': JSON.stringify(paymentDetails),
          'Accept-Payment': 'x402',
        },
      }
    )
  } catch (error) {
    console.error('[x402]', error)
    return NextResponse.json({ error: 'Payment init failed' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { videoId, paymentProof, paymentToken } = await req.json()

    if (!paymentProof) {
      return NextResponse.json({ error: 'Payment proof required' }, { status: 400 })
    }

    const facilitatorUrl = process.env.X402_FACILITATOR_URL || 'https://x402.org/facilitator'

    const verifyRes = await fetch(`${facilitatorUrl}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment: paymentProof }),
    })

    if (!verifyRes.ok) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 402 })
    }

    const verification = await verifyRes.json()

    if (!verification.isValid) {
      return NextResponse.json({ error: 'Invalid payment', details: verification }, { status: 402 })
    }

    return NextResponse.json({
      success: true,
      accessGranted: true,
      videoId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
  } catch (error) {
    console.error('[x402 verify]', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
