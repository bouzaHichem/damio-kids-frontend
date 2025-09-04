'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { getCategories, searchProducts } from '../../lib/services'
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState<Array<{ name: string; id: string | number }>>([])
  const [results, setResults] = useState<Array<{ id: string; title: string }>>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const reduced = useReducedMotionPref()

  // Open with Cmd/Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open) return
    ;(async () => {
      try {
        const cats = await getCategories()
        setCategories(cats.map((c) => ({ name: String(c.name), id: (c as any)._id || String(c.id) })))
      } catch (e) {
        // ignore
      }
      setTimeout(() => inputRef.current?.focus(), 50)
    })()
  }, [open])

  // Debounced search
  useEffect(() => {
    if (!open) return
    const t = setTimeout(async () => {
      if (!query.trim()) { setResults([]); return }
      try {
        const { products } = await searchProducts({ q: query, limit: 5 })
        setResults(products.map((p) => ({ id: String(p.id), title: p.name })))
      } catch {
        setResults([])
      }
    }, 200)
    return () => clearTimeout(t)
  }, [query, open])

  return (
    <>
      <button
        type="button"
        className="fixed right-4 bottom-4 z-50 rounded-full border border-black/10 bg-surface/90 backdrop-blur shadow-z2 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Search (⌘/Ctrl+K)"
      >
        Search ⌘K
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/30"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              onClick={(e) => e.stopPropagation()}
              className="absolute left-1/2 top-24 w-[min(680px,92vw)] -translate-x-1/2 rounded-xl border border-black/10 bg-surface shadow-z3"
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              animate={reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            >
              <div className="border-b border-black/10 p-3">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products or jump to a category..."
                  className="w-full bg-transparent outline-none placeholder:text-muted"
                />
              </div>

              <div className="max-h-[60vh] overflow-auto p-3">
                {query ? (
                  results.length ? (
                    <ul className="space-y-1">
                      {results.map((r) => (
                        <li key={r.id}>
                          <Link
                            href={`/product/${r.id}`}
                            onClick={() => setOpen(false)}
                            className="block rounded-md px-2 py-2 hover:bg-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          >
                            {r.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-muted">No results. Try another query.</div>
                  )
                ) : (
                  <>
                    <div className="mb-2 text-xs uppercase tracking-wider text-muted">Navigate</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { href: '/', label: 'Home' },
                        { href: '/new', label: 'New' },
                        { href: '/trending', label: 'Trending' },
                        { href: '/collections', label: 'Collections' },
                        { href: '/stories', label: 'Stories' },
                        { href: '/cart', label: 'Cart' },
                      ].map((n) => (
                        <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-md border border-black/10 px-3 py-2 hover:bg-overlay">
                          {n.label}
                        </Link>
                      ))}
                    </div>

                    <div className="mt-4 mb-2 text-xs uppercase tracking-wider text-muted">Categories</div>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((c) => (
                        <Link
                          key={String(c.id)}
                          href={`/collections/${encodeURIComponent(String(c.name))}`}
                          onClick={() => setOpen(false)}
                          className="rounded-md border border-black/10 px-3 py-2 hover:bg-overlay"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

