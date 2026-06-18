'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import type { Photo } from './PhotoGrid'

interface PhotoUnlockModalProps {
  photo: Photo
  onClose: () => void
  onUnlock: (photoId: string) => void
}

export function PhotoUnlockModal({ photo, onClose, onUnlock }: PhotoUnlockModalProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUnlock = async () => {
    if (!session) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/photos/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo_id: photo.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Purchase failed')
      onUnlock(photo.id)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#12121A] rounded-2xl border border-[#1E1E30] w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-[#1E1E30]">
          <h2 className="text-base font-black text-white">Unlock Photo</h2>
          <button onClick={onClose} className="text-[#505065] hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <div className="p-5">
          {/* Preview */}
          <div className="bg-[#0A0A0F] rounded-xl p-6 border border-[#1E1E30] mb-5 text-center">
            <div className="text-4xl mb-3">🖼️</div>
            <p className="text-sm font-bold text-white mb-1">{photo.title || 'Exclusive Photo'}</p>
            <p className="text-xs text-[#505065]">by @{photo.creator_username}</p>
          </div>

          <div className="flex items-center justify-between mb-5">
            <span className="text-sm text-[#A0A0B0]">One-time unlock</span>
            <span className="text-2xl font-black text-[#FFD700]">${photo.price.toFixed(2)}</span>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <button
            onClick={handleUnlock}
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-black text-[#0A0A0F] disabled:opacity-40 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#FFD700,#FF9900)' }}
          >
            {loading ? 'Processing...' : `Unlock for $${photo.price.toFixed(2)} 🔓`}
          </button>

          <p className="text-xs text-[#505065] text-center mt-3">
            Paid via crypto wallet · permanent access
          </p>
        </div>
      </div>
    </div>
  )
}
