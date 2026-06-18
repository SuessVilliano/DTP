'use client'

const LEVELS = [
  { name: 'Paperhand', min: 0 },
  { name: 'Retail', min: 100 },
  { name: 'Chartist', min: 500 },
  { name: 'Swing Trader', min: 1500 },
  { name: 'Day Trader', min: 5000 },
  { name: 'Prop Funded', min: 12000 },
  { name: 'Whale', min: 30000 },
]

export function getLevelFromXP(xp: number) {
  let level = 0
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) { level = i; break }
  }
  const current = LEVELS[level].min
  const next = level < LEVELS.length - 1 ? LEVELS[level + 1].min : current + 10000
  const progress = Math.min(100, ((xp - current) / (next - current)) * 100)
  return { level, levelName: LEVELS[level].name, xpToNextLevel: next - xp, progress }
}

export function XPBar({ xp }: { xp: number }) {
  const { level, levelName, xpToNextLevel, progress } = getLevelFromXP(xp)
  const nextLevel = level < LEVELS.length - 1 ? LEVELS[level + 1].name : 'MAX'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[#FFD700] font-black">{levelName}</span>
          <span className="text-[#505065]">Lv.{level + 1}</span>
        </div>
        <span className="text-[#505065]">{xpToNextLevel.toLocaleString()} XP to {nextLevel}</span>
      </div>
      <div className="h-2 rounded-full bg-[#1E1E30] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #FFD700, #FF9900)' }}
        />
      </div>
      <div className="text-xs text-[#505065]">{xp.toLocaleString()} XP total</div>
    </div>
  )
}
