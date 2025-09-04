"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { CategoriesMegaMenu } from "./CategoriesMegaMenu"
import { SearchBar } from "./SearchBar"

export function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="sticky top-0 z-40">
      <motion.header
        initial={false}
        animate={{ boxShadow: scrolled ? "var(--z1)" : "0 0 #0000" }}
        className="backdrop-blur-md bg-bg/80 border-b border-black/5"
        role="banner"
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="h-16 grid grid-cols-[auto_1fr_auto] items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.span
                initial={false}
                whileHover={{ rotate: [-2, 2, -2], scale: 1.06 }}
                transition={{ duration: 0.6, repeat: 0, ease: "easeInOut" }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-inverse shadow-z2"
                aria-hidden
              >
                DK
              </motion.span>
              <span className="text-lg font-semibold tracking-tight">Damio Kids</span>
            </Link>

            {/* Search */}
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {/* Right nav */}
            <nav aria-label="Top">
              <ul className="flex items-center gap-3">
                <li className="hidden lg:block"><CategoriesMegaMenu /></li>
                <li className="hidden md:block"><Link className="px-3 py-1.5 rounded-md hover:bg-overlay" href="/collections">Collections</Link></li>
                <li className="hidden md:block"><Link className="px-3 py-1.5 rounded-md hover:bg-overlay" href="/new">New Arrivals</Link></li>
                <li className="hidden md:block"><Link className="px-3 py-1.5 rounded-md hover:bg-overlay text-brand" href="/trending">Sale</Link></li>
                <li>
                  <Link href="/cart" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-surface hover:bg-overlay">
                    <span aria-hidden>🛒</span>
                    <span className="sr-only">Cart</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-surface hover:bg-overlay">
                    <span aria-hidden>🙂</span>
                    <span className="sr-only">Profile</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          {/* mobile search */}
          <div className="md:hidden pb-3"><SearchBar /></div>
        </div>
      </motion.header>
    </div>
  )
}

