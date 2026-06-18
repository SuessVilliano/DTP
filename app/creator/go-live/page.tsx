'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'

export default function GoLivePage() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('trading')
  const [isLive, setIsLive] = useState(false)
  const [roomUrl, setRoomUrl] = useState('')

  const startStream = async () => {
    if (!title.trim()) return
    setIsLive(true)
    setRoomUrl(`${window.location.origin}/live/me`)
  }

  const stopStream = async () => {
    setIsLive(false)
    setRoomUrl('')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-white mb-2">Go Live</h1>
        <p className="text-[#505065] text-sm mb-8">Stream your trading session to your subscribers in real-time.</p>

        {isLive ? (
          <div className="card p-6 text-center">
            <div className="w-4 h-4 rounded-full bg-[#FF3366] animate-pulse mx-auto mb-4" />
            <h2 className="text-xl font-black text-white mb-2">You're Live! 🔴</h2>
            <p className="text-[#A0A0B0] text-sm mb-4">{title}</p>
            <a href={roomUrl} target="_blank" className="text-[#00E5CC] text-sm hover:underline block mb-6">{roomUrl}</a>
            <button onClick={stopStream} className="px-6 py-3 bg-[#FF3366] text-white rounded-xl font-black text-sm hover:bg-[#e02d5a] transition-colors">
              End Stream
            </button>
          </div>
        ) : (
          <div className="card p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#A0A0B0] mb-2">Stream Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. BTC breakout — live trade setup"
                className="w-full bg-[#0A0A0F] border border-[#1E1E30] rounded-xl px-4 py-3 text-white placeholder-[#505065] focus:outline-none focus:border-[#00E5CC]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A0A0B0] mb-2">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full bg-[#0A0A0F] border border-[#1E1E30] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5CC]/30">
                <option value="trading">Day Trading</option>
                <option value="crypto">Crypto Analysis</option>
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </div>
            <div className="bg-[#1A1A26] rounded-xl p-4 border border-[#1E1E30]">
              <h3 className="text-sm font-bold text-white mb-2">Requirements</h3>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-xs text-[#A0A0B0]"><span className="text-[#505065]">○</span>AGORA_APP_ID configured (set in Vercel env vars)</li>
                <li className="flex items-center gap-2 text-xs text-[#A0A0B0]"><span className="text-[#00E5CC]">✓</span>Creator account verified</li>
                <li className="flex items-center gap-2 text-xs text-[#A0A0B0]"><span className="text-[#00E5CC]">✓</span>Browser camera/mic access</li>
              </ul>
            </div>
            <button onClick={startStream} disabled={!title.trim()}
              className="w-full py-3 rounded-xl font-black text-sm text-[#0A0A0F] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#FF3366,#FF6633)' }}>
              🔴 Start Streaming
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
