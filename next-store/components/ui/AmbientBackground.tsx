'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref'

export function AmbientBackground() {
  const reduced = useReducedMotionPref()
  const gradient = useMemo(
    () =>
      'radial-gradient(60% 80% at 10% 20%, rgba(255,107,107,.18), transparent 60%),\
       radial-gradient(50% 60% at 90% 30%, rgba(245,158,11,.16), transparent 60%),\
       radial-gradient(40% 50% at 50% 90%, rgba(96,165,250,.14), transparent 60%)',
    []
  )

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute -inset-1 opacity-70"
        style={{ backgroundImage: gradient, filter: 'blur(30px)' }}
        initial={false}
        animate={reduced ? { opacity: 0.5 } : { opacity: [0.6, 0.8, 0.6] }}
        transition={reduced ? { duration: 0 } : { duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

