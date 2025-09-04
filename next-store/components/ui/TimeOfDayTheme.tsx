"use client"

import { useEffect } from "react"

// Applies theme based on time of day.
// Day: default light. Night (18:00-6:00): adds .theme-dark to :root
export function TimeOfDayTheme() {
  useEffect(() => {
    const h = new Date().getHours()
    const root = document.documentElement
    if (h >= 18 || h < 6) {
      root.classList.add("theme-dark")
    } else {
      root.classList.remove("theme-dark")
    }
  }, [])
  return null
}

