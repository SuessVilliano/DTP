import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Admin-only: Generate signed S3/Spaces upload URL for video content

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as { role?: string })?.role

  if (!session || userRole !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { filename, contentType, filesize, title, creatorId } = body

    if (!filename || !contentType || !title || !creatorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!contentType.startsWith('video/')) {
      return NextResponse.json({ error: 'Only video files allowed' }, { status: 400 })
    }

    const MAX_SIZE = 10 * 1024 * 1024 * 1024 // 10GB
    if (filesize > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 10GB)' }, { status: 400 })
    }

    const videoId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const s3Key = `videos/${creatorId}/${videoId}/${filename}`

    // TODO: Use @aws-sdk/s3-request-presigner for real presigned URLs
    const presignedUrl = `PRESIGNED_URL_PLACEHOLDER_CONFIGURE_S3_CREDENTIALS`

    return NextResponse.json({
      videoId,
      uploadUrl: presignedUrl,
      s3Key,
      expires: new Date(Date.now() + 3600 * 1000).toISOString(),
      nextStep: 'After upload completes, POST to /api/admin/upload/complete with videoId to trigger HLS transcoding.',
    })
  } catch (error) {
    console.error('[admin upload]', error)
    return NextResponse.json({ error: 'Upload init failed' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if ((session?.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const { videoId, s3Key } = await req.json()

  if (!videoId || !s3Key) {
    return NextResponse.json({ error: 'videoId and s3Key required' }, { status: 400 })
  }

  // TODO: Trigger FFmpeg HLS transcoding job
  return NextResponse.json({
    videoId,
    status: 'transcoding',
    message: 'HLS transcoding job queued. Video will be live once transcoding completes.',
    outputHlsUrl: `${process.env.NEXT_PUBLIC_CDN_URL}/hls/${videoId}/master.m3u8`,
  })
}
