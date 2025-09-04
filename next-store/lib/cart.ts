// Client-side cart helpers bridging to the same backend and guest cart in localStorage
import { api } from './api'

const GUEST_KEY = 'guest-cart'

export type CartItem = { id: number; qty: number }

export function getGuestCart(): Record<number, number> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(GUEST_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function setGuestCart(cart: Record<number, number>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(GUEST_KEY, JSON.stringify(cart))
}

export function addToGuestCart(itemId: number, qty = 1) {
  const cart = getGuestCart()
  cart[itemId] = (cart[itemId] || 0) + qty
  setGuestCart(cart)
}

export async function addToCart(itemId: number, variant?: Record<string, any>) {
  // If there's an auth token, send to backend; otherwise store in guest cart
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken') || localStorage.getItem('auth-token')
    if (token) {
      await api.post('/addtocart', { itemId, variant })
      return
    }
  }
  // Guest cart: increment quantity; variant is not persisted for guests by default
  addToGuestCart(itemId, 1)
}

export async function removeFromCart(itemId: number) {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken') || localStorage.getItem('auth-token')
    if (token) {
      await api.post('/removefromcart', { itemId })
      return
    }
  }
  const cart = getGuestCart()
  if (cart[itemId]) {
    cart[itemId] = Math.max(0, (cart[itemId] || 0) - 1)
    setGuestCart(cart)
  }
}

