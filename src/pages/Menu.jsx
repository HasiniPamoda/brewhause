import { useState } from 'react'
import { categories, menuItems, MAX_PRICE } from '../data/menu'
import CategoryTabs from '../components/CategoryTabs'
import FilterBar from '../components/FilterBar'
import MenuItem from '../components/MenuItem'
import CustomizeModal from '../components/CustomizeModal'

const defaultFilters = {
  search: '',
  category: 'All',
  temp: 'all',
  vegan: false,
  maxPrice: MAX_PRICE,
}

export default function Menu() {
  const [filters, setFilters] = useState(defaultFilters)
  const [customizing, setCustomizing] = useState(null)

  // Update one filter and keep the rest unchanged
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => setFilters(defaultFilters)

  // Temporary: tomorrow this will call the real cart
  const handleAdd = (order) => {
    console.log('Added to cart:', order)
    setCustomizing(null)
  }

  // Drinks open the modal; pastries have no options, so they go straight in
  const handleSelect = (item) => {
    if (item.category === 'Pastries') {
      handleAdd({
        lineId: String(item.id),
        itemId: item.id,
        name: item.name,
        emoji: item.emoji,
        image: item.image,
        unitPrice: item.price,
        quantity: 1,
        options: null,
      })
    } else {
      setCustomizing(item)
    }
  }

  // Derived data: recalculated on every render, so it never gets out of sync
  const query = filters.search.trim().toLowerCase()

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      filters.category === 'All' || item.category === filters.category
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    const matchesTemp = filters.temp === 'all' || item.temp === filters.temp
    const matchesVegan = !filters.vegan || item.vegan
    const matchesPrice = item.price <= filters.maxPrice

    return (
      matchesCategory &&
      matchesSearch &&
      matchesTemp &&
      matchesVegan &&
      matchesPrice
    )
  })

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Our Menu</h1>
        <p className="mt-3 text-roast">
          Freshly brewed, freshly baked. Make it yours.
        </p>
      </div>

      <div className="mt-10">
        <CategoryTabs
          categories={categories}
          active={filters.category}
          onChange={(category) => updateFilter('category', category)}
        />
      </div>

      <div className="mt-8">
        <FilterBar
          filters={filters}
          onChange={updateFilter}
          onReset={resetFilters}
        />
      </div>

      <p className="mt-8 text-sm text-roast" aria-live="polite">
        Showing {filteredItems.length} of {menuItems.length} items
      </p>

      {filteredItems.length > 0 ? (
        <div className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <MenuItem key={item.id} item={item} onSelect={handleSelect} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl bg-cream px-6 py-16 text-center">
          <p className="text-5xl">🫗</p>
          <h2 className="mt-4 font-display text-2xl font-bold">
            Nothing matches your search
          </h2>
          <p className="mt-2 text-roast">
            Try a different keyword or loosen your filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 rounded-full bg-caramel px-8 py-3 font-medium text-white transition hover:bg-roast"
          >
            Clear all filters
          </button>
        </div>
      )}

      {customizing && (
        <CustomizeModal
          item={customizing}
          onClose={() => setCustomizing(null)}
          onAdd={handleAdd}
        />
      )}
    </section>
  )
}