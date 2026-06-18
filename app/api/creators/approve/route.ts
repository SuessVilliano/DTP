import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getSupabaseAdmin } from '@/lib/supabase'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if ((session?.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { applicationId, action, rejectReason } = await req.json()

  if (!applicationId || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  if (action === 'reject') {
    await supabase.from('creator_applications').update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: (session?.user as { id?: string })?.id || null,
      reject_reason: rejectReason || null,
    }).eq('id', applicationId)
    return NextResponse.json({ success: true, action: 'rejected' })
  }

  // APPROVE: generate 32-byte hex invite token (7-day expiry)
  const inviteToken = randomBytes(32).toString('hex')
  const inviteExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const { data: app } = await supabase
    .from('creator_applications')
    .select('email, name')
    .eq('id', applicationId)
    .single()

  if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

  await supabase.from('creator_applications').update({
    status: 'approved',
    reviewed_at: new Date().toISOString(),
    reviewed_by: (session?.user as { id?: string })?.id || null,
    invite_token: inviteToken,
    invite_sent_at: new Date().toISOString(),
    invite_expires_at: inviteExpiry.toISOString(),
  }).eq('id', applicationId)

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/creator/setup?token=${inviteToken}`

  // TODO: Send approval email with invite link
  // await sendApprovalEmail({ to: app.email, name: app.name, inviteUrl })

  return NextResponse.json({
    success: true,
    action: 'approved',
    inviteUrl,
    note: 'TODO: wire up email sending (Resend, SendGrid, or Postmark)',
  })
}
