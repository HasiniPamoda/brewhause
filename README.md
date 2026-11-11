# Brewhaus Coffee ☕

A full-stack coffee shop web app with a Starbucks-style drink customizer, shopping cart, user accounts, order history and customer reviews.

**Live demo:** _add your Vercel link here_

![Brewhaus screenshot](docs/screenshot.png)

## Features

- **Interactive menu** with category tabs, search, hot/iced, vegan and price filters
- **Drink customizer**: size, syrup pumps, toppings, extra shots and notes, with a live price
- **Shopping cart** in a slide-out drawer, saved between visits, identical drinks merge
- **User accounts**: register, log in, protected pages, JWT sessions
- **Orders**: place an order and view your order history
- **Reviews** with star ratings, rating breakdown, sorting, and delete-your-own
- **Photo gallery** with skeleton loaders and a lightbox (keyboard and swipe)
- Responsive, keyboard accessible, with a skip link and per-page titles

## Tech stack

| Part     | Tools                                                            |
| -------- | ---------------------------------------------------------------- |
| Frontend | React, Vite, React Router, Tailwind CSS v4, Context API          |
| Backend  | Node.js, Express 5, SQLite (better-sqlite3)                      |
| Security | bcrypt password hashing, JWT, Helmet, CORS allow-list, rate limit |

## Run it locally

You need Node.js 20 or newer. Use two terminals.

**1. Backend**

```bash
cd server
npm install
cp .env.example .env      # on Windows PowerShell: Copy-Item .env.example .env
npm run dev
```

Open `server/.env` and set `JWT_SECRET` to a long random string. The API runs on http://localhost:4000.

**2. Frontend** (from the project root)

```bash
npm install
npm run dev
```

The site runs on http://localhost:5173. If your API is not on port 4000, copy `.env.example` to `.env` and change `VITE_API_URL`.

## API

| Method | Endpoint             | Auth | Description                       |
| ------ | -------------------- | ---- | --------------------------------- |
| POST   | `/api/auth/register` | No   | Create an account, returns a token |
| POST   | `/api/auth/login`    | No   | Log in, returns a token           |
| GET    | `/api/auth/me`       | Yes  | Current user                      |
| GET    | `/api/reviews`       | No   | List all reviews                  |
| POST   | `/api/reviews`       | Yes  | Post a review                     |
| DELETE | `/api/reviews/:id`   | Yes  | Delete your own review            |
| POST   | `/api/orders`        | Yes  | Place an order                    |
| GET    | `/api/orders`        | Yes  | Your order history                |

## Deployment

- **Backend:** Render web service. Root directory `server`, build command `npm install`, start command `npm start`. Environment variables: `NODE_ENV=production`, `JWT_SECRET`, `CLIENT_ORIGIN` (your Vercel URL, no trailing slash).
- **Frontend:** Vercel. Framework preset Vite, environment variable `VITE_API_URL` set to your Render URL. `vercel.json` makes page refreshes work with React Router.

## Known limitations and next steps

- Order prices come from the browser. A production shop would recompute them on the server from its own menu data.
- SQLite lives on the server's disk. On free hosting tiers that disk can reset on redeploy, so a production version would use a hosted database such as PostgreSQL.
- The auth token is kept in `localStorage`. An httpOnly cookie would be safer against XSS.
- Payments are not implemented.

## Credits

Photos from Unsplash and Pexels. Fonts: Playfair Display and Inter.

## Build log

- [x] Day 1: Project setup
- [x] Day 2: Layout, navbar, footer and core pages
- [x] Day 3: Interactive menu, filters and drink customization
- [x] Day 4: Shopping cart with drawer and persistence
- [x] Day 5: Reviews and photo gallery
- [x] Day 6: Express + SQLite API, accounts, orders
- [x] Day 7: Polish, documentation and deployment
