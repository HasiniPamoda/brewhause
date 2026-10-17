import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="text-6xl">☕</p>
      <h1 className="mt-4 font-display text-4xl font-bold">Page not found</h1>
      <p className="mt-3 text-roast">
        Looks like this page went cold. Let's get you back.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-caramel px-8 py-3 font-medium text-white transition hover:bg-roast"
      >
        Back to Home
      </Link>
    </section>
  )
}