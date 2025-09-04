'use client'

import { motion, useSpring } from 'framer-motion'
import Image from 'next/image'
import { useMemo, useRef } from 'react'
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref'
import { BounceButton } from './BounceButton'

export function ParallaxCard({
  src,
  alt,
  title,
  price,
}: {
  src: string
  alt: string
  title: string
  price: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotionPref()
  const isCoarse = useMemo(
    () => (typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false),
    []
  )
  const rx = useSpring(0, { stiffness: 180, damping: 18 })
  const ry = useSpring(0, { stiffness: 180, damping: 18 })

  function onMove(e: React.MouseEvent) {
    if (reduced || isCoarse) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const tilt = 8
    ry.set((px - 0.5) * tilt) // rotateY
    rx.set((0.5 - py) * tilt) // rotateX
  }

  function onLeave() {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
className="group relative rounded-xl border border-black/10 bg-surface shadow-z2 p-3 will-change-transform"
      style={{ perspective: 800 }}
    >
      <motion.div
        style={{ rotateX: reduced || isCoarse ? 0 : rx, rotateY: reduced || isCoarse ? 0 : ry, transformStyle: 'preserve-3d' }}
        className="rounded-lg overflow-hidden"
      >
        <div className="relative h-64 w-full">
          <Image
            src={src}
            alt={alt}
            fill
            unoptimized
            className="object-cover"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
          {!reduced && !isCoarse && (
            <motion.div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(600px 200px at 50% 110%, rgba(110,231,242,.35), transparent 60%)',
                opacity: 0.0,
              }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.24 }}
            />
          )}
        </div>
      </motion.div>

      <div className="mt-3 flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-sm text-muted">{price}</p>
        </div>
        <BounceButton size="sm" variant="brand">
          Add
        </BounceButton>
      </div>
    </motion.div>
  )
}

