"use client"

import { useEffect, useRef, useState } from "react"
import { searchProducts } from "../../lib/services"
import { ProductCardEnhanced } from "./ProductCardEnhanced"

export function InfiniteProductGrid({
  initial,
}: {
  initial: Array<{ id: string; slug: string; title: string; price: number; images: string[] }>
}) {
  const [items, setItems] = useState(initial)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const sentinel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first.isIntersecting && !loading) {
        setLoading(true)
        ;(async () => {
          try {
            const { products } = await searchProducts({ page: page + 1, limit: 9 })
            const mapped = products.map((p: any) => ({
              id: String(p.id),
              slug: String(p.id),
              title: p.name,
              price: p.new_price,
              images: [p.image],
            }))
            if (mapped.length) {
              setItems((prev) => [...prev, ...mapped])
              setPage((p) => p + 1)
            }
          } catch {
            // silently ignore; keeps current items
          } finally {
            setLoading(false)
          }
        })()
      }
    }, { rootMargin: "200px" })
    if (sentinel.current) io.observe(sentinel.current)
    return () => io.disconnect()
  }, [page, loading])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <ProductCardEnhanced key={p.id} product={p as any} />
        ))}
      </div>
      <div ref={sentinel} className="h-6" />
      {loading && <div className="text-center text-sm text-muted">Loading…</div>}
    </div>
  )
}

