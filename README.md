# Bundu Foods — Next.js Edition

Restaurant ordering & staff management system for Bundu Foods, KwaDlangezwa.
Migrated from a single-file HTML prototype to Next.js + Supabase.

---

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind)
- **Supabase** — Auth (email/password + email confirmation), Postgres database, Realtime
- **Hosting**: Vercel (recommended) or Netlify

---

## Project Structure

```
src/
├── app/                  ← Pages (routes)
│   ├── page.tsx          → /  (home)
│   ├── menu/             → /menu
│   ├── orders/           → /orders (order form, requires login)
│   │   └── history/      → /orders/history (My Orders, requires login)
│   ├── auth/
│   │   ├── login/        → /auth/login
│   │   ├── signup/       → /auth/signup
│   │   └── reset-password/ → /auth/reset-password
│   ├── dashboard/        → /dashboard (staff PIN login)
│   └── profile/          → /profile (My Details + Change Password)
│
├── components/
│   ├── Navbar/           ← Site nav, profile dropdown with initials
│   ├── Footer/           ← Footer + hidden staff link
│   ├── Hero/             ← Homepage hero
│   ├── Menu/             ← ChalkboardMenu (reads menu_items table)
│   ├── Home/             ← Story, Catering/Events, Find Us sections
│   ├── Auth/             ← Login/Signup forms, Profile details, Change password
│   ├── Orders/           ← Order form, order history, contact buttons
│   ├── Dashboard/        ← Staff login, order board, staff management
│   └── UI/               ← Shared: AuthGuard, FloatingButtons
│
├── services/             ← All Supabase calls live here. Components never
│   ├── authService.ts       call Supabase directly — they call services.
│   ├── orderService.ts
│   ├── staffService.ts
│   └── menuService.ts
│
├── hooks/
│   ├── useAuth.ts        ← Current logged-in profile
│   └── useToast.ts       ← Toast notifications
│
├── lib/supabase/
│   ├── client.ts         ← Browser Supabase client
│   └── server.ts         ← Server Supabase client
│
├── types/index.ts        ← Shared TypeScript types
├── styles/globals.css    ← Design tokens (colours, fonts) + Tailwind
└── middleware.ts         ← Refreshes Supabase auth session

supabase/
└── schema.sql            ← Run once in Supabase SQL Editor (already done)
```

---

## The Golden Rule

**One change = one file, one system = one folder.**

| I want to change... | Edit this |
|---|---|
| Colours, fonts | `src/styles/globals.css` |
| Nav links, profile menu | `src/components/Navbar/Navbar.tsx` |
| Menu items/prices | Supabase Table Editor -> `menu_items` table |
| Signup/login validation | `src/services/authService.ts` |
| Order form fields | `src/components/Orders/OrderForm.tsx` |
| Order statuses/notifications | `src/services/orderService.ts` |
| Staff PIN logic | `src/services/staffService.ts` |
| Dashboard layout | `src/components/Dashboard/*` |
| Add a new page | Create folder in `src/app/`, add `page.tsx` |

---

## Local Development

```bash
npm install
cp .env.example .env.local   # fill in your Supabase keys
npm run dev
```

Visit http://localhost:3000

---

## Environment Variables

Set these in `.env.local` (never commit this file):

```
NEXT_PUBLIC_SUPABASE_URL=https://jkjzvgtkmjoutxpcvxoa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
NEXT_PUBLIC_OWNER_PIN=9999
```

When deploying to Vercel/Netlify, add these same variables in the
hosting dashboard's Environment Variables settings.

---

## Database (Supabase)

Schema already applied via `supabase/schema.sql`. Tables:

| Table | Purpose |
|---|---|
| `profiles` | Customer name + WhatsApp (auto-created on signup via trigger) |
| `orders` | All orders, realtime-enabled for live dashboard |
| `staff` | PIN-based staff accounts (Owner=9999, Staff 1=2025) |
| `menu_items` | Menu - currently empty, falls back to placeholder items |

### Adding the real menu
Go to Supabase -> Table Editor -> `menu_items` -> Insert rows with:
`category`, `name`, `description`, `price`, `available`, `sort_order`

---

## Authentication Flow

1. Customer signs up at `/auth/signup` (name, email, WhatsApp, password)
2. Supabase sends a confirmation email (email confirmation is ON)
3. Customer clicks the link in their email to verify
4. Customer logs in at `/auth/login`
5. A `profiles` row was auto-created by the database trigger during signup
6. Logged-in customers see their initials in the navbar -> dropdown:
   My Orders, My Details, Change Password, Logout

Forgot password -> Supabase sends a reset email -> `/auth/reset-password`

---

## Staff & Owner Access

Go to `/dashboard` (also linked as "staff" in the footer, low-opacity).

| Role | Name | PIN |
|---|---|---|
| Owner | Owner | 9999 |
| Staff | Staff 1 | 2025 |

Owner sees an extra Staff Management panel at the bottom:
add/activate/deactivate/remove staff with their own PINs.

---

## Deployment (Vercel - recommended for Next.js)

```bash
git add .
git commit -m "feat: Next.js migration of Bundu Foods"
git push
```

1. Go to vercel.com -> New Project -> Import your GitHub repo
2. Add environment variables (same as `.env.local`)
3. Deploy

Vercel auto-deploys on every push to `main`.

---

## Git Workflow / Checkpoints

```bash
git add .
git commit -m "feat: added menu admin form"
git push
```

### Commit prefixes
- `feat:` new feature
- `fix:` bug fix
- `content:` menu/text/image updates
- `style:` CSS-only changes
- `wip:` checkpoint, not finished

### Rollback
```bash
git log --oneline
git checkout COMMIT_ID -- src/components/Orders/OrderForm.tsx
git commit -m "fix: rolled back order form"
git push
```

---

## Migration Notes (from old single-file HTML system)

| Old system | New system |
|---|---|
| `window.storage` (`bundu-users`, `bundu-orders`, `bundu-staff`) | Supabase `profiles`, `orders`, `staff` tables |
| Custom email/password hash | Supabase Auth (proper hashing, sessions, email confirmation) |
| 30-second polling on dashboard | Supabase Realtime - instant updates |
| "Reset to bundu2026" forgot password | Real email-based password reset |
| Single `index.html` (3500+ lines) | Modular pages/components/services |

All original functionality preserved: customer signup/login, order
placement, order history, staff PIN dashboard, owner staff management,
WhatsApp notify-on-complete.
