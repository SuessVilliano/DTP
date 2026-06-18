import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  robots: { index: false, follow: false },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/home" className="text-[#00E5CC] text-sm hover:underline mb-6 inline-block">← Back</Link>
        <h1 className="text-2xl font-black text-white mb-2">Privacy Policy</h1>
        <p className="text-[#505065] text-sm mb-8">Last updated: June 2026 — CCPA/GDPR Compliant</p>
        <div className="bg-[#12121A] border border-[#1E1E30] rounded-xl p-6 space-y-6 text-[#A0A0B0] text-sm leading-relaxed">
          <section><h2 className="text-white font-bold mb-2">1. Information We Collect</h2><p>We collect: (a) email address and username when you register; (b) wallet addresses when you connect a crypto wallet; (c) payment transaction hashes (public blockchain data only — we never store private keys); (d) session cookies including age verification; (e) usage analytics (anonymized).</p></section>
          <section><h2 className="text-white font-bold mb-2">2. How We Use Your Information</h2><p>Your information is used solely to: operate and improve the platform; process payments; enforce age verification; communicate account-related notices. We do NOT sell your data to third parties.</p></section>
          <section><h2 className="text-white font-bold mb-2">3. Age Verification Cookie</h2><p>When you confirm your age, we set a cookie: <code className="bg-[#1A1A26] px-1 rounded text-[#00E5CC]">dtp_age_verified=1; max-age=86400; SameSite=Strict; Secure</code>. This cookie expires after 24 hours and is used only to prevent repeated age-gate interruptions.</p></section>
          <section><h2 className="text-white font-bold mb-2">4. Third-Party Services</h2><p>We use: NextAuth (authentication), Binance WebSocket (public market data), NOWPayments (crypto payments), TipLink (Solana tips), ExoClick (ads for free tier only), Solana RPC (token balance checks). Each has their own privacy policies.</p></section>
          <section><h2 className="text-white font-bold mb-2">5. CCPA Rights (California Residents)</h2><p>You have the right to know what personal information we collect, request deletion, opt out of sale (we do not sell data), and non-discrimination for exercising these rights. Contact: <a href="mailto:privacy@daytraderporn.com" className="text-[#00E5CC] hover:underline">privacy@daytraderporn.com</a></p></section>
          <section><h2 className="text-white font-bold mb-2">6. GDPR Rights (EEA Residents)</h2><p>You have rights to access, rectification, erasure, portability, and objection. Data is processed under legitimate interest (platform operation) and consent (age verification). DPA contact: <a href="mailto:privacy@daytraderporn.com" className="text-[#00E5CC] hover:underline">privacy@daytraderporn.com</a></p></section>
          <section><h2 className="text-white font-bold mb-2">7. Data Retention</h2><p>Account data is retained for the duration of your account. Payment records are retained per legal requirements. Age verification cookies expire after 24 hours.</p></section>
        </div>
      </div>
    </div>
  )
}
