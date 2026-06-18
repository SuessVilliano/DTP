import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const supabase = getSupabaseAdmin()

    const socialLinks = {
      onlyfans: form.get('onlyfans') as string || null,
      sextpanther: form.get('sextpanther') as string || null,
      twitter: form.get('twitter') as string || null,
      instagram: form.get('instagram') as string || null,
      fansly: form.get('fansly') as string || null,
    }

    const categories = JSON.parse(form.get('categories') as string || '[]')

    const uploadFile = async (file: File | null, path: string) => {
      if (!file) return null
      const { data, error } = await supabase.storage
        .from('creator-ids')
        .upload(path, file, { contentType: file.type, upsert: false })
      if (error) throw new Error(`Upload failed: ${error.message}`)
      return data.path
    }

    const applicationId = crypto.randomUUID()
    const idFrontFile = form.get('idFront') as File | null
    const idBackFile = form.get('idBack') as File | null
    const selfieFile = form.get('selfie') as File | null

    const [idFrontUrl, idBackUrl, selfieUrl] = await Promise.all([
      uploadFile(idFrontFile, `${applicationId}/id-front`),
      uploadFile(idBackFile, `${applicationId}/id-back`),
      uploadFile(selfieFile, `${applicationId}/selfie`),
    ])

    const { error: insertError } = await supabase
      .from('creator_applications')
      .insert({
        id: applicationId,
        email: form.get('email') as string,
        name: form.get('name') as string,
        phone: form.get('phone') as string || null,
        social_links: socialLinks,
        content_categories: categories,
        id_front_url: idFrontUrl,
        id_back_url: idBackUrl,
        selfie_url: selfieUrl,
        solana_wallet: form.get('solanaWallet') as string || null,
        tiplink_email: form.get('tiplinkEmail') as string || null,
        agreed_to_terms: form.get('agreedTerms') === 'true',
        agreed_to_2257: form.get('agreed2257') === 'true',
        status: 'pending',
      })

    if (insertError) throw insertError

    return NextResponse.json({ success: true, applicationId })
  } catch (err) {
    console.error('[creator apply]', err)
    return NextResponse.json({ error: 'Application submission failed' }, { status: 500 })
  }
}
