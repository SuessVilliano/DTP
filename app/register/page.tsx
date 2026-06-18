'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import toast from 'react-hot-toast'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tier = searchParams.get('tier') || 'free'

  const [form, setForm] = useState({ email: '', password: '', confirm: '', username: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }

    setLoading(true)
    const toastId = toast.loading('Creating your account...')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, username: form.username }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.dismiss(toastId)
        toast.error(data.error || 'Registration failed')
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }
      toast.loading('Logging you in...', { id: toastId })
      const signInResult = await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      if (signInResult?.error) {
        toast.dismiss(toastId)
        toast.error('Account created but login failed. Please sign in manually.')
        router.push('/login')
        return
      }
      toast.success('Welcome to DTP!', { id: toastId })
      router.push(tier !== 'free' ? `/join?tier=${tier}` : '/home')
    } catch {
      toast.dismiss(toastId)
      toast.error('Something went wrong. Please try again.')
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/home"><span className="font-black text-3xl tracking-tight"><span className="text-[#00E5CC]">D</span><span className="text-white">T</span><span className="text-[#FFD700]">P</span></span></Link>
          <p className="text-[#A0A0B0] mt-2 text-sm">Create your account</p>
        </div>

        <div className="mb-6 p-4 rounded-xl border border-[#00E5CC]/20 bg-[#00E5CC]/5">
          <p className="text-xs text-[#00E5CC] font-bold uppercase tracking-widest mb-3 text-center">⚡ Recommended — Wallet Login</p>
          <p className="text-xs text-[#A0A0B0] text-center mb-3">Connect Phantom, Solflare, or any Solana wallet. No email needed.</p>
          <div className="flex justify-center">
            <WalletMultiButton className="!bg-[#00E5CC] !text-[#0A0A0F] !font-black !rounded-xl !text-sm !py-2.5 !px-6 hover:!bg-[#00ccb4] !border-none" />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[#1E1E30]" />
          <span className="text-xs text-[#505065]">or register with email</span>
          <div className="flex-1 h-px bg-[#1E1E30]" />
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs text-[#A0A0B0] mb-1.5 font-medium">Username</label>
            <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full bg-[#12121A] border border-[#1E1E30] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#505065] focus:outline-none focus:border-[#00E5CC]/50 transition-colors" placeholder="tradergod420" />
          </div>
          <div>
            <label className="block text-xs text-[#A0A0B0] mb-1.5 font-medium">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-[#12121A] border border-[#1E1E30] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#505065] focus:outline-none focus:border-[#00E5CC]/50 transition-colors" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-xs text-[#A0A0B0] mb-1.5 font-medium">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-[#12121A] border border-[#1E1E30] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#505065] focus:outline-none focus:border-[#00E5CC]/50 transition-colors" placeholder="8+ characters" required />
          </div>
          <div>
            <label className="block text-xs text-[#A0A0B0] mb-1.5 font-medium">Confirm Password</label>
            <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="w-full bg-[#12121A] border border-[#1E1E30] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#505065] focus:outline-none focus:border-[#00E5CC]/50 transition-colors" placeholder="Repeat password" required />
          </div>
          {error && (<div className="p-3 rounded-lg bg-[#FF3366]/10 border border-[#FF3366]/20 text-[#FF3366] text-xs">{error}</div>)}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-black text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed" style={{ background: loading ? '#1A1A26' : 'linear-gradient(135deg, #00E5CC, #0099AA)', color: loading ? '#505065' : '#0A0A0F' }}>
            {loading ? (<span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-[#505065] border-t-transparent rounded-full animate-spin" />Creating account...</span>) : 'Create Account →'}
          </button>
        </form>

        <p className="text-center text-xs text-[#505065] mt-6">Already have an account? <Link href="/login" className="text-[#00E5CC] hover:underline">Sign in</Link></p>
        <p className="text-center text-[10px] text-[#404055] mt-4 leading-relaxed">By creating an account you confirm you are 18+. All content on DTP is for adults only.</p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (<Suspense fallback={<div className="min-h-screen bg-[#0A0A0F]" />}><RegisterForm /></Suspense>)
}
