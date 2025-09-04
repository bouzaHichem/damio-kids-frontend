"use client"

import { motion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"
import { searchProducts } from "../../lib/services"

const DEFAULT_TRENDING = [
  "hoodie",
  "backpack",
  "sneakers",
  "summer",
  "girls",
  "boys",
]

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Array<{ id: number; name: string }>>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as any)) setOpen(false)
    }
    document.addEventListener("click", onDoc)
    return () => document.removeEventListener("click", onDoc)
  }, [])

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!query.trim()) { setResults([]); return }
      try {
        setLoading(true)
        const { products } = await searchProducts({ q: query, limit: 5 })
        setResults(products.map(p => ({ id: p.id, name: p.name })))
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }, 220)
    return () => clearTimeout(t)
  }, [query])

  const trending = DEFAULT_TRENDING

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-surface px-3 py-2 focus-within:ring-2 focus-within:ring-brand">
        <span aria-hidden>🔎</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search products"
          className="w-56 md:w-72 lg:w-[28rem] bg-transparent outline-none"
        />
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute left-0 right-0 mt-2 rounded-xl border border-black/10 bg-overlay p-3 shadow-z2"
          role="listbox"
        >
          {loading ? (
            <div className="text-sm text-muted px-2 py-3">Searching…</div>
          ) : query ? (
            results.length ? (
              <ul className="space-y-1">
                {results.map((r) => (
                  <li key={r.id} className="px-2 py-2 rounded-md hover:bg-surface cursor-pointer">
                    {r.name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted px-2 py-3">No results</div>
            )
          ) : (
            <div>
              <div className="text-xs uppercase tracking-widest text-muted px-2 mb-1">Trending</div>
              <div className="flex flex-wrap gap-2">
                {trending.map((t) => (
                  <button key={t} className="text-sm rounded-md border border-black/10 px-2 py-1 hover:bg-surface" onClick={() => { setQuery(t); setOpen(false) }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

