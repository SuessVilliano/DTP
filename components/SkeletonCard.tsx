'use client'

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-video bg-[#1E1E30]" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-[#1E1E30] rounded w-3/4" />
        <div className="h-3 bg-[#1E1E30] rounded w-1/2" />
      </div>
    </div>
  )
}

export function SkeletonCreatorProfile() {
  return (
    <div className="animate-pulse">
      <div className="w-full h-40 md:h-56 bg-[#1E1E30]" />
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-end gap-4 -mt-12 mb-4">
          <div className="w-24 h-24 rounded-full bg-[#1E1E30] border-4 border-[#0A0A0F]" />
          <div className="pb-2 space-y-2">
            <div className="h-6 w-40 bg-[#1E1E30] rounded" />
            <div className="h-4 w-24 bg-[#1E1E30] rounded" />
          </div>
        </div>
        <div className="flex gap-6 mb-4">
          {[1,2,3].map(i => <div key={i} className="h-4 w-24 bg-[#1E1E30] rounded" />)}
        </div>
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-[#1E1E30] rounded w-full max-w-xl" />
          <div className="h-4 bg-[#1E1E30] rounded w-3/4 max-w-xl" />
        </div>
        <div className="flex gap-2 mb-6">
          {[1,2,3,4].map(i => <div key={i} className="h-11 w-28 bg-[#1E1E30] rounded-xl" />)}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-video bg-[#1E1E30] rounded-xl" />)}
        </div>
      </div>
    </div>
  )
}
