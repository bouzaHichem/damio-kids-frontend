"use client"

import { useEffect, useMemo, useState } from "react"
import clsx from "clsx"
import { BounceButton } from "../ui/BounceButton"
import { addToCart } from "../../lib/cart"
import { useAnnouncer } from "../access/Announcer"

export function QuickAdd({
  product,
  openExternally,
  onClose,
}: {
  product: { id: string; title: string; sizes?: string[]; colors?: string[] }
  openExternally?: boolean
  onClose?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState<string | undefined>(undefined)
  const [color, setColor] = useState<string | undefined>(undefined)
  const isCoarse = useMemo(
    () => (typeof window !== "undefined" ? window.matchMedia("(pointer: coarse)").matches : false),
    []
  )
  const { announce } = useAnnouncer()

  useEffect(() => {
    if (openExternally !== undefined) setOpen(!!openExternally)
  }, [openExternally])

  useEffect(() => {
    // Defaults
    if (!size && product.sizes?.length) setSize(product.sizes[0])
    if (!color && product.colors?.length) setColor(product.colors[0])
  }, [product.sizes, product.colors, size, color])

  async function onAdd() {
    try {
      await addToCart(Number(product.id))
      announce("Added to cart")
      if (onClose) onClose()
      if (isCoarse) setOpen(false)
    } catch (e) {
      announce("Failed to add to cart")
    }
  }

  if (!product.sizes?.length && !product.colors?.length) return null

  return (
    <div className={clsx("pointer-events-auto", isCoarse ? undefined : "group-hover:opacity-100 group-hover:translate-y-0") }>
      {/* Toggle for touch */}
      {isCoarse && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mb-2 rounded-md border border-black/10 bg-surface/90 px-2 py-1 text-xs"
        >
          {open ? "Close" : "Quick add"}
        </button>
      )}

      {(open || !isCoarse) && (
        <div className="rounded-lg border border-black/10 bg-overlay/90 p-3 backdrop-blur shadow-z2">
          {product.sizes?.length ? (
            <div className="mb-2">
              <label className="text-xs text-muted">Size</label>
              <div className="mt-1 flex flex-wrap gap-1">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={clsx(
                      "rounded-md border px-2 py-1 text-xs",
                      size === s ? "border-brand bg-brand/10" : "border-black/10"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {product.colors?.length ? (
            <div className="mb-3">
              <label className="text-xs text-muted">Color</label>
              <div className="mt-1 flex flex-wrap gap-1">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={clsx(
                      "rounded-md border px-2 py-1 text-xs",
                      color === c ? "border-brand bg-brand/10" : "border-black/10"
                    )}
                    title={c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <BounceButton size="sm" variant="brand" onClick={onAdd}>
            Add
          </BounceButton>
        </div>
      )}
    </div>
  )
}

