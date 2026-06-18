'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const MOCK_STATS = {
  totalEarnings: 4821.50, thisMonth: 1240.00, tipsSOL: 18.4, subscribers: 312, views: 48900,
}

const MOCK_CONTENT = [
  { id: '1', title: 'Bull Market Friday', category: 'Bull Run', views: 4821, earnings: 480.50, tier: 'bull', status: 'active' },
  { id: '2', title: 'After Hours Session', category: 'After Hours', views: 3201, earnings: 960.00, tier: 'whale', status: 'active', isPPV: true, ppvPrice: 9.99 },
  { id: '3', title: 'Bear Trap Recovery', category: 'Bear Trap', views: 2104, earnings: 210.40, tier: 'free', status: 'active' },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'upload' | 'settings'>('overview')
  const [ccConnected, setCCConnected] = useState(false)
  const [spUrl, setSpUrl] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)

  const handleSPSave = () => {
    if (!spUrl.includes('sextpanther.com')) { toast.error('Please enter a valid SextPanther profile URL'); return }
    toast.success('SextPanther profile linked!')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <header className="border-b border-[#1E1E30] bg-[#12121A]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/home" className="text-[#00E5CC] font-black text-xl">DTP</Link>
            <span className="text-[#505065] text-sm hidden sm:block">Creator Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/home" className="text-sm text-[#A0A0B0] hover:text-white">View Site</Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00E5CC]/30 to-[#FFD700]/20 flex items-center justify-center text-sm font-black text-[#00E5CC]">C</div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-1 mb-8 overflow-x-auto">
          {(['overview', 'content', 'upload', 'settings'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${activeTab === t ? 'bg-[#00E5CC]/15 text-[#00E5CC] border border-[#00E5CC]/30' : 'text-[#505065] hover:text-white'}`}>{t}</button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total Earned', val: `$${MOCK_STATS.totalEarnings.toLocaleString()}`, color: '#00E5CC' },
                { label: 'This Month', val: `$${MOCK_STATS.thisMonth.toLocaleString()}`, color: '#00FF88' },
                { label: 'Tips (SOL)', val: `◎${MOCK_STATS.tipsSOL}`, color: '#9945FF' },
                { label: 'Subscribers', val: MOCK_STATS.subscribers.toLocaleString(), color: '#FFD700' },
                { label: 'Total Views', val: MOCK_STATS.views.toLocaleString(), color: '#A0A0B0' },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-[#1E1E30] p-4" style={{ background: '#12121A' }}>
                  <div className="text-xs text-[#505065] mb-2 font-mono uppercase tracking-widest">{s.label}</div>
                  <div className="text-xl font-black" style={{ color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-[#1E1E30] p-6" style={{ background: '#12121A' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-black text-white">CreatorCommand.club</h3>
                    {ccConnected && <span className="text-xs px-2 py-0.5 rounded-full bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/20">Connected</span>}
                  </div>
                  <p className="text-sm text-[#505065] leading-relaxed max-w-lg">Connect for AI caption generation, smart scheduling, multi-platform earnings analytics, and your content vault.</p>
                </div>
                {!ccConnected ? (
                  <button onClick={() => setCCConnected(true)} className="btn btn-outline py-2.5 px-5 rounded-xl text-sm font-bold border-[#00E5CC]/30 text-[#00E5CC] hover:bg-[#00E5CC]/10 transition-all whitespace-nowrap">Connect →</button>
                ) : (
                  <button className="btn btn-ghost py-2.5 px-5 rounded-xl text-sm border-[#1E1E30] text-[#505065]">Disconnect</button>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[#1E1E30] p-6" style={{ background: '#12121A' }}>
              <h3 className="font-black text-white mb-2">SextPanther Integration</h3>
              <p className="text-sm text-[#505065] mb-4 leading-relaxed">Link your SextPanther profile. DTP will display call/text buttons on your creator profile.</p>
              <div className="flex gap-3">
                <input className="input flex-1" placeholder="https://www.sextpanther.com/YourUsername" value={spUrl} onChange={e => setSpUrl(e.target.value)} />
                <button onClick={handleSPSave} className="btn btn-cyan py-2.5 px-5 rounded-xl font-bold text-[#0A0A0F] text-sm whitespace-nowrap">Save Link</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-white">Your Content</h2>
              <button onClick={() => setActiveTab('upload')} className="btn btn-cyan py-2 px-5 rounded-lg text-sm font-bold text-[#0A0A0F]">+ Upload</button>
            </div>
            {MOCK_CONTENT.map(c => (
              <div key={c.id} className="rounded-xl border border-[#1E1E30] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: '#12121A' }}>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#1A1A26] flex items-center justify-center text-2xl shrink-0">🎬</div>
                  <div>
                    <div className="font-black text-white">{c.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1A26] text-[#A0A0B0]">{c.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${c.tier === 'whale' ? 'bg-[#FFD700]/15 text-[#FFD700]' : c.tier === 'bull' ? 'bg-[#00E5CC]/15 text-[#00E5CC]' : 'bg-[#505065]/20 text-[#505065]'}`}>{c.tier}</span>
                      {c.isPPV && <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF3366]/15 text-[#FF3366]">PPV ${c.ppvPrice}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center"><div className="font-black text-white">{c.views.toLocaleString()}</div><div className="text-xs text-[#505065]">views</div></div>
                  <div className="text-center"><div className="font-black text-[#00E5CC]">${c.earnings}</div><div className="text-xs text-[#505065]">earned</div></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="max-w-xl">
            <h2 className="text-xl font-black text-white mb-6">Upload Content</h2>
            <div className="space-y-4">
              <div><label className="block text-xs text-[#505065] uppercase tracking-widest mb-2 font-mono">Title</label><input className="input" placeholder="e.g. After Hours — Bull Market Edition" /></div>
              <div><label className="block text-xs text-[#505065] uppercase tracking-widest mb-2 font-mono">Category</label><select className="input">{['Bull Run','After Hours','Bear Trap','HODL','Short Squeeze','Degen Mode'].map(c => <option key={c}>{c}</option>)}</select></div>
              <div><label className="block text-xs text-[#505065] uppercase tracking-widest mb-2 font-mono">Required Tier</label><select className="input"><option value="free">Free Trader (public)</option><option value="bull">Bull+</option><option value="whale">Whale Only</option></select></div>
              <div><label className="block text-xs text-[#505065] uppercase tracking-widest mb-2 font-mono">PPV Price (USD, 0 = included with tier)</label><input className="input" type="number" placeholder="0.00" /></div>
              <div>
                <label className="block text-xs text-[#505065] uppercase tracking-widest mb-2 font-mono">Video File</label>
                <div className="border-2 border-dashed border-[#1E1E30] rounded-xl p-8 text-center hover:border-[#00E5CC]/30 transition-all cursor-pointer">
                  <div className="text-3xl mb-2">🎬</div>
                  <p className="text-sm text-[#505065]">Drop video here or click to browse</p>
                  <p className="text-xs text-[#505065] mt-1">MP4, MOV, AVI · Max 10GB · HLS auto-generated</p>
                </div>
              </div>
              <button className="btn btn-cyan w-full py-3 rounded-xl font-black text-[#0A0A0F]" disabled={uploadLoading} onClick={() => { setUploadLoading(true); setTimeout(() => { toast.success('Upload started!'); setUploadLoading(false) }, 1500) }}>
                {uploadLoading ? 'Uploading...' : 'Upload Content →'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-xl font-black text-white">Account Settings</h2>
            {[{ label: 'Display Name', placeholder: 'Your creator name' }, { label: 'Bio', placeholder: 'Your trading-themed bio...' }, { label: 'Solana Wallet', placeholder: 'For SOL tips and DTP token rewards' }, { label: 'SextPanther URL', placeholder: 'https://www.sextpanther.com/...' }].map(f => (
              <div key={f.label}><label className="block text-xs text-[#505065] uppercase tracking-widest mb-2 font-mono">{f.label}</label><input className="input" placeholder={f.placeholder} /></div>
            ))}
            <button className="btn btn-cyan py-3 px-8 rounded-xl font-black text-[#0A0A0F]" onClick={() => toast.success('Settings saved!')}>Save Changes</button>
          </div>
        )}
      </div>
    </div>
  )
}
