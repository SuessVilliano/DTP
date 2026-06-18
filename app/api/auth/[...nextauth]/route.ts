import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          // 1. Sign in via Supabase Auth
          const { data, error } = await supabaseAdmin.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

          if (error) {
            // If email not confirmed, auto-confirm via admin API and retry
            if (error.message?.includes('Email not confirmed')) {
              console.log('[nextauth] Auto-confirming email for:', credentials.email)
              const { data: listData } = await supabaseAdmin.auth.admin.listUsers()
              const existingUser = listData?.users?.find(u => u.email === credentials.email)
              if (existingUser) {
                await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
                  email_confirm: true,
                })
                const { data: retryData, error: retryError } = await supabaseAdmin.auth.signInWithPassword({
                  email: credentials.email,
                  password: credentials.password,
                })
                if (retryError || !retryData.user) {
                  console.error('[nextauth] Retry signin error:', retryError?.message)
                  return null
                }
                const { data: profile } = await supabaseAdmin
                  .from('users')
                  .select('id, email, username, role')
                  .eq('id', retryData.user.id)
                  .single()
                return {
                  id: retryData.user.id,
                  email: retryData.user.email ?? credentials.email,
                  name: profile?.username ?? credentials.email.split('@')[0],
                  role: profile?.role ?? 'free',
                }
              }
              return null
            }
            console.error('[nextauth] Supabase signin error:', error?.message)
            return null
          }

          if (!data.user) return null

          // 2. Fetch profile — create it if missing
          const { data: profileData, error: profileError } = await supabaseAdmin
            .from('users')
            .select('id, email, username, role')
            .eq('id', data.user.id)
            .single()

          let profile = profileData
          if (profileError || !profileData) {
            const username = data.user.user_metadata?.username || credentials.email.split('@')[0]
            const { data: newProfile } = await supabaseAdmin
              .from('users')
              .upsert({ id: data.user.id, email: credentials.email, username, role: 'free' })
              .select()
              .single()
            profile = newProfile
          }

          return {
            id: data.user.id,
            email: data.user.email ?? credentials.email,
            name: profile?.username ?? credentials.email.split('@')[0],
            role: profile?.role ?? 'free',
          }
        } catch (err) {
          console.error('[nextauth] authorize unexpected error:', err)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? 'free'
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = (token.role as string) ?? 'free';
        (session.user as { id?: string }).id = token.id as string
      }
      return session
    },
  },
  pages: { signIn: '/login', error: '/login' },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
