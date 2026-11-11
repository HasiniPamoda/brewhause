import StarDisplay from './StarDisplay'

export default function ReviewCard({ review, canDelete, onDelete }) {
  const initials = review.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const date = new Date(`${review.date}T00:00:00`).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <li className="animate-fade-up rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-caramel font-semibold text-white"
          aria-hidden="true"
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-4">
            <h3 className="font-semibold">{review.name}</h3>
            <time dateTime={review.date} className="text-xs text-roast">
              {date}
            </time>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <StarDisplay value={review.rating} />
            {review.drink && (
              <span className="rounded-full bg-latte px-3 py-1 text-xs font-medium text-roast">
                {review.drink}
              </span>
            )}
          </div>

          <p className="mt-3 leading-relaxed text-roast">{review.comment}</p>

          {canDelete && (
            <button
              onClick={() => {
                if (window.confirm('Delete your review?')) onDelete(review.id)
              }}
              className="mt-3 text-sm text-roast underline transition hover:text-red-600"
            >
              Delete my review
            </button>
          )}
        </div>
      </div>
    </li>
  )
}
