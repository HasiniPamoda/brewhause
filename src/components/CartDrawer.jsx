import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/useAuth'
import { api } from '../lib/api'
import { describeOptions } from '../utils/describeOptions'

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    subtotal,
  } = useCart()
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  // Close on Escape and lock page scrolling while the drawer is open
  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e) => e.key === 'Escape' && closeCart()
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeCart])

  const handleCheckout = async () => {
    // Guests log in first. The cart is saved in the browser, so nothing is lost.
    if (!user) {
      closeCart()
      navigate('/login', { state: { from: '/menu', reason: 'checkout' } })
      return
    }

    setPlacing(true)
    setError('')

    try {
      await api('/orders', {
        method: 'POST',
        token,
        body: {
          items: items.map(({ name, emoji, unitPrice, quantity, options }) => ({
            name,
            emoji,
            unitPrice,
            quantity,
            options,
          })),
        },
      })
      clearCart()
      closeCart()
      navigate('/orders', { state: { placed: true } })
    } catch (err) {
      setError(err.message)
    } finally {
      setPlacing(false)
    }
  }

  return (
    <>
      {/* Dark backdrop */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-espresso/60 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Sliding panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col bg-foam shadow-2xl transition-[transform,visibility] duration-300 ${
          isOpen ? 'translate-x-0' : 'invisible translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-latte px-6 py-5">
          <h2 className="font-display text-2xl font-bold">
            Your Order{' '}
            <span className="text-base font-normal text-roast">({totalItems})</span>
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-2xl text-roast transition hover:text-espresso"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="text-6xl">🛍️</p>
            <h3 className="mt-4 font-display text-xl font-bold">Your cart is empty</h3>
            <p className="mt-2 text-sm text-roast">
              Add a drink or a pastry to get started.
            </p>
            <button
              onClick={closeCart}
              className="mt-6 rounded-full bg-caramel px-8 py-3 font-medium text-white transition hover:bg-roast"
            >
              Keep browsing
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-latte overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.lineId} className="flex gap-4 py-5">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-cream text-4xl"
                      aria-hidden="true"
                    >
                      {item.emoji}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.lineId)}
                        aria-label={`Remove ${item.name}`}
                        className="text-roast transition hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>

                    {item.options && (
                      <p className="mt-1 text-xs leading-relaxed text-roast">
                        {describeOptions(item.options)}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                          aria-label={`Decrease ${item.name} quantity`}
                          className="h-8 w-8 rounded-full border border-latte text-lg leading-none transition hover:border-caramel"
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                          aria-label={`Increase ${item.name} quantity`}
                          className="h-8 w-8 rounded-full border border-latte text-lg leading-none transition hover:border-caramel"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-semibold text-caramel">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-latte bg-white px-6 py-5">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {error && (
                <p role="alert" className="mt-3 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-800">
                  {error}
                </p>
              )}

              <button
                onClick={handleCheckout}
                disabled={placing}
                className="mt-4 w-full rounded-full bg-caramel px-8 py-3 font-medium text-white transition hover:bg-roast disabled:opacity-60"
              >
                {placing ? 'Placing order...' : user ? 'Place order' : 'Log in to order'}
              </button>
              <button
                onClick={clearCart}
                className="mt-3 w-full text-sm text-roast underline transition hover:text-espresso"
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
