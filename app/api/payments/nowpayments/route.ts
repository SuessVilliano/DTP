import { NextRequest, NextResponse } from 'next/server'

// NOWPayments API integration
// Docs: https://documenter.getpostman.com/view/7907941/2s93JtQPoc

interface NOWPaymentsInvoice {
  id: string
  invoice_url: string
  status: string
  pay_currency: string
  pay_amount: number
  price_amount: number
  price_currency: string
  created_at: string
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.NOWPAYMENTS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Payment service not configured' }, { status: 503 })
  }

  try {
    const { videoId, amount, currency = 'usd', description } = await req.json()

    if (!videoId || !amount) {
      return NextResponse.json({ error: 'videoId and amount required' }, { status: 400 })
    }

    const invoicePayload = {
      price_amount: parseFloat(amount),
      price_currency: currency,
      pay_currency: 'sol',
      order_id: `dtp-${videoId}-${Date.now()}`,
      order_description: description || `DTP PPV: ${videoId}`,
      ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/nowpayments/webhook`,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/watch/${videoId}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/watch/${videoId}?payment=cancelled`,
      is_fixed_rate: false,
      is_fee_paid_by_user: false,
    }

    const res = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoicePayload),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('[nowpayments create]', res.status, error)
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: res.status })
    }

    const invoice: NOWPaymentsInvoice = await res.json()

    return NextResponse.json({
      id: invoice.id,
      invoice_url: invoice.invoice_url,
      status: invoice.status,
      amount,
      currency,
    })
  } catch (error) {
    console.error('[nowpayments]', error)
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.NOWPAYMENTS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Payment service not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(req.url)
  const paymentId = searchParams.get('id')

  if (!paymentId) {
    return NextResponse.json({ error: 'Payment ID required' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://api.nowpayments.io/v1/payment/${paymentId}`, {
      headers: { 'x-api-key': apiKey },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to check payment status' }, { status: res.status })
    }

    const payment = await res.json()
    return NextResponse.json({
      id: payment.payment_id,
      status: payment.payment_status,
      confirmed: ['confirmed', 'finished'].includes(payment.payment_status),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Status check failed' }, { status: 500 })
  }
}
