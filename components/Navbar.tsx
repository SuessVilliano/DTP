'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export function Navbar() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <nav className="sticky top-0 z-40 bg-[#0A0A0F]/90 backdrop-blur-xl border-b border-[#1E1E30]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2">
          <span className="text-lg font-black" style={{ background: 'linear-gradient(135deg,#00E5CC,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DTP</span>
          <span className="hidden sm:block text-xs text-[#505065] font-medium">DayTraderPorn</span>
        </Link>

        {/* Center nav — desktop only */}
        <div className="hidden md:flex items-center gap-1">
          {([['Explore', '/explore'], ['Markets', '/markets']] as [string, string][]).map(([label, href]) => (
            <Link key={label} href={href} className="px-3 py-1.5 text-xs text-[#505065] hover:text-white transition-colors rounded-lg hover:bg-[#12121A]">
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full bg-[#1E1E30] animate-pulse" />
          ) : session ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 bg-[#12121A] border border-[#1E1E30] rounded-full px-2.5 py-1.5 hover:border-[#00E5CC]/40 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00E5CC] to-[#0099AA] flex items-center justify-center text-xs font-black text-[#0A0A0F]">
                  {(session.user?.name?.[0] || session.user?.email?.[0] || 'U').toUpperCase()}
                </div>
                <span className="hidden sm:block text-xs text-white font-medium max-w-[80px] truncate">
                  {session.user?.name || session.user?.email?.split('@')[0]}
                </span>
                <span className="text-[#505065] text-xs">{menuOpen ? '▲' : '▼'}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#12121A] border border-[#1E1E30] rounded-xl overflow-hidden shadow-2xl z-50">
                  <div className="px-4 py-3 border-b border-[#1E1E30]">
                    <p className="text-xs font-medium text-white truncate">{session.user?.name || 'User'}</p>
                    <p className="text-xs text-[#505065] truncate">{session.user?.email}</p>
                  </div>
                  {([
                    ['Dashboard', '/dashboard'],
                    ['My Profile', `/creator/${session.user?.name || 'me'}`],
                    ['Messages', '/messages'],
                    ['Notifications', '/notifications'],
                  ] as [string, string][]).map(([label, href]) => (
                    <Link
                      key={label}
                      href={href}
                      className="block px-4 py-2.5 text-sm text-[#A0A0B0] hover:text-white hover:bg-[#1E1E30] transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                  <div className="border-t border-[#1E1E30]" />
                  <button
                    onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#FF3366] hover:bg-[#1E1E30] transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-xs text-[#A0A0B0] hover:text-white transition-colors px-3 py-1.5">Sign in</Link>
              <Link
                href="/register"
                className="text-xs font-black text-[#0A0A0F] px-4 py-2 rounded-full transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#00E5CC,#0099AA)' }}
              >
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
