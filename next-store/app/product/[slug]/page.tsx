import { notFound } from 'next/navigation'
import { Gallery } from '../../../components/product/Gallery'
import { StoryBlock } from '../../../components/product/StoryBlock'
import { BounceButton } from '../../../components/ui/BounceButton'
import { getAllProducts, findProductById } from '../../../lib/services'
import { addToCart } from '../../../lib/cart'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const id = Number(params.slug)
  const all = await getAllProducts()
  const product = findProductById(all, id)
  if (!product) return notFound()

  const sizes = (product as any).sizes || []
  const colors = (product as any).colors || []

  return (
    <div className="p-4 md:p-8 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Gallery images={[product.image, ...(product.gallery || [])]} layoutId={`product-${product.id}-card`} />
        <div className="space-y-6 sticky top-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{product.name}</h1>
            <p className="mt-2 text-muted">{product.description || 'Carefully crafted for comfort and play.'}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold">${product.new_price?.toFixed?.(2) ?? product.new_price}</span>
          </div>
          <ClientVariantAdd id={Number(product.id)} sizes={sizes} colors={colors} />
          <div className="grid grid-cols-1 gap-4">
            <StoryBlock kicker="Materials" title="Soft, safe, durable">
              Crafted for comfort and long days out. Easy-care, planet-friendly fabrics.
            </StoryBlock>
            <StoryBlock kicker="Fit" title="Grows with them">
              Designed with flexible seams and adjustable touches that adapt.
            </StoryBlock>
            <StoryBlock kicker="Use cases" title="From school to play">
              Ready for class, parks, and everything in between. Pairs with everyday essentials.
            </StoryBlock>
          </div>
        </div>
      </div>
    </div>
  )
}

import { ClientVariantAdd } from '../../../components/product/VariantSelector'

