import Image from 'next/image'
import { motion } from 'framer-motion'
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref'

export function ShopHero({ images = [] as string[] }: { images?: string[] }) {
  const reduced = useReducedMotionPref()
  const hero = images[0]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-overlay">
      {hero && (
        <div className="absolute inset-0">
          <Image src={hero} alt="Hero" fill unoptimized className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-bg/20 to-transparent" />
        </div>
      )}
      <div className="relative p-8 md:p-12">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: reduced ? 0 : 0.28 }}
          className="text-4xl md:text-6xl font-semibold tracking-tight"
        >
          Premium Kids Fashion
        </motion.h1>
        <p className="mt-3 max-w-2xl text-muted">
          Discover the perfect outfit for your little ones with our carefully curated collection.
        </p>
      </div>
    </div>
  )
}

