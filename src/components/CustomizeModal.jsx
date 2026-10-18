import { useEffect, useState } from 'react'
import {
  sizes,
  syrups,
  toppings,
  MAX_PUMPS,
  MAX_SHOTS,
  SYRUP_PRICE_PER_PUMP,
  EXTRA_SHOT_PRICE,
  calculatePrice,
} from '../data/options'

const defaultSelection = {
  size: 'medium',
  syrups: {}, // { vanilla: 2, caramel: 1 } -> pumps per syrup
  toppings: [], // ['whipped-cream']
  shots: 0,
  notes: '',
}

function Section({ title, hint, children }) {
  return (
    <div className="border-t border-latte px-6 py-5">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        {hint && <span className="text-xs text-roast">{hint}</span>}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  )
}

function Stepper({ value, onMinus, onPlus, max, label }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onMinus}
        disabled={value === 0}
        aria-label={`Decrease ${label}`}
        className="h-8 w-8 rounded-full border border-latte text-lg leading-none transition hover:border-caramel disabled:opacity-30"
      >
        −
      </button>
      <span className="w-4 text-center font-medium" aria-live="polite">
        {value}
      </span>
      <button
        onClick={onPlus}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
        className="h-8 w-8 rounded-full border border-latte text-lg leading-none transition hover:border-caramel disabled:opacity-30"
      >
        +
      </button>
    </div>
  )
}

export default function CustomizeModal({ item, onClose, onAdd }) {
  const [selection, setSelection] = useState(defaultSelection)

  // Close on Escape and stop the page behind from scrolling
  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const setSize = (size) => setSelection((prev) => ({ ...prev, size }))

  const changePumps = (id, delta) => {
    setSelection((prev) => {
      const current = prev.syrups[id] ?? 0
      const next = Math.min(MAX_PUMPS, Math.max(0, current + delta))
      const updated = { ...prev.syrups, [id]: next }
      if (next === 0) delete updated[id]
      return { ...prev, syrups: updated }
    })
  }

  const toggleTopping = (id) => {
    setSelection((prev) => ({
      ...prev,
      toppings: prev.toppings.includes(id)
        ? prev.toppings.filter((t) => t !== id)
        : [...prev.toppings, id],
    }))
  }

  const changeShots = (delta) => {
    setSelection((prev) => ({
      ...prev,
      shots: Math.min(MAX_SHOTS, Math.max(0, prev.shots + delta)),
    }))
  }

  const total = calculatePrice(item, selection)

  const handleAdd = () => {
    // Sort everything so two identical drinks always produce the same lineId.
    // On Day 4 the cart uses lineId to merge identical orders into one row.
    const options = {
      size: selection.size,
      syrups: Object.entries(selection.syrups).sort(([a], [b]) =>
        a.localeCompare(b)
      ),
      toppings: [...selection.toppings].sort(),
      shots: selection.shots,
      notes: selection.notes.trim(),
    }

    onAdd({
      lineId: `${item.id}:${JSON.stringify(options)}`,
      itemId: item.id,
      name: item.name,
      emoji: item.emoji,
      image: item.image,
      unitPrice: Number(total.toFixed(2)),
      quantity: 1,
      options,
    })
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-espresso/60 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Customize ${item.name}`}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-foam shadow-2xl sm:rounded-3xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="text-5xl" aria-hidden="true">
              {item.emoji}
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold">{item.name}</h2>
              <p className="text-sm text-roast">
                Base price ${item.price.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl text-roast transition hover:text-espresso"
          >
            ✕
          </button>
        </div>

        {/* Scrollable options */}
        <div className="flex-1 overflow-y-auto">
          <Section title="Size">
            <div className="grid grid-cols-3 gap-3">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSize(size.id)}
                  aria-pressed={selection.size === size.id}
                  className={`rounded-xl border-2 px-3 py-3 text-center transition ${
                    selection.size === size.id
                      ? 'border-caramel bg-cream'
                      : 'border-latte hover:border-caramel/60'
                  }`}
                >
                  <span className="block font-medium">{size.label}</span>
                  <span className="block text-xs text-roast">{size.oz}</span>
                  {size.price > 0 && (
                    <span className="block text-xs text-caramel">
                      +${size.price.toFixed(2)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Section>

          <Section
            title="Flavor Syrups"
            hint={`+$${SYRUP_PRICE_PER_PUMP.toFixed(2)} per pump`}
          >
            <ul className="space-y-3">
              {syrups.map((syrup) => {
                const pumps = selection.syrups[syrup.id] ?? 0
                return (
                  <li key={syrup.id} className="flex items-center justify-between">
                    <span className={pumps > 0 ? 'font-medium' : ''}>
                      <span aria-hidden="true">{syrup.emoji}</span> {syrup.name}
                    </span>
                    <Stepper
                      value={pumps}
                      max={MAX_PUMPS}
                      label={`${syrup.name} pumps`}
                      onMinus={() => changePumps(syrup.id, -1)}
                      onPlus={() => changePumps(syrup.id, 1)}
                    />
                  </li>
                )
              })}
            </ul>
          </Section>

          <Section title="Toppings">
            <div className="flex flex-wrap gap-2">
              {toppings.map((topping) => {
                const selected = selection.toppings.includes(topping.id)
                return (
                  <button
                    key={topping.id}
                    onClick={() => toggleTopping(topping.id)}
                    aria-pressed={selected}
                    className={`rounded-full border-2 px-4 py-2 text-sm transition ${
                      selected
                        ? 'border-caramel bg-caramel text-white'
                        : 'border-latte hover:border-caramel/60'
                    }`}
                  >
                    {selected && '✓ '}
                    {topping.name}{' '}
                    <span className={selected ? 'text-white/80' : 'text-roast'}>
                      +${topping.price.toFixed(2)}
                    </span>
                  </button>
                )
              })}
            </div>
          </Section>

          <Section
            title="Extra Espresso Shots"
            hint={`+$${EXTRA_SHOT_PRICE.toFixed(2)} each`}
          >
            <Stepper
              value={selection.shots}
              max={MAX_SHOTS}
              label="espresso shots"
              onMinus={() => changeShots(-1)}
              onPlus={() => changeShots(1)}
            />
          </Section>

          <Section title="Special Instructions" hint="Optional">
            <textarea
              rows="2"
              maxLength={100}
              placeholder="e.g. light ice, extra hot"
              value={selection.notes}
              onChange={(e) =>
                setSelection((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="w-full rounded-lg border border-latte bg-white px-4 py-3 text-sm outline-none focus:border-caramel focus:ring-2 focus:ring-caramel/30"
            />
          </Section>
        </div>

        {/* Sticky footer with live total */}
        <div className="border-t border-latte bg-white px-6 py-4">
          <button
            onClick={handleAdd}
            className="flex w-full items-center justify-between rounded-full bg-caramel px-8 py-3 font-medium text-white transition hover:bg-roast"
          >
            <span>Add to Cart</span>
            <span>${total.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}