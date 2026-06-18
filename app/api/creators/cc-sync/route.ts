import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { createHmac } from 'crypto'

// CreatorCommand.club webhook endpoint
// CC posts to this endpoint when it needs to sync data

export async function POST(req: NextRequest) {
  // Verify webhook signature from CreatorCommand.club
  const signature = req.headers.get('x-cc-signature')
  const body = await req.text()

  const expectedSig = createHmac('sha256', process.env.CC_WEBHOOK_SECRET || '')
    .update(body)
    .digest('hex')

  if (signature !== `sha256=${expectedSig}`) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(body)
  const { event, data } = payload
  const supabase = getSupabaseAdmin()

  switch (event) {
    case 'creator.sync_request': {
      // CC is requesting this creator's DTP earnings data
      const { creatorEmail } = data
      const { data: creator } = await supabase
        .from('creators')
        .select('id, total_earnings_usd, total_tips_sol, subscriber_count')
        .eq('user_id', (
          await supabase.from('users').select('id').eq('email', creatorEmail).single()
        ).data?.id || '')
        .single()

      if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 })

      return NextResponse.json({
        platform: 'dtp',
        creatorId: creator.id,
        earnings: {
          totalUsd: creator.total_earnings_usd,
          totalSol: creator.total_tips_sol,
          subscribers: creator.subscriber_count,
          currency: 'SOL/USD',
        },
      })
    }

    case 'creator.content_categories': {
      // CC wants content categories to generate trading-themed captions
      const { creatorId } = data
      const { data: content } = await supabase
        .from('content')
        .select('category, tags')
        .eq('creator_id', creatorId)
        .limit(20)

      const categories = [...new Set(content?.map(c => c.category) || [])]
      const tags = [...new Set(content?.flatMap(c => c.tags) || [])]

      return NextResponse.json({ categories, tags, platform: 'dtp' })
    }

    default:
      return NextResponse.json({ received: true, event })
  }
}

// DTP → CC: invite new creator to CreatorCommand.club
export async function PUT(req: NextRequest) {
  const { creatorEmail, creatorName, applicationId } = await req.json()

  if (!process.env.CC_API_KEY || !process.env.CC_API_URL) {
    return NextResponse.json({
      note: 'CreatorCommand.club integration not configured. Set CC_API_KEY and CC_API_URL in .env',
      inviteStatus: 'skipped',
    })
  }

  try {
    const res = await fetch(`${process.env.CC_API_URL}/api/invites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CC_API_KEY}`,
      },
      body: JSON.stringify({
        email: creatorEmail,
        name: creatorName,
        source: 'dtp',
        sourceId: applicationId,
        role: 'creator',
      }),
    })

    if (!res.ok) throw new Error(`CC API error: ${res.status}`)
    const result = await res.json()
    return NextResponse.json({ success: true, ccInviteId: result.id })
  } catch (err) {
    console.error('[cc-sync invite]', err)
    return NextResponse.json({ error: 'CC invite failed', details: String(err) }, { status: 500 })
  }
}
