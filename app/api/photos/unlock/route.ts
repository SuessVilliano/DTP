import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const { photo_id } = body
  if (!photo_id) {
    return NextResponse.json({ error: 'photo_id is required' }, { status: 400 })
  }

  // Idempotent: already purchased
  const { data: existing } = await supabaseAdmin
    .from('photo_purchases')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('photo_id', photo_id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ success: true, already_owned: true })
  }

  // Fetch photo to get price
  const { data: photo, error: photoErr } = await supabaseAdmin
    .from('photos')
    .select('id, price, creator_id')
    .eq('id', photo_id)
    .maybeSingle()

  if (photoErr || !photo) {
    return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
  }

  // Record purchase (payment verification plugged in here in production)
  const { error: purchaseErr } = await supabaseAdmin
    .from('photo_purchases')
    .insert({
      user_id: session.user.id,
      photo_id: photo.id,
      amount: photo.price,
    })

  if (purchaseErr) {
    return NextResponse.json({ error: 'Purchase failed', detail: purchaseErr.message }, { status: 500 })
  }

  // Award XP for purchase
  await supabaseAdmin.rpc('increment_xp', { p_user_id: session.user.id, p_amount: 50 }).maybeSingle()

  return NextResponse.json({ success: true })
}
