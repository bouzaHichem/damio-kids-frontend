import { getCategories, searchProducts } from '../../../lib/services'
import { ProductCard } from '../../../components/product/ProductCard'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

function slugify(str: string) {
  return (str || '')
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categories = await getCategories()
  const match = categories.find((c) => slugify(String(c.name)) === slugify(String(params.slug)))
  if (!match) return notFound()

  // Many APIs expect categoryId or category name
  const { products } = await searchProducts({ categoryId: (match as any)._id || match.id, page: 1, limit: 120 })

  const cards = products.map((p) => ({ id: String(p.id), slug: String(p.id), title: p.name, price: p.new_price, images: [p.image], sizes: (p as any).sizes || [], colors: (p as any).colors || [] }))

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">{String(match.name)}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}

