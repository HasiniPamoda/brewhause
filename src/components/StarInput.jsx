import { useState } from 'react'

export default function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      className="flex gap-1"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          className={`text-3xl transition hover:scale-110 ${
            star <= shown ? 'text-caramel' : 'text-latte'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}