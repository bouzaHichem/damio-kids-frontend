"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function ProductCarousel({ images = [] as string[] }) {
  if (!images.length) return null
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {images.slice(0, 3).map((src, i) => (
          <motion.div
            key={src + i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.28, delay: i * 0.05 }}
            className="relative h-48 md:h-56 lg:h-64 overflow-hidden rounded-xl border border-black/10 bg-surface"
          >
            <Image src={src} alt="Featured" fill unoptimized className="object-cover" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

