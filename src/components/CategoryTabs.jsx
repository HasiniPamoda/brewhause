export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          aria-pressed={active === category}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            active === category
              ? 'bg-espresso text-cream'
              : 'bg-latte/60 text-roast hover:bg-latte'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}