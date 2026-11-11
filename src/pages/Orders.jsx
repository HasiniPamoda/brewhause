import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { api } from '../lib/api'
import { describeOptions } from '../utils/describeOptions'

export default function Orders() {
  const { user, token } = useAuth()
  const location = useLocation()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    api('/orders', { token })
      .then((data) => {
        if (!cancelled) setOrders(data)
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
  }, [token])

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-bold">Your orders</h1>
      <p className="mt-2 text-roast">Signed in as {user.email}</p>

      {location.state?.placed && (
        <div role="status" className="mt-6 rounded-lg bg-green-100 px-4 py-3 text-green-800">
          Order placed. Thank you! We will have it ready for you soon.
        </div>
      )}

      {loading && <p className="mt-10 text-roast">Loading your orders...</p>}

      {error && (
        <div role="alert" className="mt-6 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="mt-10 rounded-2xl bg-cream px-6 py-14 text-center">
          <p className="text-5xl">☕</p>
          <h2 className="mt-4 font-display text-2xl font-bold">No orders yet</h2>
          <p className="mt-2 text-roast">Your first order will show up here.</p>
          <Link
            to="/menu"
            className="mt-6 inline-block rounded-full bg-caramel px-8 py-3 font-medium text-white transition hover:bg-roast"
          >
            Browse the menu
          </Link>
        </div>
      )}

      <ul className="mt-8 space-y-6">
        {orders.map((order) => (
          <li key={order.id} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-latte pb-4">
              <h2 className="font-display text-xl font-bold">Order #{order.id}</h2>
              <time dateTime={order.date} className="text-sm text-roast">
                {new Date(order.date).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </time>
            </div>

            <ul className="divide-y divide-latte">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {item.quantity} × {item.name}
                    </p>
                    {item.options && (
                      <p className="mt-0.5 text-xs leading-relaxed text-roast">
                        {describeOptions(item.options)}
                      </p>
                    )}
                  </div>
                  <p className="shrink-0 text-roast">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            <p className="flex justify-between border-t border-latte pt-4 text-lg font-semibold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
