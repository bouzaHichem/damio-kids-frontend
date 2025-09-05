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

  // Build product cards baseline
  const products = [...popular, ...newCollections].slice(0, 9)
  const cards = products.map((p) => ({
    id: String(p.id),
    slug: String(p.id), // use id as slug for PDP route
    title: p.name,
    price: p.new_price,
    images: [p.image],
    sizes: (p as any).sizes || [],
    colors: (p as any).colors || [],
  }))

  // Hero prioritizes admin 'hero' images; carousel pulls from 'feature' then 'promotional'.
  const heroImagesPrimary = (shopImages.hero || []).map((i: any) => i.image || i.url).filter(Boolean)
  const carouselSources = [
    ...(shopImages.feature || []),
    ...(shopImages.promotional || []),
    ...(shopImages.category || []),
  ].map((i: any) => i.image || i.url).filter(Boolean)

  // Fallbacks: if admin has no images, use top product images
  const fallbackProductImgs = cards.map((c) => c.images?.[0]).filter(Boolean)
  const heroImages = heroImagesPrimary.length ? heroImagesPrimary : fallbackProductImgs
  const promoImages = (shopImages.promotional || []).map((i: any) => i.image || i.url).filter(Boolean)

  // Use combined carousel sources with fallback
  const carousel = carouselSources.length ? carouselSources : fallbackProductImgs

  return <DynamicHome initialProducts={cards} heroImages={carousel} promoImages={promoImages} />
}

