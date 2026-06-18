'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Thread {
  creator_id: string
  creator_name: string
  creator_avatar: string
  last_message: string
  last_at: string
  unread: number
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: fetch real threads from Supabase
    setThreads([
      { creator_id: 'stonkqueen', creator_name: 'StonkQueen', creator_avatar: 'https://picsum.photos/seed/stonkqueen/100/100', last_message: 'Just went live! Come watch 🔥', last_at: '2m ago', unread: 2 },
      { creator_id: 'btcbabe', creator_name: 'BTCBabe', creator_avatar: 'https://picsum.photos/seed/btcbabe/100/100', last_message: 'Your unlock code is ready 💎', last_at: '1h ago', unread: 0 },
    ])
    setLoading(false)
  }, [])

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0A0A0F]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="text-xl font-black text-white mb-2">Sign in to see your messages</h2>
          <p className="text-[#505065] mb-6">Connect your wallet or use email to access DMs.</p>
          <Link href="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-black text-white mb-6">Messages</h1>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-[#12121A] animate-pulse" />)}</div>
        ) : threads.length === 0 ? (
          <div className="text-center py-16 text-[#505065]">
            <div className="text-4xl mb-3">💬</div>
            <p>No messages yet. Find a creator and send them a DM!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {threads.map(t => (
              <Link key={t.creator_id} href={`/creator/${t.creator_id}`} className="flex items-center gap-3 p-4 rounded-xl bg-[#12121A] border border-[#1E1E30] hover:border-[#00E5CC]/20 transition-colors">
                <img src={t.creator_avatar} alt={t.creator_name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{t.creator_name}</span>
                    <span className="text-xs text-[#505065]">{t.last_at}</span>
                  </div>
                  <p className="text-xs text-[#A0A0B0] truncate mt-0.5">{t.last_message}</p>
                </div>
                {t.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#00E5CC] text-[#0A0A0F] text-xs font-black flex items-center justify-center">{t.unread}</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
