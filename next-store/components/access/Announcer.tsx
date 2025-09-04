'use client'

import { createContext, useContext, useRef } from 'react'

const AnnouncerContext = createContext<{ announce: (msg: string) => void } | null>(null)

export function AnnouncerProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  function announce(msg: string) {
    if (!ref.current) return
    ref.current.textContent = ''
    // small delay ensures screen readers pick up changes
    setTimeout(() => {
      if (ref.current) ref.current.textContent = msg
    }, 50)
  }

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="sr-only" ref={ref} />
    </AnnouncerContext.Provider>
  )
}

export function useAnnouncer() {
  const ctx = useContext(AnnouncerContext)
  if (!ctx) throw new Error('useAnnouncer must be used within AnnouncerProvider')
  return ctx
}

