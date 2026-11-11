import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import Toast from './Toast'

const SITE = 'Brewhaus Coffee'

const titles = {
  '/': `${SITE} | Small-batch coffee, brewed with care`,
  '/menu': `Menu | ${SITE}`,
  '/gallery': `Gallery | ${SITE}`,
  '/reviews': `Reviews | ${SITE}`,
  '/about': `Our story | ${SITE}`,
  '/contact': `Contact | ${SITE}`,
  '/login': `Log in | ${SITE}`,
  '/register': `Create an account | ${SITE}`,
  '/orders': `Your orders | ${SITE}`,
}

export default function Layout() {
  const { pathname } = useLocation()

  // Give every page its own browser tab title
  useEffect(() => {
    document.title = titles[pathname] ?? `Page not found | ${SITE}`
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-caramel focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </div>
  )
}
