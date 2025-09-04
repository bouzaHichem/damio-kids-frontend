'use client'

import { usePersonalization } from '../hooks/usePersonalization'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ProductCard } from './product/ProductCard'
import { ShopHero } from './hero/ShopHero'
import { PromoMarquee } from './home/PromoMarquee'

const SECTIONS = ['Hero', 'Trending', 'Continue', 'Collections', 'Stories'] as const

type Card = { id: string; slug: string; title: string; price: number; images: string[] }
type SectionKey = (typeof SECTIONS)[number]

export function DynamicHome({ initialProducts = [] as Card[], heroImages = [] as string[], promoImages = [] as string[] }: { initialProducts?: Card[]; heroImages?: string[]; promoImages?: string[] }) {
  const { trendingByCategory } = usePersonalization()

  const ordered: SectionKey[] = (() => {
    if (!trendingByCategory.length) return [...SECTIONS] as SectionKey[]
    return ['Hero', 'Trending', 'Continue', 'Collections', 'Stories']
  })()

  return (
    <div className="space-y-20 p-4 md:p-8">
      {ordered.map((key) => (
        <Section key={key} kind={key} products={initialProducts} heroImages={heroImages} promoImages={promoImages} />
      ))}
    </div>
  )
}

import { StickerBadge } from './ui/StickerBadge'

function Section({ kind, products = [] as Card[], heroImages = [] as string[], promoImages = [] as string[] }: { kind: SectionKey; products?: Card[]; heroImages?: string[]; promoImages?: string[] }) {
  if (kind === 'Hero') {
    return (
      <section className="relative">
        <ShopHero images={heroImages} />
        {/* Playful hero sticker */}
        <div className="absolute top-6 left-6 z-10">
          <HeroSticker />
        </div>
        <div className="mt-6 flex gap-4">
          <Link
            href="/collections"
            className="rounded-lg bg-brand px-5 py-3 text-inverse font-medium shadow-z2 hover:bg-brand2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Explore collections
          </Link>
          <Link
            href="/trending"
            className="rounded-lg border border-black/10 px-5 py-3 hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            See what’s trending
          </Link>
        </div>
      </section>
    )
  }

  if (kind === 'Trending') {
    return (
      <section className="space-y-6">
        <PromoMarquee images={promoImages} />
        <h2 className="text-2xl font-semibold">Trending now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    )
  }

  if (kind === 'Continue') {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Continue your journey</h2>
<div className="rounded-xl border border-black/10 p-6 bg-surface text-muted">
          Recently viewed items will appear here as you explore.
        </div>
      </section>
    )
  }

  if (kind === 'Collections') {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CollectionCard title="Essentials" href="/collections/essentials" />
          <CollectionCard title="Seasonal" href="/collections/seasonal" />
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Stories</h2>
<div className="rounded-xl border border-black/10 p-6 bg-surface text-muted">
        Editorial features and how-to guides tailored to your interests.
      </div>
    </section>
  )
}

function HeroSticker() {
  return <StickerBadge emoji="⭐" text="Kids' favorite" color="brand" size="md" />
}

function CollectionCard({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
className="group relative overflow-hidden rounded-xl border border-black/10 bg-overlay p-6 hover:border-brand/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <motion.div
        className="absolute -inset-10 opacity-0 group-hover:opacity-100"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.24 }}
        style={{
          background:
            'radial-gradient(300px 140px at 20% 0%, rgba(34,211,238,.16), transparent 70%)',
        }}
      />
      <div className="relative">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-1 text-muted">Shop curated picks</p>
      </div>
    </Link>
  )
}

