import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/useAuth'

const links = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { totalItems, openCart } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `transition hover:text-caramel ${
      isActive ? 'font-semibold text-caramel' : 'text-latte'
    }`

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-espresso/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl font-bold text-cream">
          Brewhaus <span className="text-caramel">☕</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-5 md:flex lg:gap-8">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end className={linkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {/* Desktop account area */}
          <div className="hidden items-center gap-4 md:flex">
            {user ? (
              <>
                <NavLink to="/orders" className={linkClass}>
                  Orders
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="text-sm text-latte transition hover:text-caramel"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-full border border-caramel px-4 py-1.5 text-sm text-caramel transition hover:bg-caramel hover:text-white"
              >
                Log in
              </Link>
            )}
          </div>

          {/* Cart button with item count */}
          <button
            onClick={openCart}
            aria-label={`Open cart, ${totalItems} items`}
            className="relative text-2xl text-cream transition hover:text-caramel"
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-caramel px-1 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            className="text-2xl text-cream md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className="flex flex-col gap-4 px-6 pb-6 md:hidden">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li className="border-t border-roast pt-4">
            {user ? (
              <div className="flex flex-col gap-4">
                <NavLink to="/orders" className={linkClass} onClick={() => setOpen(false)}>
                  Orders
                </NavLink>
                <button onClick={handleLogout} className="text-left text-latte hover:text-caramel">
                  Log out ({user.name.split(' ')[0]})
                </button>
              </div>
            ) : (
              <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>
                Log in / Sign up
              </NavLink>
            )}
          </li>
        </ul>
      )}
    </header>
  )
}
