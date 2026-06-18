import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password, username } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // TODO: Replace with real DB creation
    // const bcrypt = require('bcrypt')
    // const hash = await bcrypt.hash(password, 12)
    // await prisma.user.create({ data: { email, passwordHash: hash, username, role: 'free' } })

    // Placeholder success
    return NextResponse.json({ success: true, message: 'Account created' }, { status: 201 })
  } catch (error) {
    console.error('[register]', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
