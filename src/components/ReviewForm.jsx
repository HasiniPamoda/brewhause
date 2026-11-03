import { useState } from 'react'
import { menuItems } from '../data/menu'
import StarInput from './StarInput'

const initialForm = { name: '', drink: '', rating: 0, comment: '' }
const MAX_COMMENT = 300

const inputClass =
  'mt-1 w-full rounded-lg border border-latte bg-white px-4 py-3 outline-none focus:border-caramel focus:ring-2 focus:ring-caramel/30'

export default function ReviewForm({ onSubmit }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSent(false)
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Please enter your name.'
    if (form.rating === 0) newErrors.rating = 'Please choose a star rating.'
    if (form.comment.trim().length < 10)
      newErrors.comment = 'Please write at least 10 characters.'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    onSubmit({
      name: form.name.trim(),
      drink: form.drink,
      rating: form.rating,
      comment: form.comment.trim(),
    })
    setForm(initialForm)
    setSent(true)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {sent && (
        <div
          role="status"
          className="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800"
        >
          Thank you! Your review has been posted.
        </div>
      )}

      <div>
        <label htmlFor="review-name" className="font-medium">
          Your name
        </label>
        <input
          id="review-name"
          name="name"
          maxLength={40}
          value={form.name}
          onChange={handleChange}
          className={inputClass}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="review-drink" className="font-medium">
          What did you try?{' '}
          <span className="text-sm font-normal text-roast">(optional)</span>
        </label>
        <select
          id="review-drink"
          name="drink"
          value={form.drink}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Select an item</option>
          {menuItems.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className="font-medium">Your rating</span>
        <div className="mt-1">
          <StarInput
            value={form.rating}
            onChange={(rating) => {
              setForm({ ...form, rating })
              setSent(false)
            }}
          />
        </div>
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
        )}
      </div>

      <div>
        <label htmlFor="review-comment" className="font-medium">
          Your review
        </label>
        <textarea
          id="review-comment"
          name="comment"
          rows="4"
          maxLength={MAX_COMMENT}
          value={form.comment}
          onChange={handleChange}
          className={inputClass}
        />
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-red-600">{errors.comment}</span>
          <span className="text-roast">
            {form.comment.length}/{MAX_COMMENT}
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-caramel px-8 py-3 font-medium text-white transition hover:bg-roast"
      >
        Post Review
      </button>
    </form>
  )
}