'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useState } from 'react'
import { Confetti, useBounceMotion } from '../ui/Confetti'

export function WishlistButton({
  initial = false,
  onChange,
  className,
}: {
  initial?: boolean
  onChange?: (active: boolean) => void
  className?: string
}) {
  const [active, setActive] = useState(initial)
  const [key, setKey] = useState<number | null>(null)
  const motionProps = useBounceMotion()

  function toggle() {
    const next = !active
    setActive(next)
    setKey(Date.now())
    onChange?.(next)
  }

  return (
    <div className={clsx('relative', className)}>
      <motion.button
        type="button"
        aria-pressed={active}
        {...motionProps}
        onClick={toggle}
        className={clsx(
          'inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm',
          active ? 'bg-brand/90 text-inverse border-transparent' : 'bg-surface/90 border-black/10 text-[#ff4d4d]',
          'shadow-z1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand'
        )}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4 8.24 4 9.91 5.01 10.72 6.67 11.53 5.01 13.2 4 14.94 4 17.44 4 19.44 6 19.44 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="currentColor"
          />
        </svg>
      </motion.button>
      <Confetti activeKey={key} />
    </div>
  )
}

