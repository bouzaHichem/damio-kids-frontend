"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
// Fetch via internal proxy endpoints to avoid CORS from the browser
// import { getCategories, getShopImages, type ShopImage } from "../../lib/services"

const ICONS: Record<string, string> = {
  Kids: "🧒",
  Boys: "👦",
  Girls: "👧",
  Shoes: "👟",
  Apparel: "👚",
  Bags: "🎒",
}

export function CategoriesMegaMenu() {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string | number; name: string; bannerImage?: string }>>([])

  useEffect(() => {
    // Fetch categories and map thumbnails via internal proxies
    ;(async () => {
      try {
        const [catsRes, imgsRes] = await Promise.all([
          fetch('/api/proxy/categories'),
          fetch('/api/proxy/shop-images'),
        ])
        const cats = (await catsRes.json()) as Array<{ id: string | number; name: string; bannerImage?: string }>
        const images = (await imgsRes.json()) as { hero: any[]; category: any[]; promotional: any[]; feature: any[] }
        const catImgs = new Map<string, any>()
        const normalize = (s?: string) => (s || '').toLowerCase().trim()
        images.category.forEach((img) => { const key = normalize(img.category); if (key) catImgs.set(key, img) })
        ;[...images.feature, ...images.promotional].forEach((img) => { const key = normalize(img.category); if (key && !catImgs.has(key)) catImgs.set(key, img) })
        const mapped = cats.map((c) => {
          const key = normalize(c.name)
          const match = catImgs.get(key)
          const url = (match?.image || match?.url) as string | undefined
          return { ...c, bannerImage: c.bannerImage || url }
        })
        setCategories(mapped)
      } catch {
        try {
          const catsRes = await fetch('/api/proxy/categories')
          const cats = await catsRes.json()
          setCategories(cats as any)
        } catch {
          setCategories([])
        }
      }
    })()
  }, [])

  const items = useMemo(() => categories.slice(0, 9), [categories])

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="px-3 py-1.5 rounded-md hover:bg-overlay">Categories</button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute left-0 mt-2 w-[720px] rounded-2xl border border-black/10 bg-overlay p-4 shadow-z3"
        >
          <div className="grid grid-cols-3 gap-3">
            {items.map((c) => (
              <Link
                key={String(c.id) + c.name}
                href={`/collections/${encodeURIComponent(String(c.name).toLowerCase())}`}
                className="group relative overflow-hidden rounded-xl border border-black/10 bg-surface hover:border-brand/30"
              >
                <div className="flex items-center gap-3 p-3">
                  <div className="text-xl" aria-hidden>{ICONS[c.name] ?? "⭐"}</div>
                  <div className="text-sm font-medium line-clamp-1">{c.name}</div>
                </div>
                {c.bannerImage ? (
                  <div className="relative h-24 w-full">
                    <Image src={c.bannerImage} alt={c.name} fill unoptimized className="object-cover" />
                  </div>
                ) : (
                  <div className="h-20 w-full bg-gradient-to-br from-amber-100/40 to-sky-100/40" />
                )}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

