import { useState } from 'react'
import { menuItems } from '../data/menu'
import StarInput from './StarInput'

const initialForm = { drink: '', rating: 0, comment: '' }
const MAX_COMMENT = 300

const inputClass =
  'mt-1 w-full rounded-lg border border-latte bg-white px-4 py-3 outline-none focus:border-caramel focus:ring-2 focus:ring-caramel/30'

export default function ReviewForm({ userName, onSubmit }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSent(false)
  }

  const validate = () => {
    const newErrors = {}
    if (form.rating === 0) newErrors.rating = 'Choose a star rating.'
    if (form.comment.trim().length < 10)
      newErrors.comment = 'Write at least 10 characters.'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSubmitting(true)
    try {
      await onSubmit({
        drink: form.drink,
        rating: form.rating,
        comment: form.comment.trim(),
      })
      setForm(initialForm)
      setSent(true)
    } catch (err) {
      setServerError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <p className="text-sm text-roast">
        Posting as <span className="font-semibold text-espresso">{userName}</span>
      </p>

      {sent && (
        <div role="status" className="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800">
          Review posted. Thank you!
        </div>
      )}

      {serverError && (
        <div role="alert" className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">
          {serverError}
        </div>
      )}

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
        {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating}</p>}
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
        disabled={submitting}
        className="w-full rounded-full bg-caramel px-8 py-3 font-medium text-white transition hover:bg-roast disabled:opacity-60"
      >
        {submitting ? 'Posting...' : 'Post review'}
      </button>
    </form>
  )
}
