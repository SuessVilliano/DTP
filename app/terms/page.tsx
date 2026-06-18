import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  robots: { index: false, follow: false },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/home" className="text-[#00E5CC] text-sm hover:underline mb-6 inline-block">← Back</Link>
        <h1 className="text-2xl font-black text-white mb-2">Terms of Service</h1>
        <p className="text-[#505065] text-sm mb-8">Last updated: June 2026</p>
        <div className="bg-[#12121A] border border-[#1E1E30] rounded-xl p-6 space-y-6 text-[#A0A0B0] text-sm leading-relaxed">
          <section><h2 className="text-white font-bold text-base mb-2">1. Age Requirement</h2><p>You must be at least 18 years of age (or the age of majority in your jurisdiction) to access this website. By accessing this site, you represent and warrant that you are at least 18 years of age. We reserve the right to terminate your account and/or access if we discover you have provided false information about your age.</p></section>
          <section><h2 className="text-white font-bold text-base mb-2">2. Adult Content</h2><p>This website contains sexually explicit material intended for adults only. Access to this material is provided for lawful personal use only. Any other use, including reproduction, redistribution, publishing, display, or performance is strictly prohibited without prior written consent.</p></section>
          <section><h2 className="text-white font-bold text-base mb-2">3. Prohibited Uses</h2><p>You may not use this site to: (a) distribute content to minors; (b) engage in any unlawful activity; (c) violate intellectual property rights; (d) attempt to gain unauthorized access to systems; (e) upload malware or harmful code; (f) harass or threaten other users.</p></section>
          <section><h2 className="text-white font-bold text-base mb-2">4. Payments & Refunds</h2><p>All payments made via cryptocurrency (SOL, USDC, BTC, ETH, etc.) are final and non-refundable due to the nature of blockchain transactions. Pay-per-view access is granted upon confirmed payment. Subscription access continues until cancelled.</p></section>
          <section><h2 className="text-white font-bold text-base mb-2">5. DMCA & Copyright</h2><p>We respect intellectual property rights. To submit a DMCA notice, please visit <Link href="/dmca" className="text-[#00E5CC] hover:underline">/dmca</Link>. Repeat infringers will have their accounts terminated.</p></section>
          <section><h2 className="text-white font-bold text-base mb-2">6. Disclaimer of Warranties</h2><p>THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. MARKET CHARTS AND DATA ARE FOR ENTERTAINMENT PURPOSES ONLY AND DO NOT CONSTITUTE FINANCIAL ADVICE.</p></section>
          <section><h2 className="text-white font-bold text-base mb-2">7. Governing Law</h2><p>These terms are governed by applicable law. Disputes shall be resolved by binding arbitration.</p></section>
          <section><h2 className="text-white font-bold text-base mb-2">8. Contact</h2><p>For legal inquiries: <a href="mailto:legal@daytraderporn.com" className="text-[#00E5CC] hover:underline">legal@daytraderporn.com</a></p></section>
        </div>
      </div>
    </div>
  )
}
