'use client'

import { useEffect, useMemo, useState } from 'react'
import { getAllProducts } from '../../lib/services'
import { addToCart as addToServer, removeFromCart as removeFromServer, getGuestCart } from '../../lib/cart'
import Image from 'next/image'
import { BounceButton } from '../../components/ui/BounceButton'

export default function Page() {
  const [items, setItems] = useState<Record<number, number>>({})
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      let cart: Record<number, number> = {}
      try {
        const token = typeof window !== 'undefined' ? (localStorage.getItem('authToken') || localStorage.getItem('auth-token')) : null
        if (token) {
          // server cart shape is expected to be { [id]: qty }
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/getcart`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': token,
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({}),
          })
          const data = await res.json()
          cart = data || {}
        } else {
          cart = getGuestCart()
        }
      } catch {
        cart = getGuestCart()
      }
      setItems(cart)
      try {
        const list = await getAllProducts()
        setProducts(list)
      } catch {
        setProducts([])
      }
      setLoading(false)
    }
    load()
  }, [])

  const lines = useMemo(() => {
    return Object.entries(items)
      .map(([id, qty]) => {
        const p = products.find((x) => Number(x.id) === Number(id))
        return p ? { product: p, qty: Number(qty) } : null
      })
      .filter(Boolean) as Array<{ product: any; qty: number }>
  }, [items, products])

  const total = useMemo(() => lines.reduce((sum, l) => sum + (l.product?.new_price || 0) * l.qty, 0), [lines])

  async function inc(id: number) {
    await addToServer(id)
    setItems((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  async function dec(id: number) {
    await removeFromServer(id)
    setItems((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }))
  }

  if (loading) return <div className="p-8">Loading cart...</div>

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Cart</h1>
      {lines.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-4">
            {lines.map(({ product, qty }) => (
              <div key={product.id} className="flex items-center gap-4 rounded-xl border border-black/10 bg-surface p-3">
                <div className="relative h-20 w-24 overflow-hidden rounded">
                  <Image src={product.image} alt={product.name} fill unoptimized className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted">${Number(product.new_price).toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => dec(Number(product.id))} className="rounded-md border border-black/10 px-2 py-1 hover:bg-overlay">-</button>
                  <span className="w-8 text-center">{qty}</span>
                  <button onClick={() => inc(Number(product.id))} className="rounded-md border border-black/10 px-2 py-1 hover:bg-overlay">+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-black/10 bg-overlay p-4 space-y-3">
            <div className="text-lg font-semibold">Order summary</div>
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div className="text-xs text-muted">Shipping & taxes calculated at checkout</div>
            <BounceButton variant="brand" size="lg">Checkout</BounceButton>
          </div>
        </div>
      )}
    </div>
  )
}

