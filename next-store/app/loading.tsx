export default function Loading() {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-pulse">
      <div className="h-48 rounded-xl bg-overlay border border-black/10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-black/10 bg-surface shadow-z1 p-3">
            <div className="h-40 rounded-md bg-overlay" />
            <div className="mt-3 h-4 w-2/3 rounded bg-overlay" />
            <div className="mt-2 h-3 w-1/3 rounded bg-overlay" />
          </div>
        ))}
      </div>
    </div>
  )
}

