import jwt from 'jsonwebtoken'

const isProduction = process.env.NODE_ENV === 'production'
const secret =
  process.env.JWT_SECRET || (isProduction ? null : 'dev-only-secret-change-me')

if (!secret) {
  console.error('JWT_SECRET is required in production. Set it in your host settings.')
  process.exit(1)
}
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Using an insecure development secret.')
}

export function signToken(user) {
  return jwt.sign({ sub: String(user.id) }, secret, {
    algorithm: 'HS256',
    expiresIn: '7d',
  })
}

// Express middleware: only lets the request through if it has a valid token
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Please log in first.' })
  }

  try {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] })
    req.userId = Number(payload.sub)
    next()
  } catch {
    res.status(401).json({ error: 'Your session has expired. Please log in again.' })
  }
}
