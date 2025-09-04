'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref'

export function StickerBadge({
  text,
  emoji,
  color = 'brand',
  size = 'md',
  className,
}: {
  text: string
  emoji?: string
  color?: 'brand' | 'amber' | 'sky' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const reduced = useReducedMotionPref()

  const sizes = {
    sm: 'text-[11px] px-2 py-1 rounded-[12px]',
    md: 'text-sm px-3 py-1.5 rounded-[16px]',
    lg: 'text-base px-4 py-2 rounded-[20px]'
  } as const

  const bgByColor: Record<string, string> = {
    brand: 'bg-brand text-inverse',
    amber: 'bg-amber-400 text-[#1e1b16]',
    sky: 'bg-sky-400 text-[#0b0f14]',
    accent: 'bg-accent text-inverse',
  }

  return (
    <motion.div
      initial={{ rotate: -6, y: 0 }}
      animate={reduced ? { rotate: -6 } : { rotate: [-6, -4, -7, -5, -6], y: [0, -1, 1, -1, 0] }}
      transition={reduced ? { duration: 0 } : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className={clsx(
        'inline-flex items-center gap-1.5 select-none shadow-z2 border border-black/10',
        bgByColor[color],
        sizes[size],
        className,
      )}
      aria-hidden
    >
      {emoji ? <span className="text-base leading-none">{emoji}</span> : null}
      <span className="leading-none font-semibold">{text}</span>
    </motion.div>
  )
}

