'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useState } from 'react'
import { Confetti, useBounceMotion } from './Confetti'

export function BounceButton({
  children,
  className,
  onClick,
  variant = 'brand',
  size = 'md',
  disabled,
}: {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  variant?: 'brand' | 'outline' | 'soft'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}) {
  const [key, setKey] = useState<number | null>(null)
  const motionProps = useBounceMotion()

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(e)
    // Trigger confetti
    setKey(Date.now())
  }

  const base = 'relative inline-flex items-center justify-center font-semibold rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60 disabled:cursor-not-allowed'
  const variants = {
    brand: 'bg-brand text-inverse hover:bg-brand2',
    outline: 'border border-black/10 hover:bg-surface',
    soft: 'bg-overlay hover:bg-overlay/80',
  } as const
  const sizes = {
    sm: 'text-sm px-3 py-2 rounded-md',
    md: 'text-sm px-4 py-2.5 rounded-lg',
    lg: 'text-base px-5 py-3 rounded-xl',
  } as const

  return (
    <motion.button
      type="button"
      {...motionProps}
      disabled={disabled}
      onClick={handleClick}
      className={clsx(base, variants[variant], sizes[size], className)}
    >
      <span>{children}</span>
      <Confetti activeKey={key} />
    </motion.button>
  )
}

