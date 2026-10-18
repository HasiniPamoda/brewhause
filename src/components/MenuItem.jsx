export default function MenuItem({ item, onSelect }) {
  const isDrink = item.category !== 'Pastries'

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-48 w-full object-cover"
        />
      ) : (
        <div
          className="flex h-48 items-center justify-center bg-cream text-7xl"
          aria-hidden="true"
        >
          {item.emoji}
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold">{item.name}</h3>
          <p className="font-semibold text-caramel">${item.price.toFixed(2)}</p>
        </div>

        <p className="mt-2 flex-1 text-sm text-roast">{item.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.temp !== 'none' && (
            <span className="rounded-full bg-latte px-3 py-1 text-xs font-medium capitalize text-roast">
              {item.temp}
            </span>
          )}
          {item.vegan && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              Vegan
            </span>
          )}
        </div>

        <button
          onClick={() => onSelect(item)}
          className="mt-5 rounded-full bg-caramel px-6 py-2 text-sm font-medium text-white transition hover:bg-roast"
        >
          {isDrink ? 'Customize' : 'Add to Cart'}
        </button>
      </div>
    </article>
  )
}