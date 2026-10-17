import { Link } from 'react-router-dom'

const featured = [
  { id: 1, emoji: '☕', name: 'Signature Latte', desc: 'Double espresso, steamed milk, a touch of caramel.', price: 4.5 },
  { id: 2, emoji: '🧊', name: 'Cold Brew', desc: 'Steeped for 18 hours, smooth and low in acidity.', price: 4.0 },
  { id: 3, emoji: '🥐', name: 'Butter Croissant', desc: 'Baked fresh every morning, flaky and golden.', price: 3.25 },
]

const perks = [
  { title: 'Ethically Sourced', text: 'Beans from farms we know by name.' },
  { title: 'Roasted Weekly', text: 'Small batches for peak freshness.' },
  { title: 'Made With Care', text: 'Every cup is crafted by a trained barista.' },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center bg-cream px-6 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-caramel">
          Welcome to Brewhaus
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold text-espresso md:text-7xl">
          Coffee worth <br className="hidden md:block" /> slowing down for
        </h1>
        <p className="mt-6 max-w-md text-roast">
          Small-batch coffee, fresh pastries, and a cozy corner to call your own.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/menu"
            className="rounded-full bg-caramel px-8 py-3 font-medium text-white transition hover:bg-roast"
          >
            View Menu
          </Link>
          <Link
            to="/about"
            className="rounded-full border-2 border-espresso px-8 py-3 font-medium text-espresso transition hover:bg-espresso hover:text-cream"
          >
            Our Story
          </Link>
        </div>
      </section>

      {/* Featured items */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
          Customer Favorites
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {featured.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-6xl">{item.emoji}</div>
              <h3 className="mt-4 font-display text-xl font-bold">{item.name}</h3>
              <p className="mt-2 text-sm text-roast">{item.desc}</p>
              <p className="mt-4 font-semibold text-caramel">
                ${item.price.toFixed(2)}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-latte/50 px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
          {perks.map((perk) => (
            <div key={perk.title} className="text-center">
              <h3 className="font-display text-xl font-bold">{perk.title}</h3>
              <p className="mt-2 text-roast">{perk.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}