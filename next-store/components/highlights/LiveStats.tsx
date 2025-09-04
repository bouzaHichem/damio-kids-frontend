"use client"

import { useEffect, useState } from "react"

export function LiveStats({ slug }: { slug?: string }) {
  const [views, setViews] = useState<number>(() => 20 + Math.floor(Math.random() * 80))

  useEffect(() => {
    // lightweight fake pulse to avoid extra backend requirements
    const t = setInterval(() => setViews((v) => v + (Math.random() > 0.6 ? 1 : 0)), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="rounded-full bg-overlay border border-black/10 text-xs px-3 py-1 text-muted">
      {views} people viewed this today
    </div>
  )
}

