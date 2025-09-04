import Image from 'next/image'
import { motion } from 'framer-motion'
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref'
import { ProductCarousel } from './ProductCarousel'

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
      {/* motion field */}
      {!reduced && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0.25 }}
          animate={{ opacity: [0.25, 0.45, 0.25], backgroundPosition: ['0% 0%', '100% 50%', '0% 0%'] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -inset-10"
          style={{
            backgroundImage:
              'radial-gradient(600px 280px at 10% 20%, rgba(255,107,107,.15), transparent 70%), radial-gradient(600px 280px at 90% 80%, rgba(96,165,250,.12), transparent 70%)',
          }}
        />
      )}
      <div className="relative p-8 md:p-12 space-y-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: reduced ? 0 : 0.28 }}
            className="text-4xl md:text-6xl font-semibold tracking-tight"
          >
            Shop the Future
          </motion.h1>
          <p className="mt-3 max-w-2xl text-muted">
            Discover the perfect outfit for your little ones with our carefully curated collection.
          </p>
        </div>
        <div>
          <ProductCarousel images={images} />
        </div>
        <div>
          <motion.a
            href="/collections"
            whileHover={reduced ? undefined : { scale: 1.03 }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            className="inline-flex items-center rounded-xl bg-brand px-6 py-3 text-inverse font-semibold shadow-z2 hover:bg-brand2"
          >
            Shop the Future →
          </motion.a>
        </div>
      </div>
    </div>
  )
}

