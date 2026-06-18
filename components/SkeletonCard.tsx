'use client'

export function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#12121A] border border-[#1E1E30] animate-pulse">
      <div className="w-full aspect-video bg-[#1A1A26]" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-[#1A1A26] rounded w-3/4" />
        <div className="h-2.5 bg-[#1A1A26] rounded w-1/2" />
        <div className="flex items-center gap-2 mt-2">
          <div className="w-5 h-5 rounded-full bg-[#1A1A26]" />
          <div className="h-2.5 bg-[#1A1A26] rounded w-1/3" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonCreatorProfile() {
  return (
    <div className="animate-pulse">
      <div className="w-full h-40 md:h-56 bg-[#1A1A26]" />
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-end gap-4 -mt-10 mb-4">
          <div className="w-20 h-20 rounded-full bg-[#1A1A26] border-4 border-[#0A0A0F]" />
          <div className="mb-2 space-y-2">
            <div className="h-5 bg-[#1A1A26] rounded w-40" />
            <div className="h-3 bg-[#1A1A26] rounded w-24" />
          </div>
        </div>
        <div className="flex gap-4 mb-6">{[1,2,3].map(i => <div key={i} className="h-8 bg-[#1A1A26] rounded-lg w-24" />)}</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      </div>
    </div>
  )
}
