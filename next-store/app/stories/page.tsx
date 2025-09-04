import { getCategories, getShopImages, searchProducts } from '../../lib/services'
import { StoryChapter } from '../../components/stories/StoryChapter'

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

export default async function Page() {
  const [categories, shopImages] = await Promise.all([
    getCategories(),
    getShopImages(),
  ])

  // Preferred: admin-driven featured stories based on shop-images of type "feature"
  const featured = (shopImages.feature || []) as any[]
  const sourceCats = (featured.length ? featured
    .map((img) => ({
      name: String(img.category || img.title || ''),
      image: img.image || img.url || null,
    }))
    .filter((f) => f.name)
    : categories.slice(0, 3).map((c: any) => ({ name: String(c.name), image: null }))
  ).slice(0, 3)

  // For each selected category, load some products and use feature image if present
  const chapters = await Promise.all(
    sourceCats.map(async (entry) => {
      const cat = categories.find((c: any) => slugify(String(c.name)) === slugify(entry.name)) || { name: entry.name }
      const { products } = await searchProducts({ categoryId: (cat as any)._id || (cat as any).id, category: cat.name, limit: 8 })
      const mapped = (products || []).map((p: any) => ({
        id: String(p.id),
        slug: String(p.id),
        title: p.name,
        price: p.new_price,
        images: [p.image],
      }))
      // Prefer feature image; else category image; else first product
      const categoryImage = (shopImages.category || []).find((img: any) => slugify(String(img.category)) === slugify(String(cat.name)))
      const image = entry.image || categoryImage?.image || categoryImage?.url || products?.[0]?.image || null
      return { title: String(cat.name), kicker: 'Featured', image, products: mapped }
    })
  )

  return (
    <div className="p-4 md:p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Stories</h1>
        <p className="text-muted">Editorial chapters curated from your admin images and categories.</p>
      </div>

      {chapters.map((c, i) => (
        <StoryChapter key={i} title={c.title} kicker={c.kicker} image={c.image} products={c.products} />
      ))}
    </div>
  )
}

