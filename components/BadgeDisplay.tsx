'use client'

export interface Badge {
  id: string
  name: string
  description: string
  emoji: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earned_at?: string
}

const RARITY_COLORS = {
  common: '#A0A0B0',
  rare: '#00E5CC',
  epic: '#9B59B6',
  legendary: '#FFD700',
}

export const ALL_BADGES: Badge[] = [
  { id: 'first_buy', name: 'First Buy', description: 'Made your first purchase', emoji: '🛒', rarity: 'common' },
  { id: 'first_tip', name: 'Tipper', description: 'Sent your first tip', emoji: '💸', rarity: 'common' },
  { id: 'top_fan', name: 'Top Fan', description: 'One of the top 10 tippers this month', emoji: '⭐', rarity: 'rare' },
  { id: 'whale_tip', name: 'Whale Move', description: 'Sent 10+ SOL in a single tip', emoji: '🐳', rarity: 'epic' },
  { id: 'day_trader', name: 'Day Trader', description: 'Reached Level 5', emoji: '📈', rarity: 'rare' },
  { id: 'og_member', name: 'OG Member', description: 'Joined in the first 1000', emoji: '🏆', rarity: 'legendary' },
]

export function BadgeDisplay({ badges, size = 'md' }: { badges: Badge[]; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-4xl' : 'text-2xl'
  const wrapClass = size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-3' : 'p-2'

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map(badge => (
        <div
          key={badge.id}
          title={`${badge.name}: ${badge.description}`}
          className={`${wrapClass} rounded-xl border cursor-help transition-transform hover:scale-110`}
          style={{ borderColor: RARITY_COLORS[badge.rarity] + '40', background: RARITY_COLORS[badge.rarity] + '10' }}
        >
          <span className={sizeClass}>{badge.emoji}</span>
        </div>
      ))}
    </div>
  )
}
