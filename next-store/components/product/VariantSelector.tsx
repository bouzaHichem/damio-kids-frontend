'use client'

import { useAnnouncer } from '../../components/access/Announcer'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { BounceButton } from '../ui/BounceButton'
import { addToCart } from '../../lib/cart'

export function ClientVariantAdd({ id, sizes = [], colors = [] as string[] }: { id: number; sizes?: string[]; colors?: string[] }) {
  const { announce } = useAnnouncer()
  const [size, setSize] = useState<string | undefined>(undefined)
  const [color, setColor] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!size && sizes?.length) setSize(sizes[0])
    if (!color && colors?.length) setColor(colors[0])
  }, [sizes, colors, size, color])

  async function onClick() {
    try {
      await addToCart(id, { size, color })
      announce('Added to cart')
    } catch (e) {
      console.error('Add to cart failed', e)
      announce('Failed to add to cart')
    }
  }

  return (
    <div className="space-y-3">
      {sizes?.length ? (
        <div>
          <div className="text-xs text-muted">Size</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={clsx('rounded-md border px-3 py-1.5 text-sm', size === s ? 'border-brand bg-brand/10' : 'border-black/10')}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {colors?.length ? (
        <div>
          <div className="text-xs text-muted">Color</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={clsx('rounded-md border px-3 py-1.5 text-sm', color === c ? 'border-brand bg-brand/10' : 'border-black/10')}
                title={c}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <BounceButton variant="brand" size="lg" onClick={onClick}>Add to cart</BounceButton>
    </div>
  )
}

