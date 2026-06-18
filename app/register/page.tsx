'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

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

    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, username: form.username }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')

      // Auto sign-in
      await signIn('credentials', {
        email: form.email,
        password: form.password,
        callbackUrl: tier !== 'free' ? `/join` : '/home',
      })
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  const tierLabels: Record<string, { label: string; color: string }> = {
    free: { label: 'Free Trader', color: '#A0A0B0' },
    bull: { label: 'Bull', color: '#00E5CC' },
    whale: { label: 'Whale', color: '#FFD700' },
  }
  const tierInfo = tierLabels[tier] || tierLabels.free

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-4 terminal-bg">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-4xl font-black">
              <span className="text-[#00E5CC]">D</span>
              <span className="text-white">T</span>
              <span className="text-[#FFD700]">P</span>
            </span>
          </Link>
          <p className="text-[#505065] text-sm mt-2">Create your account</p>
          {tier !== 'free' && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-sm">
              <span className="text-[#A0A0B0]">Signing up for</span>
              <span className="font-bold" style={{ color: tierInfo.color }}>
                {tierInfo.label}
              </span>
            </div>
          )}
        </div>

        <div className="bg-[#12121A] border border-[#1E1E30] rounded-xl p-6 space-y-4">
          {/* Google */}
          <button
            onClick={() => signIn('google', { callbackUrl: tier !== 'free' ? '/join' : '/home' })}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-[#1E1E30] bg-[#1A1A26] text-white hover:border-[#00E5CC33] transition-all text-sm font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <WalletMultiButton className="!w-full !justify-center !py-2.5 !bg-[#1A1A26] !border !border-[#1E1E30] !text-white !rounded-lg !text-sm" />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1E1E30]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#12121A] px-3 text-[#505065]">or with email</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <input
              type="text"
              placeholder="Username (optional)"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input"
              pattern="[a-zA-Z0-9_]+"
              minLength={3}
              maxLength={30}
            />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input"
              required
            />
            <input
              type="password"
              placeholder="Password (8+ characters)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input"
              required
              minLength={8}
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="input"
              required
            />

            {error && <p className="text-[#FF3366] text-sm">{error}</p>}

            <button type="submit" disabled={loading} className="btn btn-cyan w-full">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-sm text-[#505065]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#00E5CC] hover:underline">Sign in</Link>
          </div>
        </div>

        <p className="text-[10px] text-[#505065] text-center mt-6 leading-relaxed">
          By creating an account, you confirm you are 18+ years of age and agree to our{' '}
          <Link href="/terms" className="text-[#A0A0B0] hover:underline">Terms</Link>,{' '}
          <Link href="/privacy" className="text-[#A0A0B0] hover:underline">Privacy Policy</Link>, and{' '}
          <Link href="/2257" className="text-[#A0A0B0] hover:underline">18 U.S.C. § 2257</Link>.
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0F]" />}>
      <RegisterForm />
    </Suspense>
  )
}
