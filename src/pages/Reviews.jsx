import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useReviews } from '../hooks/useReviews'
import ReviewSummary from '../components/ReviewSummary'
import ReviewCard from '../components/ReviewCard'
import ReviewForm from '../components/ReviewForm'

const sorters = {
  newest: (a, b) => b.date.localeCompare(a.date) || b.id - a.id,
  highest: (a, b) => b.rating - a.rating,
  lowest: (a, b) => a.rating - b.rating,
}

export default function Reviews() {
  const { user } = useAuth()
  const { reviews, loading, error, addReview, removeReview } = useReviews()
  const [sort, setSort] = useState('newest')
  const location = useLocation()

  const sortedReviews = [...reviews].sort(sorters[sort])

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold md:text-5xl">
          Customer Reviews
        </h1>
        <p className="mt-3 text-roast">
          Honest words from the people who drink our coffee.
        </p>
      </div>

      {error && (
        <div role="alert" className="mx-auto mt-8 max-w-xl rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-12 text-center text-roast">Loading reviews...</p>
      ) : (
        <>
          <div className="mt-10">
            <ReviewSummary reviews={reviews} />
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
            <div>
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-2xl font-bold">What people say</h2>
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-roast">Sort by</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-lg border border-latte bg-white px-3 py-2 outline-none focus:border-caramel"
                  >
                    <option value="newest">Newest</option>
                    <option value="highest">Highest rated</option>
                    <option value="lowest">Lowest rated</option>
                  </select>
                </label>
              </div>

              <ul className="mt-6 space-y-5">
                {sortedReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    canDelete={Boolean(user) && review.userId === user.id}
                    onDelete={removeReview}
                  />
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="font-display text-2xl font-bold">Leave a review</h2>

              {user ? (
                <div className="mt-6">
                  <ReviewForm userName={user.name} onSubmit={addReview} />
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-sm text-roast">
                    Log in to share your experience.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      to="/login"
                      state={{ from: location.pathname }}
                      className="rounded-full bg-caramel px-6 py-2 text-sm font-medium text-white transition hover:bg-roast"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      state={{ from: location.pathname }}
                      className="rounded-full border-2 border-espresso px-6 py-2 text-sm font-medium transition hover:bg-espresso hover:text-cream"
                    >
                      Create account
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
