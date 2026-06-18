'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

type Application = { id: string; name: string; email: string; appliedAt: string; categories: string[]; socials: Record<string, string>; status: 'pending' | 'approved' | 'rejected'; hasIdDocs: boolean }

const MOCK_APPS: Application[] = [
  { id: '1', name: 'Jessica M.', email: 'j***@gmail.com', appliedAt: '2026-06-17T08:23:00Z', categories: ['Bull Run', 'After Hours'], socials: { onlyfans: 'onlyfans.com/j***', twitter: '@j***' }, status: 'pending', hasIdDocs: true },
  { id: '2', name: 'Alicia R.', email: 'a***@outlook.com', appliedAt: '2026-06-16T14:05:00Z', categories: ['HODL', 'Degen Mode'], socials: { sextpanther: 'sextpanther.com/a***' }, status: 'pending', hasIdDocs: true },
  { id: '3', name: 'Mia K.', email: 'm***@proton.me', appliedAt: '2026-06-15T20:11:00Z', categories: ['Bear Trap'], socials: {}, status: 'pending', hasIdDocs: false },
]

const MOCK_CREATORS = [
  { id: '1', name: 'MarketMaven_X', email: 'c1@dtp.com', earnings: 48200, subscribers: 4821, status: 'active' },
  { id: '2', name: 'SolanaSelene', email: 'c2@dtp.com', earnings: 31400, subscribers: 3140, status: 'active' },
]

const MOCK_REVENUE = { totalVolume: 128400, ppvSales: 78200, tipVolume: 38900, subscriptions: 11300 }

