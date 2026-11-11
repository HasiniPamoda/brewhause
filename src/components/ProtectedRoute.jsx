import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Wrap a page in this to make it available to logged-in users only
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <p className="py-32 text-center text-roast">Loading your account...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
