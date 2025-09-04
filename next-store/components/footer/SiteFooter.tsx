"use client"

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-[#0F1520] text-[#E6EDF5]">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-lg font-semibold mb-1">Damio Kids</div>
            <div className="text-sm opacity-80">Playful fashion for modern families.</div>
          </div>
          <div className="text-sm space-y-1">
            <a className="block hover:underline" href="/collections">Collections</a>
            <a className="block hover:underline" href="/new">New arrivals</a>
            <a className="block hover:underline" href="/stories">Stories</a>
          </div>
          <div className="text-sm">
            <div className="mb-2">Newsletter</div>
            <div className="flex gap-2">
              <input placeholder="you@example.com" className="flex-1 rounded-md bg-[#141A26] border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400" />
              <button className="rounded-md bg-sky-400 text-[#0b0f14] px-3 py-2">Join</button>
            </div>
            <div className="mt-3 flex gap-3 opacity-80">
              <span aria-hidden>🐦</span>
              <span aria-hidden>📸</span>
              <span aria-hidden>🎥</span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-4 text-xs opacity-70">© {new Date().getFullYear()} Damio Kids</div>
      </div>
    </footer>
  )
}

