import { DynamicHome } from '../components/DynamicHome'
import { getNewCollections, getPopularProducts, getShopImages } from '../lib/services'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Fetch admin-managed content
  const [popular, newCollections, shopImages] = await Promise.all([
    getPopularProducts(),
    getNewCollections(),
    getShopImages(),
  ])

  const products = [...popular, ...newCollections].slice(0, 6)
  const cards = products.map((p) => ({
    id: String(p.id),
    slug: String(p.id), // use id as slug for PDP route
    title: p.name,
    price: p.new_price,
    images: [p.image],
    sizes: (p as any).sizes || [],
    colors: (p as any).colors || [],
  }))

  const heroImages = (shopImages.hero || []).map((i: any) => i.image || i.url).filter(Boolean)
  const promoImages = (shopImages.promotional || []).map((i: any) => i.image || i.url).filter(Boolean)
  return <DynamicHome initialProducts={cards} heroImages={heroImages} promoImages={promoImages} />
}

