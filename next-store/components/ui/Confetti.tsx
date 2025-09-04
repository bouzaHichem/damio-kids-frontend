'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref'

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function Confetti({ activeKey, colors = ['var(--brand)', 'var(--brand-2)', 'var(--accent)', '#FDE68A'], count = 16 }: {
  activeKey: number | string | null
  colors?: string[]
  count?: number
}) {
  const reduced = useReducedMotionPref()
  const [burst, setBurst] = useState<Array<{ id: string; x: number; y: number; r: number; color: string }>>([])

  useEffect(() => {
    if (!activeKey) return
    const items = Array.from({ length: count }).map((_, i) => ({
      id: `${activeKey}-${i}`,
      x: rand(-40, 40),
      y: rand(-60, -120),
      r: rand(-140, 140),
      color: colors[i % colors.length],
    }))
    setBurst(items)
    const t = setTimeout(() => setBurst([]), reduced ? 150 : 900)
    return () => clearTimeout(t)
  }, [activeKey, colors, count, reduced])

  if (!activeKey) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {burst.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block rounded-[2px]"
          style={{
            width: 6,
            height: 10,
            left: '50%',
            top: '50%',
            backgroundColor: p.color,
          }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={reduced ? { opacity: 0, y: -10 } : { opacity: 0, x: p.x, y: p.y, rotate: p.r, scale: rand(0.8, 1.2) }}
          transition={{ duration: reduced ? 0.15 : 0.9, ease: [0.22, 0.61, 0.36, 1] }}
        />)
      )}
    </div>
  )
}

export function useBounceMotion() {
  const reduced = useReducedMotionPref()
  return useMemo(() => ({
    whileHover: reduced ? {} : { scale: 1.03 },
    whileTap: reduced ? {} : { scale: 0.96 },
    transition: reduced ? { duration: 0.0 } : { type: 'spring', stiffness: 500, damping: 18 },
  }), [reduced])
}

