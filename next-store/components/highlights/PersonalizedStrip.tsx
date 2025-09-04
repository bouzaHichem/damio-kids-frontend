"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useMemo } from "react"
import { usePersonalization } from "../../hooks/usePersonalization"

export function PersonalizedStrip({
  products = [] as Array<{ id: string; slug: string; title: string; price: number; images: string[] }>,
}: {
  products?: Array<{ id: string; slug: string; title: string; price: number; images: string[] }>
}) {
  const { trendingByCategory } = usePersonalization()
  const title = trendingByCategory.length
    ? `Because you liked ${trendingByCategory[0]}, you might love`
    : "Curated picks for you"

  const cards = useMemo(() => products.slice(0, 10), [products])

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <span className="text-xs text-muted">Drag ↔</span>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <ul className="flex gap-4 min-w-max">
          {cards.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.24, delay: i * 0.03 }}
              className="w-56 shrink-0 rounded-xl border border-black/10 bg-surface p-3 hover:shadow-z2"
            >
              <Link href={`/product/${p.slug}`} className="block">
                <div className="aspect-[4/3] bg-overlay rounded-md" style={{ backgroundImage: `url(${p.images?.[0] ?? ''})`, backgroundSize: 'cover' }} />
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm font-medium line-clamp-1">{p.title}</div>
                  <div className="text-xs text-muted">${p.price.toFixed(2)}</div>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

