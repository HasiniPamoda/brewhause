import { useCallback, useEffect, useState } from 'react'

export default function Lightbox({ items, index, onClose, onChange }) {
  const item = items[index]
  const hasMany = items.length > 1
  const [touchStart, setTouchStart] = useState(null)

  // Move forward (+1) or back (-1), wrapping around at the ends
  const go = useCallback(
    (delta) => onChange((index + delta + items.length) % items.length),
    [index, items.length, onChange]
  )

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [go, onClose])

  const handleTouchEnd = (e) => {
    if (touchStart === null) return
    const diff = e.changedTouches[0].clientX - touchStart
    if (Math.abs(diff) > 50) go(diff > 0 ? -1 : 1)
    setTouchStart(null)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer: ${item.alt}`}
      onClick={onClose}
      onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-black/90 p-4"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 text-3xl text-white/80 transition hover:text-white"
      >
        ✕
      </button>

      {hasMany && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            go(-1)
          }}
          aria-label="Previous photo"
          className="absolute left-2 top-1/2 -translate-y-1/2 px-3 py-2 text-5xl text-white/70 transition hover:text-white md:left-6"
        >
          ‹
        </button>
      )}

      <div onClick={(e) => e.stopPropagation()}>
        {item.src ? (
          <img
            key={item.id}
            src={item.src}
            alt={item.alt}
            className="max-h-[75vh] max-w-full animate-fade-up rounded-xl object-contain"
          />
        ) : (
          <div
            key={item.id}
            className="flex h-64 w-64 animate-fade-up items-center justify-center rounded-xl bg-cream text-9xl md:h-96 md:w-96"
            aria-hidden="true"
          >
            {item.emoji}
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-white/80" aria-live="polite">
        {item.alt} · {index + 1} / {items.length}
      </p>

      {hasMany && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            go(1)
          }}
          aria-label="Next photo"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 text-5xl text-white/70 transition hover:text-white md:right-6"
        >
          ›
        </button>
      )}
    </div>
  )
}