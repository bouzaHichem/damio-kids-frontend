import Image from 'next/image'
import Link from 'next/link'
import { getCategories, getCollections, getAllProducts, getShopImages } from '../../lib/services'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [categories, collections, products, shopImages] = await Promise.all([
    getCategories(),
    getCollections(),
    getAllProducts(),
    getShopImages(),
  ])

  // Build a cover image per category: use shop-image category match, otherwise first product from that category
  const categoryImagesMap = new Map<string, string>()
  const catImgs = (shopImages.category || []) as any[]
  for (const img of catImgs) {
    const key = (img.category || '').toString().toLowerCase()
    const url = (img.image || img.url) as string
    if (key && url && !categoryImagesMap.has(key)) categoryImagesMap.set(key, url)
  }

  function coverForCategory(name: string): string | null {
    const k = name.toLowerCase()
    if (categoryImagesMap.has(k)) return categoryImagesMap.get(k)!
    const p = products.find((x) => (x.category || '').toLowerCase() === k)
    return p?.image || null
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Collections</h1>
        <p className="text-muted">Curated sets and themes sourced from your admin panel.</p>
      </div>

      {collections?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Featured Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((c, i) => (
              <Link key={i} href={`/collections/${encodeURIComponent(c.name)}`} className="group relative overflow-hidden rounded-xl border border-black/10 bg-overlay p-6 hover:border-brand/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                <div className="relative h-44 w-full mb-3 rounded-lg overflow-hidden">
                  {c.image && (
                    <Image src={c.image} alt={c.name} fill unoptimized className="object-cover" />
                  )}
                </div>
                <div className="relative">
                  <h3 className="text-lg font-semibold">{c.name}</h3>
                  <p className="text-muted text-sm">Tap to explore</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const cover = coverForCategory(cat.name)
            return (
              <Link key={i} href={`/collections/${encodeURIComponent(cat.name)}`} className="group relative overflow-hidden rounded-xl border border-black/10 bg-overlay p-4 hover:border-brand/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                <div className="relative h-40 w-full rounded-lg overflow-hidden">
                  {cover && <Image src={cover} alt={cat.name} fill unoptimized className="object-cover" />}
                </div>
                <div className="mt-3">
                  <h3 className="text-lg font-semibold">{cat.name}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

