import { useEffect, useState } from 'react'
import { AuthContext } from './authContext'
import { api } from '../lib/api'

const TOKEN_KEY = 'brewhaus-token'

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function saveToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Storage can be blocked. Login still works for this visit.
  }
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(readToken)
  const [user, setUser] = useState(null)
  // While we check a saved token with the server, protected pages should wait
  const [loading, setLoading] = useState(() => Boolean(readToken()))

  // When the app starts (or the token changes), ask the server who this is
  useEffect(() => {
    if (!token) return

    let cancelled = false

    api('/auth/me', { token })
      .then((data) => {
        if (!cancelled) setUser(data.user)
      })
      .catch((error) => {
        // 401 means the token is expired or invalid, so forget it
        if (!cancelled && error.status === 401) {
          saveToken(null)
          setToken(null)
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token])

  const startSession = (data) => {
    saveToken(data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const login = async (email, password) => {
    startSession(await api('/auth/login', { method: 'POST', body: { email, password } }))
  }

  const register = async (name, email, password) => {
    startSession(
      await api('/auth/register', { method: 'POST', body: { name, email, password } })
    )
  }

  const logout = () => {
    saveToken(null)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
