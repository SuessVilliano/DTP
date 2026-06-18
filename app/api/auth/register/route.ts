import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role bypasses RLS
)

export async function POST(req: NextRequest) {
  try {
    const { email, password, username } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // 1. Create user in Supabase Auth (email confirm disabled — users get immediate access)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // auto-confirm so no email verification needed
      user_metadata: { username: username || email.split('@')[0] },
    })

    if (authError) {
      console.error('[register] Supabase auth error:', authError)
      if (authError.message?.includes('already registered') || authError.message?.includes('already exists')) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
      }
      return NextResponse.json({ error: authError.message || 'Registration failed' }, { status: 400 })
    }

    const userId = authData.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'User creation failed' }, { status: 500 })
    }

    // 2. Create profile row in public.users table
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: userId,
        email,
        username: username || email.split('@')[0],
        role: 'free',
        created_at: new Date().toISOString(),
      }, { onConflict: 'id' })

    if (profileError) {
      console.error('[register] Profile creation error:', profileError)
      // Don't fail — auth user was created, profile can be created on next login
    }

    return NextResponse.json(
      { success: true, message: 'Account created successfully', userId },
      { status: 201 }
    )
  } catch (error) {
    console.error('[register] Unexpected error:', error)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
