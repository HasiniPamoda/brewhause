import { useState } from 'react'
import { galleryItems } from '../data/gallery'
import Lightbox from '../components/Lightbox'

function GalleryTile({ item, onOpen }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <button
      onClick={onOpen}
      aria-label={`View photo: ${item.alt}`}
      className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-latte/50 text-left"
    >
      {item.src ? (
        <div className={`relative ${loaded ? '' : 'min-h-40'}`}>
          {/* Skeleton shown until the image finishes loading */}
          {!loaded && <div className="absolute inset-0 animate-pulse bg-latte" />}
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`w-full transition duration-500 group-hover:scale-105 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      ) : (
        <div
          className="flex aspect-square items-center justify-center bg-cream text-7xl transition duration-500 group-hover:scale-105"
          aria-hidden="true"
        >
          {item.emoji}
        </div>
      )}
    </button>
  )
}

export default function Gallery() {
  const [active, setActive] = useState(null)

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Gallery</h1>
        <p className="mt-3 text-roast">
          A peek inside Brewhaus: our drinks, our bakes, our corner of town.
        </p>
      </div>

      <div className="mt-12 columns-2 gap-4 md:columns-3">
        {galleryItems.map((item, index) => (
          <GalleryTile
            key={item.id}
            item={item}
            onOpen={() => setActive(index)}
          />
        ))}
      </div>

      {active !== null && (
        <Lightbox
          items={galleryItems}
          index={active}
          onClose={() => setActive(null)}
          onChange={setActive}
        />
      )}
    </section>
  )
}