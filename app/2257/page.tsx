import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '18 U.S.C. § 2257 Compliance Statement',
  robots: { index: false, follow: false },
}

export default function CompliancePage() {
  const custodianName = process.env.COMPLIANCE_CUSTODIAN_NAME || '[CUSTODIAN NAME TO BE FILLED]'
  const custodianAddress = process.env.COMPLIANCE_CUSTODIAN_ADDRESS || '[CUSTODIAN ADDRESS TO BE FILLED]'

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/home" className="text-[#00E5CC] text-sm hover:underline mb-6 inline-block">← Back</Link>
        <h1 className="text-2xl font-black text-white mb-6">
          18 U.S.C. § 2257 Record-Keeping Requirements Compliance Statement
        </h1>
        <div className="bg-[#12121A] border border-[#1E1E30] rounded-xl p-6 space-y-4 text-[#A0A0B0] text-sm leading-relaxed">
          <p>All models, actors, actresses, and other persons who appear in any visual depiction of actual or simulated sexually explicit conduct appearing on this website were over the age of eighteen (18) years of age at the time of the creation of such depictions.</p>
          <p>Exemption from record-keeping requirements under 18 U.S.C. § 2257(h)(2)(B)(v) applies because this website is not the primary producer of the visual content and all original materials were created and produced by third-party creators who serve as primary producers for compliance purposes.</p>
          <p>Records required by 18 U.S.C. § 2257 are maintained by the original content producers. The custodian of records for content produced directly by Day Trader Porn is:</p>
          <div className="bg-[#1A1A26] border border-[#1E1E30] rounded-lg p-4">
            <p className="font-bold text-white">Records Custodian</p>
            <p>{custodianName}</p>
            <p>{custodianAddress}</p>
            <p>Email: <a href="mailto:records@daytraderporn.com" className="text-[#00E5CC] hover:underline">records@daytraderporn.com</a></p>
          </div>
          <p className="text-[#505065] text-xs">18 U.S.C. § 2257 and 28 C.F.R. Part 75 require that producers of sexually explicit content maintain records verifying the ages of all performers. This page constitutes the required 2257 disclosure for daytraderporn.com.</p>
        </div>
      </div>
    </div>
  )
}
