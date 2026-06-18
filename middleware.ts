import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Admin routes — require admin role
    if (pathname.startsWith('/admin')) {
      if (!token || (token as { role?: string }).role !== 'admin') {
        return NextResponse.redirect(new URL('/login?error=AccessDenied', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        if (pathname.startsWith('/admin') || pathname.startsWith('/creator/go-live') ||
            pathname.startsWith('/dashboard') || pathname.startsWith('/messages') ||
            pathname.startsWith('/bookings') || pathname.startsWith('/notifications')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/creator/go-live/:path*', '/dashboard/:path*', '/messages/:path*', '/bookings/:path*', '/notifications/:path*'],
}
