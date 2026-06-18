'use client'

import { useState } from 'react'
import { PhotoUnlockModal } from './PhotoUnlockModal'

export interface Photo {
  id: string
  title?: string
  price: number
  locked: boolean
  thumbnail_url?: string
  creator_username: string
}

interface PhotoGridProps {
  photos: Photo[]
  onUnlock?: (photoId: string) => void
}

export function PhotoGrid({ photos, onUnlock }: PhotoGridProps) {
  const [selected, setSelected] = useState<Photo | null>(null)

  const isDemo =
    typeof document !== 'undefined' &&
    document.cookie.split(';').some(c => c.trim().startsWith('dtp_demo=1'))

  return (
    <>
      <div className="grid grid-cols-3 gap-1.5">
        {photos.map(photo => {
          const showLocked = photo.locked && !isDemo
          return (
            <div
              key={photo.id}
              onClick={() => showLocked ? setSelected(photo) : null}
              className="relative aspect-square bg-[#12121A] rounded-lg overflow-hidden border border-[#1E1E30] cursor-pointer group hover:border-[#00E5CC]/30 transition-colors"
            >
              {photo.thumbnail_url ? (
                <img
                  src={photo.thumbnail_url}
                  alt={photo.title || 'Photo'}
                  className={`w-full h-full object-cover transition-all group-hover:scale-105 ${showLocked ? 'blur-lg scale-110' : ''}`}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E1E30] to-[#0A0A0F] flex items-center justify-center">
                  <span className="text-3xl">🖼️</span>
                </div>
              )}

              {showLocked && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1.5">
                  <span className="text-xl">🔒</span>
                  {photo.price > 0 && (
                    <span className="text-xs font-black text-[#FFD700]">${photo.price.toFixed(2)}</span>
                  )}
                </div>
              )}

              {!showLocked && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selected && (
        <PhotoUnlockModal
          photo={selected}
          onClose={() => setSelected(null)}
          onUnlock={id => { setSelected(null); onUnlock?.(id) }}
        />
      )}
    </>
  )
}
