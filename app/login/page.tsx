'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'

function LoginInner() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { publicKey, connected } = useWallet()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'AccessDenied') toast.error('Access denied. Admin only.')
    else if (error === 'CredentialsSignin') toast.error('Invalid email or password.')
    else if (error) toast.error(`Sign in error: ${error}`)
  }, [searchParams])

  useEffect(() => {
    if (session) router.replace('/home')
  }, [session, router])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Enter email and password')
    setLoading(true)
    const t = toast.loading('Signing in...')

    const result = await signIn('credentials', {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    })

    setLoading(false)
    if (result?.error) {
      const msg = result.error === 'CredentialsSignin'
        ? 'Invalid email or password. Check your credentials and try again.'
        : result.error
      toast.error(msg, { id: t })
    } else {
      toast.success('Welcome back!', { id: t })
      router.push(searchParams.get('callbackUrl') || '/home')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <Toaster />
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-black text-3xl"><span className="text-[#00E5CC]">D</span><span className="text-white">T</span><span className="text-[#FFD700]">P</span></span>
          </Link>
          <p className="text-[#505065] text-sm mt-2">Sign in to your account</p>
        </div>

        <div className="card p-6 space-y-4">
          <div>
            <p className="text-xs text-[#505065] text-center mb-3">Connect wallet for instant access</p>
            <WalletMultiButton className="!w-full !justify-center !bg-[#1A1A26] !border !border-[#1E1E30] hover:!border-[#00E5CC]/30 !rounded-xl !text-sm !font-medium !py-2.5" />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#1E1E30]" /><span className="text-xs text-[#505065]">or email</span><div className="flex-1 h-px bg-[#1E1E30]" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              required
              autoComplete="email"
              className="w-full bg-[#0A0A0F] border border-[#1E1E30] rounded-xl px-4 py-3 text-white placeholder-[#505065] text-sm focus:outline-none focus:border-[#00E5CC]/30"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="current-password"
              className="w-full bg-[#0A0A0F] border border-[#1E1E30] rounded-xl px-4 py-3 text-white placeholder-[#505065] text-sm focus:outline-none focus:border-[#00E5CC]/30"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-black text-sm text-[#0A0A0F] disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg,#00E5CC,#0099AA)', minHeight: '44px' }}
            >
              {loading ? <span className="w-4 h-4 border-2 border-[#0A0A0F]/30 border-t-[#0A0A0F] rounded-full animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center justify-between text-xs text-[#505065]">
            <Link href="/register" className="hover:text-[#00E5CC]">Create account</Link>
            <Link href="/demo" className="hover:text-[#FFD700]">Try Demo 🔍</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00E5CC]/30 border-t-[#00E5CC] rounded-full animate-spin" />
      </div>
    }>
      <LoginInner />
    </Suspense>
  )
}
