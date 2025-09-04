'use client'

import { useEffect, useMemo, useState } from 'react'

type Event =
  | { type: 'view'; category: string; productId?: string; at: number }
  | { type: 'add'; category: string; productId: string; at: number }

const KEY = 'store_events_v1'

export function usePersonalization() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null
    if (raw) setEvents(JSON.parse(raw))
  }, [])

  function record(e: Event) {
    setEvents((prev) => {
      const next = [...prev, e]
      if (typeof window !== 'undefined') {
        localStorage.setItem(KEY, JSON.stringify(next.slice(-500)))
      }
      return next
    })
  }

  const trendingByCategory = useMemo(() => {
    const score = new Map<string, number>()
    const now = Date.now()
    for (const e of events) {
      const ageMin = (now - e.at) / 60000
      const recency = Math.max(0.2, 1 - ageMin / 720) // 12h half-life
      const base = e.type === 'add' ? 3 : 1
      score.set(e.category, (score.get(e.category) || 0) + base * recency)
    }
    return [...score.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k)
  }, [events])

  return { events, record, trendingByCategory }
}

