"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

export function ScrollyStory({
  image,
  title,
  kicker = "How this is made",
  ctaHref = "/collections",
}: {
  image?: string
  title: string
  kicker?: string
  ctaHref?: string
}) {
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [1, 0.9, 1])

  return (
    <section className="relative rounded-2xl overflow-hidden border border-black/10 bg-surface">
      <motion.div style={{ scale, opacity }} className="relative h-[52vh] w-full">
        {image ? (
          <Image src={image} alt={title} fill unoptimized className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-accent/10" />
        )}
      </motion.div>
      <div className="p-6 md:p-10 space-y-3">
        <div className="text-xs uppercase tracking-widest text-muted">{kicker}</div>
        <h3 className="text-3xl font-semibold">{title}</h3>
        <p className="text-sm text-muted max-w-prose">From sketch to stitch—follow the playful process behind our most loved pieces with subtle animations as you scroll.</p>
        <a href={ctaHref} className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-4 py-2 hover:bg-overlay">Shop Now →</a>
      </div>
    </section>
  )
}

