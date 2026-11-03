import StarDisplay from './StarDisplay'

export default function ReviewSummary({ reviews }) {
  const total = reviews.length
  const average = total
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
    : 0

  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => review.rating === star).length,
  }))

  return (
    <div className="grid gap-8 rounded-2xl bg-white p-8 shadow-sm sm:grid-cols-[auto_1fr] sm:items-center">
      <div className="text-center sm:px-6">
        <p className="font-display text-6xl font-bold">{average.toFixed(1)}</p>
        <StarDisplay value={average} className="mt-2 text-2xl" />
        <p className="mt-1 text-sm text-roast">
          {total} review{total !== 1 ? 's' : ''}
        </p>
      </div>

      <ul className="space-y-2">
        {counts.map(({ star, count }) => (
          <li key={star} className="flex items-center gap-3 text-sm">
            <span className="w-10 shrink-0">{star} ★</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-latte/60">
              <div
                className="h-full rounded-full bg-caramel transition-all duration-500"
                style={{ width: total ? `${(count / total) * 100}%` : '0%' }}
              />
            </div>
            <span className="w-6 text-right text-roast">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}