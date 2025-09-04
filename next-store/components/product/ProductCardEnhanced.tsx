"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { QuickAdd } from "./QuickAdd"

export function ProductCardEnhanced({
  product,
}: {
  product: { id: string; slug: string; title: string; price: number; images: string[]; sizes?: string[]; colors?: string[] }
}) {
  return (
    <div className="group [perspective:1000px]">
      <div className="relative h-64 w-full rounded-xl border border-black/10 bg-surface shadow-z2 [transform-style:preserve-3d] transition-transform duration-300 group-hover:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <div className="relative h-full w-full overflow-hidden rounded-xl">
            <Image src={product.images?.[0] ?? ''} alt={product.title} fill unoptimized className="object-cover" />
            <div className="absolute top-2 right-2">💛</div>
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-xl bg-overlay p-3">
          <div className="text-sm font-medium line-clamp-2">{product.title}</div>
          <div className="text-xs text-muted mb-3">${product.price.toFixed(2)}</div>
          <div className="absolute bottom-3 left-3 right-3">
            <QuickAdd product={{ id: product.id, title: product.title, sizes: product.sizes, colors: product.colors }} />
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <Link href={`/product/${product.slug}`} className="text-sm font-medium hover:underline line-clamp-1">{product.title}</Link>
        <span className="text-sm">${product.price.toFixed(2)}</span>
      </div>
    </div>
  )
}

