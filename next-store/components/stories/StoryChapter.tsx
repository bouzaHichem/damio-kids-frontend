import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function StoryChapter({
  title,
  kicker,
  image,
  products = [] as Array<{ id: string; slug: string; title: string; price: number; images: string[] }>,
}: {
  title: string
  kicker?: string
  image?: string | null
  products?: Array<{ id: string; slug: string; title: string; price: number; images: string[] }>
}) {
  return (
    <section className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-surface shadow-z2">
        {image ? (
          <Image src={image} alt={title} fill unoptimized className="object-cover" />
        ) : (
          <div className="aspect-[4/3]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-bg/10 to-transparent" />
      </div>
      <div className="space-y-4 lg:sticky lg:top-6">
        {kicker && <p className="text-xs uppercase tracking-widest text-muted">{kicker}</p>}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.24 }}
          className="text-3xl font-semibold"
        >
          {title}
        </motion.h2>
        <p className="text-sm text-muted max-w-prose">
          Curated from our collection and imagery — crafted to inspire outfits and spark ideas.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.slice(0, 4).map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="group relative overflow-hidden rounded-xl border border-black/10 bg-overlay p-4 hover:border-brand/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <div className="relative h-28 w-full rounded-md overflow-hidden">
                {p.images?.[0] && (
                  <Image src={p.images[0]} alt={p.title} fill unoptimized className="object-cover" />
                )}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium line-clamp-1">{p.title}</div>
                  <div className="text-xs text-muted">${p.price.toFixed(2)}</div>
                </div>
                <span className="text-xs rounded-md border border-black/10 px-2 py-1">View</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

