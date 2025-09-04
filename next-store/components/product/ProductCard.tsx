'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { WishlistButton } from './WishlistButton'
import { StickerBadge } from '../ui/StickerBadge'
import { QuickAdd } from './QuickAdd'

export type ProductCardProps = {
  product: {
    id: string
    slug: string
    title: string
    price: number
    images: string[]
    sizes?: string[]
    colors?: string[]
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const badgeText = (product.slug || '').includes('neo') ? 'New' : 'Hot'

  return (
    <div className="relative group">
      {/* Sticker badge (top-left) */}
      <div className="absolute top-2 left-2 z-10">
        <StickerBadge text={badgeText} emoji={badgeText === 'New' ? '✨' : '🔥'} size="sm" color={badgeText === 'New' ? 'sky' : 'brand'} />
      </div>
      {/* Wishlist (top-right) */}
      <div className="absolute top-2 right-2 z-10">
        <WishlistButton />
      </div>

      <Link href={`/product/${product.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-xl">
        <motion.div
          layoutId={`product-${product.id}-card`}
          className="overflow-hidden rounded-xl border border-black/10 bg-surface shadow-z2"
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <div className="relative h-64 w-full">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              unoptimized
              className="object-cover"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
            {/* Quick add overlay on image bottom */}
            <div className="pointer-events-none absolute inset-x-3 bottom-3 opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
              <QuickAdd product={{ id: product.id, title: product.title, sizes: product.sizes, colors: product.colors }} />
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium">{product.title}</h3>
              <p className="text-sm text-muted">${product.price.toFixed(2)}</p>
            </div>
            <span className="rounded-md bg-brand/90 text-inverse px-3 py-2 text-xs group-hover:bg-brand">View</span>
          </div>
        </motion.div>
      </Link>

      {/* Quick add toggle for touch devices below card */}
      <div className="mt-2 lg:hidden">
        <QuickAdd product={{ id: product.id, title: product.title, sizes: product.sizes, colors: product.colors }} />
      </div>
    </div>
  )
}

