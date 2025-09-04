export type Product = {
  id: string
  slug: string
  title: string
  price: number
  category: string
  images: string[]
  excerpt: string
}

export const products: Product[] = [
  {
    id: 'p1',
    slug: 'neo-sneaker',
    title: 'Neo Sneaker',
    price: 59.99,
    category: 'shoes',
    images: [
      'https://picsum.photos/seed/neo1/1200/900',
      'https://picsum.photos/seed/neo2/1200/900',
      'https://picsum.photos/seed/neo3/1200/900'
    ],
    excerpt: 'Light, bouncy, and play-ready. Built for big adventures.'
  },
  {
    id: 'p2',
    slug: 'orbital-backpack',
    title: 'Orbital Backpack',
    price: 44.0,
    category: 'bags',
    images: [
      'https://picsum.photos/seed/orb1/1200/900',
      'https://picsum.photos/seed/orb2/1200/900',
      'https://picsum.photos/seed/orb3/1200/900'
    ],
    excerpt: 'Comfort straps, smart pockets, and space for stories.'
  },
  {
    id: 'p3',
    slug: 'tactile-hoodie',
    title: 'Tactile Hoodie',
    price: 39.5,
    category: 'apparel',
    images: [
      'https://picsum.photos/seed/hood1/1200/900',
      'https://picsum.photos/seed/hood2/1200/900',
      'https://picsum.photos/seed/hood3/1200/900'
    ],
    excerpt: 'Soft-touch fleece with playful patches and warm pockets.'
  }
]

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug) || null
}

