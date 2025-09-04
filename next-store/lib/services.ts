import { api } from './api'

export type BackendProduct = {
  id: number
  name: string
  image: string
  new_price: number
  old_price?: number
  category?: string
  brand?: string
  sizes?: string[]
  colors?: string[]
  description?: string
  stock_quantity?: number
  [key: string]: any
}

export async function getAllProducts(): Promise<BackendProduct[]> {
  const res = await api.get('/allproducts')
  return res.data as BackendProduct[]
}

export async function getNewCollections(): Promise<BackendProduct[]> {
  const res = await api.get('/newcollections')
  return res.data as BackendProduct[]
}

export async function getPopularProducts(): Promise<BackendProduct[]> {
  const res = await api.get('/popularinwomen')
  return res.data as BackendProduct[]
}

export async function getCategories(): Promise<{ id: number | string; name: string; bannerImage?: string }[]> {
  const res = await api.get('/categories')
  const data = res.data as any
  // Support both { success, categories } and raw array
  const categories = (data?.categories ?? data) as any[]
  return categories as { id: number | string; name: string; bannerImage?: string }[]
}

export async function searchProducts(params: Record<string, any>): Promise<{ products: BackendProduct[]; total?: number }> {
  const res = await api.get('/products/search', { params })
  const data = res.data as any
  const products = (data?.products ?? data) as BackendProduct[]
  return { products, total: data?.total }
}

export function findProductById(list: BackendProduct[], id: number): BackendProduct | null {
  return list.find((p) => Number(p.id) === Number(id)) || null
}

export type ShopImage = { imageType?: string; category?: string; image?: string; url?: string; [k: string]: any }
export async function getShopImages(params: Record<string, any> = {}): Promise<{ hero: ShopImage[]; category: ShopImage[]; promotional: ShopImage[]; feature: ShopImage[] }> {
  // CRA uses /shop-images; admin service sometimes uses /api/admin/shop-images
  let data: any
  try {
    const res = await api.get('/shop-images', { params })
    data = res.data
  } catch {
    const res = await api.get('/api/admin/shop-images', { params })
    data = res.data
  }
  const images: ShopImage[] = (data?.images ?? data?.data ?? []) as any[]
  const grouped = images.reduce(
    (acc: any, img: ShopImage) => {
      const t = (img.imageType || 'hero') as keyof typeof acc
      if (!acc[t]) acc[t] = []
      acc[t].push(img)
      return acc
    },
    { hero: [], category: [], promotional: [], feature: [] } as Record<string, ShopImage[]>
  )
  return grouped as any
}

export async function getCollections(): Promise<Array<{ id?: string | number; name: string; image?: string }>> {
  const res = await api.get('/collections')
  const data = res.data as any
  // Normalize possible shapes
  return (data?.collections ?? data?.data ?? data ?? []) as Array<{ id?: string | number; name: string; image?: string }>
}

