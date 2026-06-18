'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DemoPage() {
  const router = useRouter()
  useEffect(() => {
    document.cookie = 'dtp_demo=1; path=/; max-age=86400; SameSite=Lax'
    router.replace('/home')
  }, [router])

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-bounce">🚀</div>
        <p className="text-[#00E5CC] font-black text-lg">Loading Demo Mode...</p>
        <p className="text-[#505065] text-sm mt-2">Entering DayTraderPorn as demo admin</p>
      </div>
    </div>
  )
}
