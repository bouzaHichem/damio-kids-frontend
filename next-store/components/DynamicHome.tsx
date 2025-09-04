'use client'

import { usePersonalization } from '../hooks/usePersonalization'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShopHero } from './hero/ShopHero'
import { PromoMarquee } from './home/PromoMarquee'
import { PersonalizedStrip } from './highlights/PersonalizedStrip'
import { LiveStats } from './highlights/LiveStats'
import { InfiniteProductGrid } from './product/InfiniteProductGrid'
import { CategoryShowcase } from './categories/CategoryShowcase'
import { ScrollyStory } from './stories/ScrollyStory'

const SECTIONS = ['Hero', 'Highlights', 'Trending', 'Collections', 'Stories'] as const

type Card = { id: string; slug: string; title: string; price: number; images: string[] }
type SectionKey = (typeof SECTIONS)[number]

export function DynamicHome({ initialProducts = [] as Card[], heroImages = [] as string[], promoImages = [] as string[] }: { initialProducts?: Card[]; heroImages?: string[]; promoImages?: string[] }) {
  const { trendingByCategory } = usePersonalization()

  const ordered: SectionKey[] = (() => {
    if (!trendingByCategory.length) return [...SECTIONS] as SectionKey[]
    return ['Hero', 'Highlights', 'Trending', 'Collections', 'Stories']
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
      </section>
    )
  }

  if (kind === 'Highlights') {
    return (
      <section className="space-y-6">
        <PromoMarquee images={promoImages} />
        <div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Trending now</h2><LiveStats /></div>
        <PersonalizedStrip products={products} />
      </section>
    )
  }

  if (kind === 'Trending') {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Just for you</h2>
        <InfiniteProductGrid initial={products} />
      </section>
    )
  }

  if (kind === 'Collections') {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Collections</h2>
        <CategoryShowcase hero={{ title: 'Kidswear', href: '/collections/kids', image: undefined }} sub={[
          { title: 'Shoes', href: '/collections/shoes' },
          { title: 'Apparel', href: '/collections/apparel' },
          { title: 'Backpacks', href: '/collections/bags' },
        ]} />
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Stories</h2>
      <ScrollyStory image={heroImages[0]} title="From Sketch to Closet" />
    </section>
  )
}

function HeroSticker() {
  return <StickerBadge emoji="⭐" text="Kids' favorite" color="brand" size="md" />
}

