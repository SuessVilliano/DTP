import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'DMCA Policy',
  robots: { index: false, follow: false },
}

export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/home" className="text-[#00E5CC] text-sm hover:underline mb-6 inline-block">← Back</Link>
        <h1 className="text-2xl font-black text-white mb-2">DMCA Policy</h1>
        <p className="text-[#505065] text-sm mb-8">Digital Millennium Copyright Act Compliance</p>
        <div className="bg-[#12121A] border border-[#1E1E30] rounded-xl p-6 space-y-6 text-[#A0A0B0] text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold mb-2">DMCA Agent</h2>
            <div className="bg-[#1A1A26] border border-[#1E1E30] rounded-lg p-4 space-y-1">
              <p className="text-white font-semibold">Day Trader Porn DMCA Agent</p>
              <p>Email: <a href="mailto:dmca@daytraderporn.com" className="text-[#00E5CC] hover:underline">dmca@daytraderporn.com</a></p>
              <p className="text-xs text-[#505065]">We aim to respond to all valid DMCA notices within 48 hours.</p>
            </div>
          </section>
          <section>
            <h2 className="text-white font-bold mb-2">Filing a DMCA Notice</h2>
            <p>To report copyright infringement, provide:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-[#A0A0B0]">
              <li>Your full legal name and contact information</li>
              <li>Description of the copyrighted work you claim was infringed</li>
              <li>URL(s) of the infringing content on our site</li>
              <li>A statement of good faith belief that the use is unauthorized</li>
              <li>A statement that the information in your notice is accurate, under penalty of perjury</li>
              <li>Your physical or electronic signature</li>
            </ul>
          </section>
          <section><h2 className="text-white font-bold mb-2">Counter-Notice</h2><p>If your content was removed in error, you may file a counter-notice. We will restore the content within 10-14 business days unless the complainant seeks a court order.</p></section>
          <section><h2 className="text-white font-bold mb-2">Repeat Infringer Policy</h2><p>Accounts with multiple verified copyright violations will be permanently terminated.</p></section>
        </div>
      </div>
    </div>
  )
}