type Tab = 'applications' | 'creators' | 'content' | 'revenue' | 'users' | 'settings'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('applications')
  const [apps, setApps] = useState<Application[]>(MOCK_APPS)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  const handleApprove = async (id: string) => {
    setLoading(id)
    try {
      const res = await fetch('/api/creators/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ applicationId: id, action: 'approve' }) })
      if (!res.ok) throw new Error()
      setApps(a => a.map(x => x.id === id ? { ...x, status: 'approved' } : x))
      toast.success('Creator approved — invite link sent!')
    } catch { toast.error('Approval failed') } finally { setLoading(null) }
  }

  const handleReject = async (id: string) => {
    setLoading(id)
    try {
      await fetch('/api/creators/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ applicationId: id, action: 'reject', rejectReason }) })
      setApps(a => a.map(x => x.id === id ? { ...x, status: 'rejected' } : x))
      setRejectingId(null); setRejectReason(''); toast.success('Application rejected')
    } catch { toast.error('Failed') } finally { setLoading(null) }
  }

  const TABS: { key: Tab; label: string; badge?: number }[] = [
    { key: 'applications', label: 'Applications', badge: apps.filter(a => a.status === 'pending').length },
    { key: 'creators', label: 'Creators' }, { key: 'content', label: 'Content' }, { key: 'revenue', label: 'Revenue' }, { key: 'users', label: 'Users' }, { key: 'settings', label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <header className="border-b border-[#1E1E30] bg-[#12121A] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
          <span className="text-[#00E5CC] font-black text-xl">DTP</span>
          <span className="text-[#505065] text-sm font-mono">Admin</span>
          <div className="flex-1 flex gap-1 overflow-x-auto">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${tab === t.key ? 'bg-[#00E5CC]/15 text-[#00E5CC]' : 'text-[#505065] hover:text-white'}`}>
                {t.label}{t.badge ? <span className="w-5 h-5 rounded-full bg-[#FF3366] text-white text-xs flex items-center justify-center font-black">{t.badge}</span> : null}
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {tab === 'applications' && (
          <div>
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-black text-white">Creator Applications</h2><div className="text-sm text-[#505065]">{apps.filter(a => a.status === 'pending').length} pending review</div></div>
            <div className="space-y-4">
              {apps.map(app => (
                <div key={app.id} className="rounded-xl border border-[#1E1E30] p-5" style={{ background: '#12121A' }}>
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-black text-white">{app.name}</span><span className="text-sm text-[#505065]">{app.email}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${app.status === 'pending' ? 'bg-[#FFD700]/15 text-[#FFD700]' : app.status === 'approved' ? 'bg-[#00FF88]/15 text-[#00FF88]' : 'bg-[#FF3366]/15 text-[#FF3366]'}`}>{app.status}</span>
                        {!app.hasIdDocs && <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF3366]/10 text-[#FF3366] border border-[#FF3366]/20">⚠ No ID uploaded</span>}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">{app.categories.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-[#1A1A26] text-[#A0A0B0]">{c}</span>)}</div>
                      <div className="text-xs text-[#505065]">Applied: {new Date(app.appliedAt).toLocaleDateString()}</div>
                    </div>
                    {app.status === 'pending' && (
                      <div className="flex flex-col gap-2 min-w-[160px]">
                        <button onClick={() => handleApprove(app.id)} disabled={loading === app.id} className="py-2 px-4 rounded-lg text-xs font-black bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/30 hover:bg-[#00FF88]/25 transition-all disabled:opacity-50">{loading === app.id ? '...' : '✓ APPROVE'}</button>
                        {rejectingId === app.id ? (
                          <div className="space-y-2">
                            <textarea className="input text-xs resize-none" rows={2} placeholder="Rejection reason (optional)" value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
                            <div className="flex gap-2">
                              <button onClick={() => handleReject(app.id)} disabled={loading === app.id} className="flex-1 py-1.5 rounded-lg text-xs font-black bg-[#FF3366]/15 text-[#FF3366] border border-[#FF3366]/30">{loading === app.id ? '...' : 'Confirm'}</button>
                              <button onClick={() => { setRejectingId(null); setRejectReason('') }} className="py-1.5 px-3 rounded-lg text-xs text-[#505065] hover:text-white border border-[#1E1E30]">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setRejectingId(app.id)} className="py-2 px-4 rounded-lg text-xs font-black bg-[#FF3366]/10 text-[#FF3366] border border-[#FF3366]/20 hover:bg-[#FF3366]/20 transition-all">✕ REJECT</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'creators' && (
          <div><h2 className="text-2xl font-black text-white mb-6">Approved Creators</h2>
            <div className="rounded-xl border border-[#1E1E30] overflow-hidden"><table className="w-full text-sm"><thead className="border-b border-[#1E1E30]" style={{ background: '#12121A' }}><tr>{['Creator','Email','Earnings','Subscribers','Status','Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs text-[#505065] uppercase tracking-widest font-mono">{h}</th>)}</tr></thead><tbody>{MOCK_CREATORS.map(c => (<tr key={c.id} className="border-t border-[#1E1E30] hover:bg-[#12121A]/50"><td className="px-4 py-3 font-bold text-white">{c.name}</td><td className="px-4 py-3 text-[#505065]">{c.email}</td><td className="px-4 py-3 text-[#00E5CC] font-bold">${c.earnings.toLocaleString()}</td><td className="px-4 py-3 text-white">{c.subscribers.toLocaleString()}</td><td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-[#00FF88]/15 text-[#00FF88]">{c.status}</span></td><td className="px-4 py-3"><button className="text-xs text-[#FF3366] hover:underline" onClick={() => toast('Suspend requires confirmation')}>Suspend</button></td></tr>))}</tbody></table></div>
          </div>
        )}
        {tab === 'revenue' && (
          <div><h2 className="text-2xl font-black text-white mb-6">Revenue Overview</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[{ label: 'Total Volume', val: `$${MOCK_REVENUE.totalVolume.toLocaleString()}`, color: '#00E5CC' }, { label: 'PPV Sales', val: `$${MOCK_REVENUE.ppvSales.toLocaleString()}`, color: '#00FF88' }, { label: 'Tips', val: `$${MOCK_REVENUE.tipVolume.toLocaleString()}`, color: '#9945FF' }, { label: 'Subscriptions', val: `$${MOCK_REVENUE.subscriptions.toLocaleString()}`, color: '#FFD700' }].map(s => (<div key={s.label} className="rounded-xl border border-[#1E1E30] p-5" style={{ background: '#12121A' }}><div className="text-xs text-[#505065] uppercase tracking-widest mb-2 font-mono">{s.label}</div><div className="text-3xl font-black" style={{ color: s.color }}>{s.val}</div></div>))}
            </div>
          </div>
        )}
        {(tab === 'content' || tab === 'users' || tab === 'settings') && (
          <div className="text-center py-20 text-[#505065]"><div className="text-4xl mb-4">🔧</div><p className="font-bold text-white mb-2">{tab}</p><p className="text-sm">Connect Supabase to populate real data.</p></div>
        )}
      </div>
    </div>
  )
}
