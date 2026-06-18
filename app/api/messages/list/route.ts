import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const creatorId = searchParams.get('creator_id')
  if (!creatorId) return NextResponse.json({ error: 'creator_id required' }, { status: 400 })

  const userId = (session.user as { id: string }).id

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(from_user_id.eq.${userId},to_creator_id.eq.${creatorId}),and(from_user_id.eq.${creatorId},to_creator_id.eq.${userId})`)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ messages: data })
}
