import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { channelName, uid } = await req.json()
  if (!channelName) return NextResponse.json({ error: 'channelName required' }, { status: 400 })

  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID
  if (!appId) return NextResponse.json({ error: 'Agora not configured. Set NEXT_PUBLIC_AGORA_APP_ID.' }, { status: 500 })

  // Production: npm install agora-access-token --legacy-peer-deps
  // import { RtcTokenBuilder, RtcRole } from 'agora-access-token'
  // const token = RtcTokenBuilder.buildTokenWithUid(appId, process.env.AGORA_APP_CERTIFICATE!, channelName, uid || 0, RtcRole.PUBLISHER, Math.floor(Date.now()/1000) + 3600)

  const userId = (session.user as { id: string }).id
  await supabase.from('creators').update({ is_live: true, live_channel: channelName }).eq('user_id', userId)

  return NextResponse.json({ success: true, appId, channelName, token: null, uid: uid || 0 })
}
