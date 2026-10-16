export default function Home() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-cream px-6 text-center">
      <h1 className="font-display text-5xl font-bold text-espresso md:text-7xl">
        Brewhaus Coffee
      </h1>
      <p className="mt-4 max-w-md text-roast">
        Small-batch coffee, brewed with care.
      </p>
      <button className="mt-8 rounded-full bg-caramel px-8 py-3 font-medium text-white transition hover:bg-roast">
        View Menu
      </button>
    </section>
  )
}