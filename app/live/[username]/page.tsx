'use client'

import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'

interface ChatMessage { id: string; user: string; body: string; isTip?: boolean; amount?: number }

export default function LivePage() {
  const { username } = useParams<{ username: string }>()
  const [viewerCount, setViewerCount] = useState(2847)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'whalezilla', body: 'LFG!! 🚀' },
    { id: '2', user: 'paperhand_pete', body: 'she called BTC breakout 3 weeks ago' },
    { id: '3', user: 'anontrader99', body: '🔥🔥🔥', isTip: true, amount: 0.5 },
  ])
  const [chatInput, setChatInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages])
  useEffect(() => {
    const t = setInterval(() => setViewerCount(v => v + Math.floor(Math.random() * 10) - 4), 3000)
    return () => clearInterval(t)
  }, [])

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    setChatMessages(m => [...m, { id: Date.now().toString(), user: 'you', body: chatInput }])
    setChatInput('')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-0 lg:px-4 py-4 gap-4">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-[#12121A] border-b border-[#1E1E30] lg:rounded-t-xl">
            <div className="flex items-center gap-3">
              <Link href={`/creator/${username}`}>
                <img src={`https://picsum.photos/seed/${username}/40/40`} className="w-8 h-8 rounded-full" alt="" />
              </Link>
              <div>
                <span className="text-white font-bold text-sm">{username}</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3366] animate-pulse" />
                  <span className="text-xs text-[#FF3366] font-bold">LIVE</span>
                  <span className="text-xs text-[#505065]">· {viewerCount.toLocaleString()} watching</span>
                </div>
              </div>
            </div>
            <Link href={`/creator/${username}`} className="text-xs text-[#00E5CC] hover:underline">View Profile →</Link>
          </div>
          <div className="relative bg-black aspect-video flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F] to-[#1E1E30]" />
            <div className="relative text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-[#FF3366]">
                <img src={`https://picsum.photos/seed/${username}/80/80`} className="w-full h-full object-cover" alt="" />
              </div>
              <p className="text-white font-bold">{username} is live</p>
              <p className="text-[#505065] text-sm mt-1">Video loads with Agora SDK</p>
              <p className="text-xs text-[#404055] mt-1">Set NEXT_PUBLIC_AGORA_APP_ID in .env to enable</p>
            </div>
          </div>
          <div className="px-4 py-3 bg-[#12121A] border-t border-[#1E1E30] lg:rounded-b-xl">
            <h2 className="text-white font-black text-sm">🔥 BTC breakout setup — live analysis + position entry</h2>
            <p className="text-[#505065] text-xs mt-0.5">Day trading · Charts · NQ Futures</p>
          </div>
        </div>
        <div className="w-full lg:w-80 flex flex-col bg-[#12121A] lg:rounded-xl border border-[#1E1E30] max-h-[500px] lg:max-h-none">
          <div className="px-4 py-3 border-b border-[#1E1E30]"><h3 className="text-sm font-bold text-white">Live Chat</h3></div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`text-xs rounded-lg px-3 py-2 ${msg.isTip ? 'bg-[#FFD700]/10 border border-[#FFD700]/20' : 'bg-[#0A0A0F]'}`}>
                {msg.isTip
                  ? <><span className="text-[#FFD700] font-black">💰 {msg.user} tipped {msg.amount} SOL</span><span className="text-[#A0A0B0] ml-2">{msg.body}</span></>
                  : <><span className="text-[#00E5CC] font-bold">{msg.user}: </span><span className="text-[#A0A0B0]">{msg.body}</span></>}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendChat} className="p-3 border-t border-[#1E1E30] flex gap-2">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Say something..."
              className="flex-1 bg-[#0A0A0F] border border-[#1E1E30] rounded-lg px-3 py-2 text-sm text-white placeholder-[#505065] focus:outline-none focus:border-[#00E5CC]/30" />
            <button type="submit" className="px-3 py-2 bg-[#00E5CC] text-[#0A0A0F] rounded-lg text-sm font-black">→</button>
          </form>
        </div>
      </div>
    </div>
  )
}
