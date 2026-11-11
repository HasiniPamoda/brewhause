import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const inputClass =
  'mt-1 w-full rounded-lg border border-latte bg-white px-4 py-3 outline-none focus:border-caramel focus:ring-2 focus:ring-caramel/30'

export default function Login() {
  const { user, login } = useAuth()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Already logged in? Go where they were heading.
  if (user) return <Navigate to={from} replace />

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email.trim() || !form.password) {
      setError('Enter your email and password.')
      return
    }

    setSubmitting(true)
    try {
      await login(form.email.trim(), form.password)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-20">
      <h1 className="font-display text-4xl font-bold">Log in</h1>
      <p className="mt-3 text-roast">
        {location.state?.reason === 'checkout'
          ? 'Log in to place your order. Your cart is saved.'
          : 'Welcome back. Your orders and reviews are waiting.'}
      </p>

      {error && (
        <div role="alert" className="mt-6 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
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
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-caramel px-8 py-3 font-medium text-white transition hover:bg-roast disabled:opacity-60"
        >
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-roast">
        New here?{' '}
        <Link to="/register" state={location.state} className="font-medium text-caramel underline hover:text-roast">
          Create an account
        </Link>
      </p>
    </section>
  )
}
