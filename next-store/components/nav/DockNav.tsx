'use client'

import { motion, useSpring, type MotionValue } from 'framer-motion'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref'

type Item = { label: string; href: string }

const ITEMS: Item[] = [
  { label: 'New', href: '/new' },
  { label: 'Trending', href: '/trending' },
  { label: 'Collections', href: '/collections' },
  { label: 'Stories', href: '/stories' },
  { label: 'Cart', href: '/cart' },
]

type DockMV = { scale: MotionValue<number>; y: MotionValue<number> }

export function DockNav() {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<HTMLAnchorElement[]>([])
  const reduced = useReducedMotionPref()
  const isCoarse = typeof window !== 'undefined'
    ? window.matchMedia('(pointer: coarse)').matches
    : false

  const mvs = useMemo<DockMV[]>(
    () =>
      ITEMS.map(() => ({
        scale: useSpring(1, { stiffness: 380, damping: 24 }),
        y: useSpring(0, { stiffness: 380, damping: 24 }),
      })),
    []
  )

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return
      const bounds = containerRef.current.getBoundingClientRect()
      const x = e.clientX - bounds.left
      const maxInfluence = 140
      itemRefs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const cx = r.left - bounds.left + r.width / 2
        const dist = Math.abs(x - cx)
        const influence = Math.max(0, 1 - dist / maxInfluence)
        const targetScale = 1 + influence * 0.8
        const targetY = -influence * 10
        mvs[i].scale.set(targetScale)
        mvs[i].y.set(targetY)
      })
    },
    [mvs]
  )

  const onLeave = useCallback(() => {
    mvs.forEach(({ scale, y }) => {
      scale.set(1)
      y.set(0)
    })
  }, [mvs])

  useEffect(() => {
    onLeave()
  }, [onLeave])

  const moveHandlers = reduced || isCoarse ? {} : { onMouseMove: onMove, onMouseLeave: onLeave }

  return (
    <div
      ref={containerRef}
      {...moveHandlers}
className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-overlay/80 backdrop-blur-md shadow-z3 border border-black/10 px-3 py-2"
      aria-label="Primary"
      role="navigation"
    >
      <ul className="flex items-end gap-2">
        {ITEMS.map((item, i) => (
          <li key={item.href}>
            <Link href={item.href} legacyBehavior>
              <motion.a
                ref={(el) => {
                  if (el) itemRefs.current[i] = el
                }}
                style={{ scale: reduced || isCoarse ? 1 : mvs[i].scale, y: reduced || isCoarse ? 0 : mvs[i].y }}
className="relative isolate inline-block rounded-lg bg-surface/90 border border-black/10 px-3 py-2 text-sm text-text/90 shadow-z1 hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <span className="pointer-events-none">{item.label}</span>
                <span
                  className="pointer-events-none absolute inset-0 -z-10 rounded-lg"
                  aria-hidden
                  style={{
                    background:
                      'radial-gradient(80px 24px at 50% 100%, var(--brand, #6ee7f2) 0%, transparent 70%)',
                    opacity: 0.08,
                  }}
                />
              </motion.a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

