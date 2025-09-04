"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export function CategoryShowcase({
  hero,
  sub = [] as Array<{ title: string; href: string; image?: string }>,
}: {
  hero: { title: string; href: string; image?: string }
  sub?: Array<{ title: string; href: string; image?: string }>
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
      {/* Left large hero */}
      <Link href={hero.href} className="group relative overflow-hidden rounded-2xl border border-black/10 bg-overlay">
        <div className="relative h-64 md:h-full">
          {hero.image ? (
            <Image src={hero.image} alt={hero.title} fill unoptimized className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-accent/10" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-bg/10 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <div className="text-2xl font-semibold">{hero.title}</div>
          <span className="text-sm opacity-80">Shop now →</span>
        </div>
      </Link>

      {/* Right stacked tiles */}
      <div className="grid grid-cols-1 gap-4">
        {sub.slice(0, 3).map((t, i) => (
          <Link key={t.title + i} href={t.href} className="group relative overflow-hidden rounded-xl border border-black/10 bg-surface">
            <div className="relative h-28">
              {t.image ? (
                <Image src={t.image} alt={t.title} fill unoptimized className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200/40 to-sky-200/40" />
              )}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/10"
            />
            <div className="absolute bottom-3 left-3">
              <div className="font-medium">{t.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

