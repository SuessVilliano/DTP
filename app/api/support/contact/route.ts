import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'name, email, and message are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (message.length < 10) {
      return NextResponse.json({ error: 'Message too short' }, { status: 400 })
    }

    // Try to store in Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseServiceKey) {
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/support_tickets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
            status: 'open',
            source: 'website',
          }),
        })
        if (!res.ok) {
          console.error('[support/contact] Supabase insert failed:', res.status)
        }
      } catch (dbErr) {
        // Don't fail the request if DB is down -- log and continue
        console.error('[support/contact] DB error:', dbErr)
      }
    }

    // TODO: send notification email via SendGrid/Resend when configured
    // await sendNotificationEmail({ to: 'support@daytraderporn.com', name, email, message })

    return NextResponse.json({
      success: true,
      message: 'Support ticket submitted. We will respond within 24 hours.',
    })
  } catch (error) {
    console.error('[support/contact]', error)
    return NextResponse.json({ error: 'Failed to submit support ticket' }, { status: 500 })
  }
}
