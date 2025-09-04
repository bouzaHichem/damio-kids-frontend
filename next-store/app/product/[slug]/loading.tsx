export default function LoadingProduct() {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80 rounded-xl bg-overlay border border-black/10" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded bg-overlay" />
          <div className="h-4 w-1/2 rounded bg-overlay" />
          <div className="h-10 w-40 rounded bg-overlay" />
          <div className="h-24 rounded bg-overlay" />
        </div>
      </div>
    </div>
  )
}

