'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password.')
      setLoading(false)
    } else {
      router.replace('/home')
    }
  }

  async function handleGoogle() {
    await signIn('google', { callbackUrl: '/home' })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-4 terminal-bg">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-4xl font-black tracking-tight">
              <span className="text-[#00E5CC]">D</span>
              <span className="text-white">T</span>
              <span className="text-[#FFD700]">P</span>
            </span>
          </Link>
          <p className="text-[#505065] text-sm mt-2">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-[#12121A] border border-[#1E1E30] rounded-xl p-6 space-y-4">
          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-[#1E1E30] bg-[#1A1A26] text-white hover:border-[#00E5CC33] hover:bg-[#1E1E30] transition-all text-sm font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Wallet */}
          <div className="w-full">
            <WalletMultiButton className="!w-full !justify-center !py-2.5 !bg-[#1A1A26] !border !border-[#1E1E30] !text-white !rounded-lg !text-sm hover:!border-[#00E5CC33] transition-all" />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1E1E30]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#12121A] px-3 text-[#505065]">or with email</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-[#FF3366] text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-cyan w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center text-sm text-[#505065]">
            No account?{' '}
            <Link href="/register" className="text-[#00E5CC] hover:underline">
              Create one
            </Link>
          </div>
        </div>

        {/* Compliance */}
        <p className="text-[10px] text-[#505065] text-center mt-6 leading-relaxed">
          By signing in, you confirm you are 18+ and agree to our{' '}
          <Link href="/terms" className="text-[#A0A0B0] hover:underline">Terms</Link> and{' '}
          <Link href="/privacy" className="text-[#A0A0B0] hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
