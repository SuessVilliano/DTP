import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Become a Creator — DTP',
  description: 'Apply to join Day Trader Porn as an elite creator. Invite-only. Crypto payouts. Trader demographic.',
  robots: { index: false, follow: false },
}

const STEPS = [
  { icon: '📝', title: 'Apply', desc: 'Submit your application. Tell us about your content and socials.' },
  { icon: '🔍', title: 'We Review', desc: 'Our team reviews every application manually. No bots. No auto-approvals.' },
  { icon: '✉️', title: 'Invite Sent', desc: "If selected, you'll receive a personal invite link within 48 hours." },
  { icon: '💰', title: 'Earn', desc: 'Go live, set your prices, earn crypto. 70% PPV, 90% tips. Instant payouts.' },
]

const BENEFITS = [
  { title: '70% Revenue on PPV', desc: 'Set your own prices. Keep 70% of every purchase. No chargebacks. Ever.' },
  { title: '90% of Tips', desc: 'Fans tip in SOL, USDC, and 100+ cryptos. You keep 90%. Instant withdrawal.' },
  { title: 'Trader Demographic', desc: 'DTP users earn $80k–$500k+/year. They tip big. They stay subscribed. They never stop watching.' },
  { title: 'No Payment Processor Risk', desc: 'Crypto-only. No Stripe. No PayPal. No OnlyFans cutting your content or freezing your funds.' },
  { title: 'SextPanther Integration', desc: 'Link your SextPanther profile. DTP drives traffic to your calls and texts. You earn the affiliate difference.' },
  { title: 'CreatorCommand.club', desc: "Approved creators get access to CreatorCommand — AI caption generator, scheduler, earnings analytics across all your platforms." },
]

export default function BecomeCreatorPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <header className="border-b border-[#1E1E30] bg-[#12121A]/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/home" className="text-[#00E5CC] font-black text-xl">DTP</Link>
          <Link href="/login" className="text-sm text-[#A0A0B0] hover:text-white">Already invited? Sign in →</Link>
        </div>
      </header>

      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #00E5CC 0px, #00E5CC 1px, transparent 1px, transparent 28px)' }} />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00E5CC]/20 bg-[#00E5CC]/5 text-xs text-[#00E5CC] font-black uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5CC] animate-pulse" />
            Invite-Only Creator Program
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
            Get Paid by the Traders<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00E5CC, #0099AA)' }}>
              Who Never Stop Watching.
            </span>
          </h1>
          <p className="text-xl text-[#A0A0B0] mb-4 leading-relaxed">
            Traders earn <span className="text-white font-bold">$80k–$500k+/year.</span> They watch screens 8+ hours a day. They tip in crypto. They could be your after-hours obsession.
          </p>
          <p className="text-[#505065] mb-10">DTP is invite-only. We don't accept everyone. We curate the best.</p>
          <Link href="/creator/apply" className="btn btn-cyan inline-flex py-4 px-10 rounded-xl font-black text-[#0A0A0F] text-lg" style={{ boxShadow: '0 0 40px rgba(0,229,204,0.3)' }}>
            Apply as a Creator →
          </Link>
          <p className="text-xs text-[#505065] mt-4">Applications reviewed within 48 hours. No guarantees of acceptance.</p>
        </div>
      </section>

      <section className="border-y border-[#1E1E30] py-8 px-4" style={{ background: '#12121A' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[{ val: '70%', label: 'PPV Revenue' }, { val: '90%', label: 'Tips Kept' }, { val: '$0', label: 'Platform Fee' }, { val: '48hr', label: 'Review Time' }].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-black text-[#00E5CC]">{s.val}</div>
              <div className="text-xs text-[#505065] uppercase tracking-widest mt-1 font-mono">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs text-[#00E5CC] font-black uppercase tracking-widest mb-3 font-mono">The Process</div>
            <h2 className="text-4xl font-black text-white">How It Works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 mx-auto border border-[#1E1E30]" style={{ background: '#12121A' }}>{s.icon}</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-xs font-black text-[#505065] font-mono">0{i + 1}</span>
                  <span className="font-black text-white">{s.title}</span>
                </div>
                <p className="text-sm text-[#505065] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-[#1E1E30]" style={{ background: '#12121A' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs text-[#FFD700] font-black uppercase tracking-widest mb-3 font-mono">Why DTP</div>
            <h2 className="text-4xl font-black text-white mb-4">The Honest Pitch</h2>
            <p className="text-[#A0A0B0] max-w-2xl mx-auto">No payment processor risk. Highest-earning male niche. You own your content.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(b => (
              <div key={b.title} className="rounded-xl border border-[#1E1E30] p-6 hover:border-[#00E5CC]/30 transition-all" style={{ background: '#0A0A0F' }}>
                <h3 className="font-black text-white mb-2">{b.title}</h3>
                <p className="text-sm text-[#505065] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 text-center border-t border-[#1E1E30]" style={{ background: '#12121A' }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Apply?</h2>
          <p className="text-[#A0A0B0] mb-8">It takes 5 minutes. We review within 48 hours. If selected, you'll receive a personal invite link.</p>
          <Link href="/creator/apply" className="btn btn-cyan inline-flex py-4 px-10 rounded-xl font-black text-[#0A0A0F] text-base" style={{ boxShadow: '0 0 30px rgba(0,229,204,0.25)' }}>
            Apply Now — 5 Minutes →
          </Link>
          <p className="text-xs text-[#505065] mt-4">You must be 18+. ID verification required. All creators agree to 2257 compliance.</p>
        </div>
      </section>

      <div className="compliance-note">
        18 U.S.C. § 2257 Record-Keeping Requirements.{' '}
        <Link href="/2257" className="text-[#00E5CC] hover:underline">View Statement</Link>
        {' '}|{' '}<Link href="/terms">Terms</Link>{' '}|{' '}<Link href="/privacy">Privacy</Link>
      </div>
    </div>
  )
}
