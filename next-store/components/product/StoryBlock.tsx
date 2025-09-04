import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function StoryBlock({
  kicker,
  title,
  children,
}: {
  kicker: string
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-white/5 bg-overlay p-6 lg:p-8">
      <p className="text-xs uppercase tracking-widest text-muted">{kicker}</p>
      <motion.h3
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.24 }}
        className="mt-2 text-2xl font-semibold"
      >
        {title}
      </motion.h3>
      <div className="mt-3 text-sm text-text/90 leading-relaxed">{children}</div>
    </section>
  )
}

