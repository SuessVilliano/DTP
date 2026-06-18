import { Navbar } from '@/components/Navbar'
import Link from 'next/link'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">💬</div>
        <h1 className="text-2xl font-black text-white mb-3">Support</h1>
        <p className="text-[#505065] mb-8">Contact our support team or browse the help center.</p>
        <Link href="/home" className="btn btn-primary">← Back to Home</Link>
      </div>
    </div>
  )
}
