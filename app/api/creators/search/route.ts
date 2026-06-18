import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const sort = (searchParams.get('sort') || 'popular') as 'popular' | 'new' | 'live'
  const filter = searchParams.get('filter') || ''

  try {
    let query = supabase
      .from('creators')
      .select('username, display_name, bio, avatar_url, is_live, subscriber_count, verified, approved_at')
      .not('approved_at', 'is', null)
      .limit(24)

    if (q) {
      query = query.or(`username.ilike.%${q}%,display_name.ilike.%${q}%,bio.ilike.%${q}%`)
    }

    if (filter === 'live_now') {
      query = query.eq('is_live', true)
    } else if (filter === 'verified') {
      query = query.eq('verified', true)
    }

    if (sort === 'popular') {
      query = query.order('subscriber_count', { ascending: false })
    } else if (sort === 'new') {
      query = query.order('approved_at', { ascending: false })
    } else if (sort === 'live') {
      query = query.order('is_live', { ascending: false }).order('subscriber_count', { ascending: false })
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ creators: data || [] })
  } catch {
    return NextResponse.json({ creators: [] })
  }
}
