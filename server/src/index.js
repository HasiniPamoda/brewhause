import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import db from './db.js'
import { signToken, requireAuth } from './auth.js'

const app = express()
const PORT = Number(process.env.PORT) || 4000

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean)

app.set('trust proxy', 1) // hosts like Render sit behind a proxy
app.use(helmet())
app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))

// Slow down password guessing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again in a few minutes.' },
})

const EMAIL_RE = /^\S+@\S+\.\S+$/
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10)

const fail = (res, status, message) => res.status(status).json({ error: message })
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email })

// ---------- Prepared statements ----------
const findUserByEmail = db.prepare('SELECT * FROM users WHERE email = ?')
const findUserById = db.prepare('SELECT * FROM users WHERE id = ?')
const insertUser = db.prepare(
  'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
)

// ---------- Health ----------
app.get('/', (req, res) => res.json({ name: 'Brewhaus API', status: 'ok' }))
app.get('/api/health', (req, res) => res.json({ ok: true }))

// ---------- Auth ----------
app.post('/api/auth/register', authLimiter, async (req, res) => {
  const body = req.body ?? {}
  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  const password = String(body.password ?? '')

  if (name.length < 2 || name.length > 40)
    return fail(res, 400, 'Name must be between 2 and 40 characters.')
  if (!EMAIL_RE.test(email) || email.length > 120)
    return fail(res, 400, 'Please enter a valid email address.')
  if (password.length < 8 || password.length > 72)
    return fail(res, 400, 'Password must be between 8 and 72 characters.')
  if (findUserByEmail.get(email))
    return fail(res, 409, 'An account with this email already exists.')

  const hash = await bcrypt.hash(password, 10)

  try {
    const { lastInsertRowid } = insertUser.run(name, email, hash)
    const user = findUserById.get(lastInsertRowid)
    res.status(201).json({ token: signToken(user), user: publicUser(user) })
  } catch (err) {
    if (String(err.code).startsWith('SQLITE_CONSTRAINT')) {
      return fail(res, 409, 'An account with this email already exists.')
    }
    throw err
  }
})

app.post('/api/auth/login', authLimiter, async (req, res) => {
  const body = req.body ?? {}
  const email = String(body.email ?? '').trim().toLowerCase()
  const password = String(body.password ?? '')

  const user = findUserByEmail.get(email)
  // Always run a comparison so response time doesn't reveal whether the email exists
  const matches = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH)

  if (!user || !matches) return fail(res, 401, 'Incorrect email or password.')

  res.json({ token: signToken(user), user: publicUser(user) })
})

app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = findUserById.get(req.userId)
  if (!user) return fail(res, 401, 'Account not found. Please log in again.')
  res.json({ user: publicUser(user) })
})

// ---------- Reviews ----------
const toReview = (r) => ({
  id: r.id,
  userId: r.user_id,
  name: r.name,
  drink: r.drink,
  rating: r.rating,
  comment: r.comment,
  date: r.created_at.slice(0, 10),
})

app.get('/api/reviews', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM reviews ORDER BY created_at DESC, id DESC')
    .all()
  res.json(rows.map(toReview))
})

app.post('/api/reviews', requireAuth, (req, res) => {
  const user = findUserById.get(req.userId)
  if (!user) return fail(res, 401, 'Account not found. Please log in again.')

  const body = req.body ?? {}
  const rating = Number(body.rating)
  const comment = String(body.comment ?? '').trim()
  const drink = String(body.drink ?? '').trim()

  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return fail(res, 400, 'Please choose a rating from 1 to 5.')
  if (comment.length < 10 || comment.length > 300)
    return fail(res, 400, 'Reviews must be between 10 and 300 characters.')
  if (drink.length > 60) return fail(res, 400, 'Item name is too long.')

  const { lastInsertRowid } = db
    .prepare(
      'INSERT INTO reviews (user_id, name, drink, rating, comment) VALUES (?, ?, ?, ?, ?)'
    )
    .run(user.id, user.name, drink, rating, comment)

  const row = db.prepare('SELECT * FROM reviews WHERE id = ?').get(lastInsertRowid)
  res.status(201).json(toReview(row))
})

// Users can only delete their own reviews
app.delete('/api/reviews/:id', requireAuth, (req, res) => {
  const result = db
    .prepare('DELETE FROM reviews WHERE id = ? AND user_id = ?')
    .run(Number(req.params.id), req.userId)

  if (result.changes === 0) return fail(res, 404, 'Review not found.')
  res.status(204).end()
})

// ---------- Orders ----------
const toOrder = (o) => ({
  id: o.id,
  total: o.total_cents / 100,
  items: JSON.parse(o.items),
  date: `${o.created_at.replace(' ', 'T')}Z`,
})

app.post('/api/orders', requireAuth, (req, res) => {
  const items = req.body?.items

  if (!Array.isArray(items) || items.length === 0 || items.length > 50)
    return fail(res, 400, 'Your cart is empty or too large.')

  let totalCents = 0
  const cleanItems = []

  for (const item of items) {
    const quantity = Number(item?.quantity)
    const unitPrice = Number(item?.unitPrice)

    if (
      typeof item?.name !== 'string' ||
      !Number.isInteger(quantity) || quantity < 1 || quantity > 20 ||
      !Number.isFinite(unitPrice) || unitPrice <= 0 || unitPrice > 100
    ) {
      return fail(res, 400, 'One of the items in your cart is invalid.')
    }

    totalCents += Math.round(unitPrice * 100) * quantity
    cleanItems.push({
      name: item.name.slice(0, 80),
      emoji: typeof item.emoji === 'string' ? item.emoji.slice(0, 8) : '',
      unitPrice,
      quantity,
      options:
        item.options && typeof item.options === 'object' ? item.options : null,
    })
  }

  const { lastInsertRowid } = db
    .prepare('INSERT INTO orders (user_id, items, total_cents) VALUES (?, ?, ?)')
    .run(req.userId, JSON.stringify(cleanItems), totalCents)

  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(lastInsertRowid)
  res.status(201).json(toOrder(row))
})

app.get('/api/orders', requireAuth, (req, res) => {
  const rows = db
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC, id DESC')
    .all(req.userId)
  res.json(rows.map(toOrder))
})

// ---------- Fallbacks ----------
app.use((req, res) => fail(res, 404, 'Not found.'))

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return fail(res, 400, 'Invalid JSON.')
  console.error(err)
  fail(res, 500, 'Something went wrong on our side.')
})

app.listen(PORT, () => {
  console.log(`Brewhaus API running on http://localhost:${PORT}`)
})
