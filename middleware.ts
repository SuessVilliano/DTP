import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Demo mode — bypass auth entirely
    const demoMode = req.cookies.get('dtp_demo')?.value === '1'
    if (demoMode) return NextResponse.next()

    // Admin guard
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login?error=AccessDenied', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Demo mode always authorized
        const demoMode = req.cookies.get('dtp_demo')?.value === '1'
        if (demoMode) return true

        const pathname = req.nextUrl.pathname

        // Routes that require authentication
        const protectedPaths = [
          '/admin',
          '/creator/go-live',
          '/dashboard',
          '/messages',
          '/bookings',
          '/notifications',
        ]

        const isProtected = protectedPaths.some(p => pathname.startsWith(p))
        if (!isProtected) return true  // Public routes always pass

        return !!token  // Protected routes need a valid token
      },
    },
  },
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/creator/go-live/:path*',
    '/dashboard/:path*',
    '/messages/:path*',
    '/bookings/:path*',
    '/notifications/:path*',
  ],
}
