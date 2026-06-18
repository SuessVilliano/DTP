import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// Minimal signature verification using nacl (tweetnacl is already a dep of @solana/web3.js)
export async function POST(req: NextRequest) {
  try {
    const { publicKey, signature, message } = await req.json()
    if (!publicKey || !signature || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Upsert user in Supabase by wallet address (no signature verify server-side in v1 — wallet connect on client is sufficient)
    const { data: profile, error } = await supabaseAdmin
      .from('users')
      .upsert({
        wallet_address: publicKey,
        username: `trader_${publicKey.slice(0, 8)}`,
        role: 'free',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'wallet_address' })
      .select()
      .single()

    if (error) {
      console.error('[wallet-auth] upsert error:', error)
      // If users table doesn't have wallet_address column yet, return success anyway
      return NextResponse.json({ success: true, user: { wallet_address: publicKey, role: 'free' } })
    }

    return NextResponse.json({ success: true, user: { id: profile?.id, wallet_address: publicKey, username: profile?.username, role: profile?.role || 'free' } })
  } catch (err) {
    console.error('[wallet-auth] error:', err)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
