'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function DemoBanner() {
  const [isDemo, setIsDemo] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim())
    setIsDemo(cookies.some(c => c.startsWith('dtp_demo=1')))
  }, [])

  const exitDemo = () => {
    document.cookie = 'dtp_demo=; path=/; max-age=0'
    setIsDemo(false)
    router.push('/login')
  }

  if (!isDemo) return null

  return (
    <div
      className="fixed bottom-20 left-4 z-[9999] flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black"
      style={{
        background: 'linear-gradient(135deg,#FF3366,#FF6633)',
        boxShadow: '0 4px 20px rgba(255,51,102,0.4)',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      <span className="text-white">DEMO MODE</span>
      <button
        onClick={exitDemo}
        className="ml-1 text-white/70 hover:text-white transition-colors text-[10px] border border-white/20 px-1.5 py-0.5 rounded"
      >
        Exit
      </button>
    </div>
  )
}
