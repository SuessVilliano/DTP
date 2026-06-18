'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'

interface Notification {
  id: string
  type: 'new_message' | 'new_subscriber' | 'tip_received' | 'creator_went_live' | 'purchase_complete'
  body: string
  link?: string
  is_read: boolean
  created_at: string
}

const TYPE_ICONS: Record<string, string> = {
  new_message: '💬',
  new_subscriber: '⭐',
  tip_received: '💰',
  creator_went_live: '🔴',
  purchase_complete: '✅',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'creator_went_live', body: 'StonkQueen just went LIVE!', link: '/live/stonkqueen', is_read: false, created_at: '2m ago' },
    { id: '2', type: 'new_message', body: 'BTCBabe sent you a message', link: '/messages', is_read: false, created_at: '15m ago' },
    { id: '3', type: 'purchase_complete', body: 'Your purchase of "Degen Mode" is ready to watch', link: '/watch/v007', is_read: true, created_at: '1h ago' },
    { id: '4', type: 'tip_received', body: 'Your tip of 0.5 SOL to StonkQueen was confirmed', is_read: true, created_at: '3h ago' },
  ])

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, is_read: true })))
  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-white">Notifications {unreadCount > 0 && <span className="ml-2 text-sm text-[#00E5CC]">({unreadCount} new)</span>}</h1>
          {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-[#505065] hover:text-[#00E5CC] transition-colors">Mark all read</button>}
        </div>
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${n.is_read ? 'bg-[#0A0A0F] border-[#1E1E30]' : 'bg-[#12121A] border-[#00E5CC]/20'}`}>
              <span className="text-2xl flex-shrink-0 mt-0.5">{TYPE_ICONS[n.type] || '🔔'}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.is_read ? 'text-[#A0A0B0]' : 'text-white font-medium'}`}>{n.body}</p>
                <p className="text-xs text-[#505065] mt-1">{n.created_at}</p>
              </div>
              {n.link && <Link href={n.link} className="text-xs text-[#00E5CC] hover:underline flex-shrink-0">View →</Link>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
