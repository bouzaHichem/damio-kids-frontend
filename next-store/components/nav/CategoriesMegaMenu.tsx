"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"
import { getCategories } from "../../lib/services"

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
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="px-3 py-1.5 rounded-md hover:bg-overlay">Categories</button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute left-0 mt-2 w-[680px] rounded-2xl border border-black/10 bg-overlay p-4 shadow-z3"
        >
          <div className="grid grid-cols-3 gap-3">
            {categories.slice(0, 9).map((c) => (
              <Link
                key={String(c.id) + c.name}
                href={`/collections/${encodeURIComponent(String(c.name).toLowerCase())}`}
                className="group relative overflow-hidden rounded-xl border border-black/10 bg-surface hover:border-brand/30"
              >
                <div className="flex items-center gap-3 p-3">
                  <div className="text-xl" aria-hidden>{ICONS[c.name] ?? "⭐"}</div>
                  <div className="text-sm font-medium line-clamp-1">{c.name}</div>
                </div>
                {c.bannerImage && (
                  <div className="relative h-24 w-full">
                    <Image src={c.bannerImage} alt={c.name} fill unoptimized className="object-cover" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

