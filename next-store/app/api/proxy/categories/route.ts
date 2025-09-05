import { NextResponse } from 'next/server'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://damio-kids-backend.onrender.com'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const res = await fetch(`${BASE}/categories`, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Upstream /categories ${res.status}`)
    const data = await res.json()
    // Support both { success, categories } and raw array
    const categories = (data?.categories ?? data) as any[]
    return NextResponse.json(categories)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 502 })
  }
}

