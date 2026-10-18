import { MAX_PRICE } from '../data/menu'

const temps = [
  { value: 'all', label: 'All' },
  { value: 'hot', label: 'Hot' },
  { value: 'iced', label: 'Iced' },
]

export default function FilterBar({ filters, onChange, onReset }) {
  return (
    <div className="grid gap-6 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2 lg:grid-cols-4">
      {/* Search */}
      <div>
        <label htmlFor="search" className="text-sm font-medium">
          Search
        </label>
        <input
          id="search"
          type="search"
          placeholder="Latte, croissant..."
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
          className="mt-1 w-full rounded-lg border border-latte px-4 py-2 outline-none focus:border-caramel focus:ring-2 focus:ring-caramel/30"
        />
      </div>

      {/* Temperature */}
      <div>
        <span className="text-sm font-medium">Temperature</span>
        <div className="mt-1 flex gap-2">
          {temps.map((temp) => (
            <button
              key={temp.value}
              onClick={() => onChange('temp', temp.value)}
              aria-pressed={filters.temp === temp.value}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
                filters.temp === temp.value
                  ? 'border-espresso bg-espresso text-cream'
                  : 'border-latte hover:border-caramel'
              }`}
            >
              {temp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Max price */}
      <div>
        <label htmlFor="price" className="text-sm font-medium">
          Max price: ${filters.maxPrice.toFixed(2)}
        </label>
        <input
          id="price"
          type="range"
          min="2"
          max={MAX_PRICE}
          step="0.25"
          value={filters.maxPrice}
          onChange={(e) => onChange('maxPrice', Number(e.target.value))}
          className="mt-3 w-full accent-caramel"
        />
      </div>

      {/* Vegan + reset */}
      <div className="flex items-end justify-between gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={filters.vegan}
            onChange={(e) => onChange('vegan', e.target.checked)}
            className="h-4 w-4 accent-caramel"
          />
          Vegan only
        </label>
        <button
          onClick={onReset}
          className="text-sm text-caramel underline hover:text-roast"
        >
          Reset
        </button>
      </div>
    </div>
  )
}