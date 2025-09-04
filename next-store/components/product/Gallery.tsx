import { motion } from 'framer-motion'
import Image from 'next/image'

export function Gallery({ images, layoutId }: { images: string[]; layoutId: string }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
      <motion.div layoutId={layoutId} className="relative rounded-xl overflow-hidden border border-black/10 bg-surface shadow-z2">
        <Image
          src={images[0]}
          alt="Primary image"
          fill
          unoptimized
          className="object-cover"
          sizes="(min-width: 1024px) 60vw, 100vw"
        />
      </motion.div>
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
        {images.slice(1).map((src, idx) => (
          <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-black/10 bg-surface">
            <Image
              src={src}
              alt={`Gallery ${idx + 2}`}
              fill
              unoptimized
              className="object-cover"
              sizes="(min-width: 1024px) 30vw, 50vw"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

