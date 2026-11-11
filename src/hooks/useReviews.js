import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/useAuth'

export function useReviews() {
  const { token } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    api('/reviews')
      .then((data) => {
        if (!cancelled) setReviews(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const addReview = async (review) => {
    const created = await api('/reviews', { method: 'POST', body: review, token })
    setReviews((prev) => [created, ...prev])
  }

  const removeReview = async (id) => {
    await api(`/reviews/${id}`, { method: 'DELETE', token })
    setReviews((prev) => prev.filter((review) => review.id !== id))
  }

  return { reviews, loading, error, addReview, removeReview }
}
