'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref'

export function PromoMarquee({ images = [] as string[] }: { images?: string[] }) {
  const reduced = useReducedMotionPref()
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const items = useMemo(() => (images.length ? images : []), [images])

  if (!items.length) return null

  const base = (
    <div className="flex gap-6 pr-6">
      {items.map((src, i) => (
        <div key={i} className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-surface">
          <Image src={src} alt="Promo" fill unoptimized className="object-cover" />
        </div>
      ))}
    </div>
  )

  return (
    <section className="relative overflow-hidden rounded-xl border border-black/10 bg-overlay/70 backdrop-blur p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">Promotions</span>
        <button
          type="button"
          className="text-xs rounded-md border border-black/10 px-2 py-1 hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
        >
          {paused ? 'Play' : 'Pause'}
        </button>
      </div>
      <div className="relative">
        <motion.div
          ref={trackRef}
          className="flex w-max"
          aria-label="Promotional items"
          initial={false}
          animate={reduced || paused ? { x: 0 } : { x: ['0%', '-50%'] }}
          transition={reduced || paused ? { duration: 0 } : { repeat: Infinity, duration: 18, ease: 'linear' }}
        >
          {base}
          {base}
        </motion.div>
      </div>
    </section>
  )
}

