"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function FloatingCTA() {
  const [msg, setMsg] = useState("Need help?")
  useEffect(() => {
    const messages = [
      "Need help?",
      "Limited Sale ends in 2h!",
      "Chat with us",
    ]
    let i = 0
    const t = setInterval(() => { i = (i + 1) % messages.length; setMsg(messages[i]) }, 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-24 right-6 z-40 rounded-full bg-brand text-inverse px-4 py-3 shadow-z3 border border-black/10 hover:bg-brand2"
    >
      {msg}
    </motion.button>
  )
}

