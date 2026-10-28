import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { SANITY_CACHE_TAGS, type SanityCacheTag } from '@/sanity/lib/fetch'

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim()
  if (!secret) return NextResponse.json({ error: 'Webhook is not configured' }, { status: 503 })
  if (!request.headers.has('sanity-webhook-signature')) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  try {
    const { isValidSignature, body } = await parseBody<unknown>(request, secret)
    if (isValidSignature !== true) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    const type = body && typeof body === 'object' && '_type' in body ? body._type : undefined
    if (typeof type !== 'string' || !SANITY_CACHE_TAGS.includes(type as SanityCacheTag)) {
      return NextResponse.json({ error: 'Unsupported document type' }, { status: 400 })
    }

    revalidateTag(type, 'max')
    return NextResponse.json({ revalidated: type })
  } catch {
    return NextResponse.json({ error: 'Invalid webhook request' }, { status: 400 })
  }
}
