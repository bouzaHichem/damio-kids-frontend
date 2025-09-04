import { getPopularProducts } from '../../lib/services'
import { ProductCard } from '../../components/product/ProductCard'

export const dynamic = 'force-dynamic'

export default async function TrendingPage() {
  const popular = await getPopularProducts()
  const cards = popular.map((p) => ({
    id: String(p.id),
    slug: String(p.id), // use id as slug for PDP route
    title: p.name,
    price: p.new_price,
    images: [p.image],
    sizes: (p as any).sizes || [],
    colors: (p as any).colors || [],
  }))

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Trending</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}

