export const sizes = [
  { id: 'small', label: 'Small', oz: '8 oz', price: 0 },
  { id: 'medium', label: 'Medium', oz: '12 oz', price: 0.5 },
  { id: 'large', label: 'Large', oz: '16 oz', price: 1.0 },
]

export const syrups = [
  { id: 'vanilla', name: 'Vanilla', emoji: '🍦' },
  { id: 'caramel', name: 'Caramel', emoji: '🍯' },
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓' },
  { id: 'hazelnut', name: 'Hazelnut', emoji: '🌰' },
  { id: 'mocha', name: 'Mocha', emoji: '🍫' },
  { id: 'brown-sugar', name: 'Brown Sugar', emoji: '🤎' },
]

export const toppings = [
  { id: 'whipped-cream', name: 'Whipped Cream', price: 0.75 },
  { id: 'cold-foam', name: 'Vanilla Cold Foam', price: 1.0 },
  { id: 'caramel-drizzle', name: 'Caramel Drizzle', price: 0.5 },
  { id: 'chocolate-drizzle', name: 'Chocolate Drizzle', price: 0.5 },
  { id: 'cinnamon', name: 'Cinnamon Powder', price: 0.25 },
]

export const SYRUP_PRICE_PER_PUMP = 0.5
export const MAX_PUMPS = 4
export const EXTRA_SHOT_PRICE = 0.75
export const MAX_SHOTS = 3

// Base price + everything the customer selected
export function calculatePrice(item, selection) {
  const size = sizes.find((s) => s.id === selection.size)

  const totalPumps = Object.values(selection.syrups).reduce(
    (sum, pumps) => sum + pumps,
    0
  )
  const toppingTotal = selection.toppings.reduce(
    (sum, id) => sum + (toppings.find((t) => t.id === id)?.price ?? 0),
    0
  )

  return (
    item.price +
    size.price +
    totalPumps * SYRUP_PRICE_PER_PUMP +
    toppingTotal +
    selection.shots * EXTRA_SHOT_PRICE
  )
}