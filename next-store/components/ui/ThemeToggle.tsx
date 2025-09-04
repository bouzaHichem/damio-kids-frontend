'use client'

import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('theme-dark') === 'true'
    setDark(saved)
    document.documentElement.classList.toggle('theme-dark', saved)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-dark', String(next))
      document.documentElement.classList.toggle('theme-dark', next)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed right-4 bottom-24 z-50 rounded-full border border-black/10 bg-surface/90 shadow-z2 backdrop-blur px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      aria-pressed={dark}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {dark ? 'Light' : 'Dark'} mode
    </button>
  )
}

