import { NextResponse } from 'next/server'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://damio-kids-backend.onrender.com'

export const dynamic = 'force-dynamic'

function groupImages(list: any[]): Record<string, any[]> {
  const groups: Record<string, any[]> = { hero: [], category: [], promotional: [], feature: [] }
  for (const img of list || []) {
    const t = (img?.imageType || 'hero').toLowerCase()
    if (!groups[t]) groups[t] = []
    groups[t].push(img)
  }
  return groups
}

export async function GET() {
  async function fetchPath(path: string) {
    const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) throw new Error(String(res.status))
    return res.json()
  }
  try {
    let data: any
    try {
      data = await fetchPath('/shop-images')
    } catch {
      data = await fetchPath('/api/admin/shop-images')
    }
    const images: any[] = (data?.images ?? data?.data ?? data ?? []) as any[]
    const grouped = groupImages(images)
    return NextResponse.json(grouped, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=1800' } })
  } catch (e: any) {
    return NextResponse.json({ hero: [], category: [], promotional: [], feature: [], error: e?.message || 'Failed' }, { status: 502 })
  }
}

