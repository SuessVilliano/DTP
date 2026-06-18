'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/home', label: 'Home', icon: (a: boolean) => <svg className={`w-5 h-5 ${a ? 'text-[#00E5CC]' : 'text-[#505065]'}`} fill={a ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline strokeLinecap="round" strokeLinejoin="round" points="9 22 9 12 15 12 15 22" /></svg> },
  { href: '/explore', label: 'Explore', icon: (a: boolean) => <svg className={`w-5 h-5 ${a ? 'text-[#00E5CC]' : 'text-[#505065]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg> },
  { href: '/messages', label: 'Messages', icon: (a: boolean) => <svg className={`w-5 h-5 ${a ? 'text-[#00E5CC]' : 'text-[#505065]'}`} fill={a ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg> },
  { href: '/notifications', label: 'Alerts', icon: (a: boolean) => <svg className={`w-5 h-5 ${a ? 'text-[#00E5CC]' : 'text-[#505065]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17H20L18.6 15.6A1.2 1.2 0 0118 14.8V11A6 6 0 006 11v3.82c0 .31-.1.6-.3.84L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> },
  { href: '/dashboard', label: 'Profile', icon: (a: boolean) => <svg className={`w-5 h-5 ${a ? 'text-[#00E5CC]' : 'text-[#505065]'}`} fill={a ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0F]/95 backdrop-blur-md border-t border-[#1E1E30] flex items-center justify-around" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', height: '56px' }}>
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + '/')
        return (
          <Link key={tab.href} href={tab.href} className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full" style={{ minHeight: '44px' }}>
            {tab.icon(active)}
            <span className={`text-[10px] font-medium ${active ? 'text-[#00E5CC]' : 'text-[#505065]'}`}>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
