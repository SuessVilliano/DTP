'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useTokenTier, TierBadge } from './TokenGate'

export function Navbar() {
  const { data: session } = useSession()
  const { tier } = useTokenTier()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: '/home', label: 'Feed' },
    { href: '/markets', label: '📈 Markets' },
    { href: '/join', label: 'Membership' },
    { href: '/token', label: 'DTP Token' },
  ]

  return (
    <nav className="sticky top-0 z-40 bg-[#0A0A0F]/90 backdrop-blur-md border-b border-[#1E1E30]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/home" className="flex-shrink-0">
          <span className="font-black text-xl tracking-tight"><span className="text-[#00E5CC]">D</span><span className="text-white">T</span><span className="text-[#FFD700]">P</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${pathname === link.href ? 'text-[#00E5CC] bg-[#00E5CC11]' : 'text-[#A0A0B0] hover:text-white hover:bg-[#1A1A26]'}`}>{link.label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <TierBadge tier={tier} />
          <div className="hidden sm:block"><WalletMultiButton className="!text-xs !py-1.5 !px-3 !h-auto !bg-[#1A1A26] !border !border-[#1E1E30] hover:!border-[#00E5CC33] !text-[#A0A0B0] hover:!text-white !rounded-lg !font-medium transition-all" /></div>
          {session ? (
            <div className="flex items-center gap-2">
              {session.user?.image && <img src={session.user.image} alt="" className="w-8 h-8 rounded-full border border-[#1E1E30]" />}
              <button onClick={() => signOut()} className="hidden sm:block text-xs text-[#505065] hover:text-[#A0A0B0] transition-colors">Sign out</button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-outline text-sm py-1.5 px-4">Login</Link>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#A0A0B0] p-1">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{mobileOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}</svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-[#12121A] border-t border-[#1E1E30] px-4 py-3 space-y-1">
          {navLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`block px-3 py-2 rounded-md text-sm transition-colors ${pathname === link.href ? 'text-[#00E5CC] bg-[#00E5CC11]' : 'text-[#A0A0B0] hover:text-white hover:bg-[#1A1A26]'}`}>{link.label}</Link>)}
          <div className="pt-2 border-t border-[#1E1E30]"><WalletMultiButton className="!w-full !text-sm !py-2 !bg-[#1A1A26] !border !border-[#1E1E30] !text-[#A0A0B0] !rounded-lg" /></div>
        </div>
      )}
    </nav>
  )
}
