import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const inputClass =
  'mt-1 w-full rounded-lg border border-latte bg-white px-4 py-3 outline-none focus:border-caramel focus:ring-2 focus:ring-caramel/30'

export default function Register() {
  const { user, register } = useAuth()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to={from} replace />

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.name.trim().length < 2) return setError('Enter your name.')
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      return setError('Enter a valid email address.')
    if (form.password.length < 8)
      return setError('Password must be at least 8 characters.')

    setSubmitting(true)
    try {
      await register(form.name.trim(), form.email.trim(), form.password)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-20">
      <h1 className="font-display text-4xl font-bold">Create an account</h1>
      <p className="mt-3 text-roast">
        Order faster, track past orders and leave reviews.
      </p>

      {error && (
        <div role="alert" className="mt-6 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className="font-medium">Name</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            maxLength={40}
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className="font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className="font-medium">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-roast">At least 8 characters.</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-caramel px-8 py-3 font-medium text-white transition hover:bg-roast disabled:opacity-60"
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-roast">
        Already have an account?{' '}
        <Link to="/login" state={location.state} className="font-medium text-caramel underline hover:text-roast">
          Log in
        </Link>
      </p>
    </section>
  )
}
