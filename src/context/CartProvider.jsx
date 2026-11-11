import { useCallback, useEffect, useState } from 'react'
import { CartContext } from './cartContext'

const STORAGE_KEY = 'brewhaus-cart'
const MAX_QUANTITY = 20

// Read the saved cart once, when the app starts
function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export default function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)
  const [isOpen, setIsOpen] = useState(false)
  const [toast, setToast] = useState(null)

  // Save the cart whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Storage can be full or blocked. The cart still works without it.
    }
  }, [items])

  // Hide the toast after a short delay
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const addItem = (order) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.lineId === order.lineId)

      // Identical drink already in the cart? Increase its quantity.
      if (existing) {
        return prev.map((item) =>
          item.lineId === order.lineId
            ? {
                ...item,
                quantity: Math.min(MAX_QUANTITY, item.quantity + order.quantity),
              }
            : item
        )
      }
      return [...prev, order]
    })
    setToast({ text: `${order.name} added to cart`, id: Date.now() })
  }

  const removeItem = (lineId) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId))
  }

  const updateQuantity = (lineId, quantity) => {
    if (quantity < 1) {
      removeItem(lineId)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.lineId === lineId
          ? { ...item, quantity: Math.min(MAX_QUANTITY, quantity) }
          : item
      )
    )
  }

  const clearCart = () => setItems([])

  // Derived values: calculated from items, never stored separately
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )

  const value = {
    items,
    totalItems,
    subtotal,
    isOpen,
    toast,
    openCart,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
