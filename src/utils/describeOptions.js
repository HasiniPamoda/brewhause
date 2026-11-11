import { sizes, syrups, toppings } from '../data/options'

export function describeOptions(options) {
  if (!options) return ''

  const parts = []

  const size = sizes.find((s) => s.id === options.size)
  if (size) parts.push(size.label)

  options.syrups.forEach(([id, pumps]) => {
    const syrup = syrups.find((s) => s.id === id)
    if (syrup) parts.push(`${pumps}× ${syrup.name}`)
  })

  options.toppings.forEach((id) => {
    const topping = toppings.find((t) => t.id === id)
    if (topping) parts.push(topping.name)
  })

  if (options.shots > 0) {
    parts.push(`${options.shots} extra shot${options.shots > 1 ? 's' : ''}`)
  }

  if (options.notes) parts.push(`"${options.notes}"`)

  return parts.join(' · ')
}
