import { useEffect, useState } from 'react'
import { seedReviews } from '../data/reviews'

const STORAGE_KEY = 'brewhaus-reviews'

function loadReviews() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function useReviews() {
  // Only reviews written by the visitor are saved. The seed reviews stay in code.
  const [userReviews, setUserReviews] = useState(loadReviews)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userReviews))
    } catch {
      // Storage can be full or blocked. Reviews still work without it.
    }
  }, [userReviews])

  const addReview = (review) => {
    const newReview = {
      ...review,
      id: `user-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
    }
    setUserReviews((prev) => [newReview, ...prev])
  }

  return { reviews: [...userReviews, ...seedReviews], addReview }
}