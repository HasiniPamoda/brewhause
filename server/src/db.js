import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

const dbPath = process.env.DB_PATH || './data/brewhaus.db'
fs.mkdirSync(path.dirname(dbPath), { recursive: true })

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    name       TEXT NOT NULL,
    drink      TEXT NOT NULL DEFAULT '',
    rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment    TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    items       TEXT NOT NULL,
    total_cents INTEGER NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

// Starter reviews so the page never looks empty on a fresh database
const seedReviews = [
  ['Amara K.', 5, 'Signature Latte', 'The caramel is subtle, not sugary, and the foam is perfect. My new morning stop.', '2026-10-02 08:15:00'],
  ['Daniel R.', 4, 'Cold Brew', 'Smooth and strong without any bitterness. Would love a bigger size option.', '2026-09-28 09:40:00'],
  ['Mei Lin', 5, 'Butter Croissant', 'Flaky, buttery and still warm at 8am. Worth getting up early for.', '2026-09-21 08:05:00'],
  ['Jordan P.', 5, 'Iced Matcha', 'Finally a matcha that tastes like matcha. Added vanilla syrup and it was great.', '2026-09-15 13:20:00'],
  ['Sofia M.', 4, '', 'Cozy space, friendly staff and plenty of seating to work from. Gets busy at lunch.', '2026-09-09 15:00:00'],
  ['Chris T.', 3, 'Chai Latte', 'Good flavor but a little too sweet for me. Next time I will ask for less honey.', '2026-09-03 10:30:00'],
]

const { count } = db.prepare('SELECT COUNT(*) AS count FROM reviews').get()
if (count === 0) {
  const insert = db.prepare(
    'INSERT INTO reviews (user_id, name, rating, drink, comment, created_at) VALUES (NULL, ?, ?, ?, ?, ?)'
  )
  db.transaction(() => {
    for (const [name, rating, drink, comment, createdAt] of seedReviews) {
      insert.run(name, rating, drink, comment, createdAt)
    }
  })()
}

export default db
