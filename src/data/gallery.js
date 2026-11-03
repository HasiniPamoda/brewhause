// Load every photo in the gallery folder
const photos = import.meta.glob('../assets/gallery/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

// "01-latte-art-closeup.jpg" -> "Latte art closeup"
const toAlt = (path) => {
  const name = path
    .split('/')
    .pop()
    .replace(/\.\w+$/, '')
    .replace(/^\d+[-_]*/, '')
    .replace(/[-_]+/g, ' ')
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const fromFiles = Object.entries(photos)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src], index) => ({ id: index, src, alt: toAlt(path) }))

// Shown until you add real photos
const placeholders = [
  { id: 'p1', emoji: '☕', alt: 'Fresh latte with art' },
  { id: 'p2', emoji: '🥐', alt: 'Golden butter croissants' },
  { id: 'p3', emoji: '🧊', alt: 'Cold brew over ice' },
  { id: 'p4', emoji: '🍵', alt: 'Iced matcha latte' },
  { id: 'p5', emoji: '🧁', alt: 'Blueberry muffins' },
  { id: 'p6', emoji: '🍫', alt: 'Hot chocolate' },
]

export const galleryItems = fromFiles.length > 0 ? fromFiles : placeholders