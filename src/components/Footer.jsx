export default function Footer() {
  return (
    <footer className="bg-espresso text-latte">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl font-bold text-cream">
            Brewhaus ☕
          </h3>
          <p className="mt-3 text-sm">
            Small-batch coffee, brewed with care.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-cream">Opening Hours</h4>
          <ul className="mt-3 space-y-1 text-sm">
            <li>Mon – Fri: 7:00 AM – 7:00 PM</li>
            <li>Sat – Sun: 8:00 AM – 5:00 PM</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-cream">Visit Us</h4>
          <ul className="mt-3 space-y-1 text-sm">
            <li>123 Kandy Road</li>
            <li>hello@brewhaus.com</li>
            <li>+94 123-4567</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-roast py-4 text-center text-xs">
        © {new Date().getFullYear()} Brewhaus Coffee. All rights reserved.
      </div>
    </footer>
  )
}