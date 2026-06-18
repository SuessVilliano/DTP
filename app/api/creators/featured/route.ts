import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 300

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('creators')
      .select('username, display_name, bio, avatar_url, is_live, subscriber_count, verified')
      .not('approved_at', 'is', null)
      .order('subscriber_count', { ascending: false })
      .limit(6)

    if (error) throw error

    return NextResponse.json(
      { creators: data || [] },
      { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } }
    )
  } catch {
    return NextResponse.json({ creators: [] })
  }
}
