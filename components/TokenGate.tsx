'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export type UserTier = 'visitor' | 'free' | 'bull' | 'whale'

interface TokenGateProps {
  children: React.ReactNode
  requiredTier?: UserTier
  fallback?: React.ReactNode
}

const BULL_THRESHOLD = parseInt(process.env.NEXT_PUBLIC_BULL_TIER_AMOUNT || '1000')
const WHALE_THRESHOLD = parseInt(process.env.NEXT_PUBLIC_WHALE_TIER_AMOUNT || '10000')

export function useTokenTier(): { tier: UserTier; balance: number; loading: boolean } {
  const { connected, publicKey } = useWallet()
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!connected || !publicKey) { setBalance(0); return }
    setLoading(true)
    fetch(`/api/token/balance?wallet=${publicKey.toBase58()}`)
      .then((r) => r.json()).then((data) => setBalance(data.balance || 0)).catch(() => setBalance(0)).finally(() => setLoading(false))
  }, [connected, publicKey])

  let tier: UserTier = 'free'
  if (balance >= WHALE_THRESHOLD) tier = 'whale'
  else if (balance >= BULL_THRESHOLD) tier = 'bull'

  return { tier, balance, loading }
}

const TIER_RANK: Record<UserTier, number> = { visitor: 0, free: 1, bull: 2, whale: 3 }

export function TokenGate({ children, requiredTier = 'bull', fallback }: TokenGateProps) {
  const { connected } = useWallet()
  const { tier, loading } = useTokenTier()

  if (!connected) return fallback ? <>{fallback}</> : (
    <div className="flex flex-col items-center gap-4 p-6 bg-[#12121A] border border-[#1E1E30] rounded-xl text-center">
      <div className="text-3xl">🔐</div>
      <h3 className="font-bold text-white">Connect Your Wallet</h3>
      <p className="text-[#A0A0B0] text-sm max-w-xs">Connect your Phantom or MetaMask wallet to verify your DTP token balance.</p>
      <WalletMultiButton className="!bg-[#00E5CC] !text-[#0A0A0F] !font-bold !rounded-lg !border-0 hover:!bg-[#00B8A3]" />
    </div>
  )

  if (loading) return <div className="flex items-center justify-center p-8"><div className="w-6 h-6 border-2 border-[#00E5CC] border-t-transparent rounded-full animate-spin" /></div>

  if (TIER_RANK[tier] < TIER_RANK[requiredTier]) return fallback ? <>{fallback}</> : (
    <div className="flex flex-col items-center gap-4 p-6 bg-[#12121A] border border-[#1E1E30] rounded-xl text-center">
      <div className="text-3xl">{requiredTier === 'whale' ? '🐋' : '🐂'}</div>
      <h3 className="font-bold text-white">{requiredTier === 'whale' ? 'Whale' : 'Bull'} Access Required</h3>
      <p className="text-[#A0A0B0] text-sm max-w-xs">You need {requiredTier === 'whale' ? WHALE_THRESHOLD.toLocaleString() : BULL_THRESHOLD.toLocaleString()} DTP tokens to access this content.</p>
      <a href="/join" className="btn btn-gold">Get DTP Tokens →</a>
    </div>
  )

  return <>{children}</>
}

export function TierBadge({ tier }: { tier: UserTier }) {
  if (tier === 'whale') return <span className="badge badge-whale">🐋 Whale</span>
  if (tier === 'bull') return <span className="badge badge-bull">🐂 Bull</span>
  return <span className="badge badge-free">Free Trader</span>
}
