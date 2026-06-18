import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DEFAULT_BADGES = [
  { id: 'welcome', name: 'Welcome to DTP', description: 'Created your account', icon: '🎉', rarity: 'common', earned_at: new Date().toISOString() },
]

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data } = await supabase
    .from('user_xp')
    .select('total_xp, level, badges')
    .eq('user_id', session.user.id)
    .maybeSingle()

  return NextResponse.json({
    xp: data?.total_xp ?? 0,
    level: data?.level ?? 1,
    badges: data?.badges ?? DEFAULT_BADGES,
  })
}
