export default function About() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-caramel">
        Our Story
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
        A little shop with a big love for coffee
      </h1>

      <div className="mt-8 space-y-5 leading-relaxed text-roast">
        <p>
          Brewhaus started with a single espresso machine and a simple idea:
          coffee should be an experience, not just a routine. We built a space
          where neighbors become friends and every cup tastes like care.
        </p>
        <p>
          We work directly with small farms, roast in small batches each week,
          and bake our pastries fresh every morning. No shortcuts, no rush.
        </p>
        <p>
          Whether you're here for a quick flat white or an afternoon with a
          good book, there's always a warm seat waiting for you.
        </p>
      </div>
    </section>
  )
}