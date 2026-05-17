# gstock

Sistema de control de inventario web con un diseño limpio.

Built with **Next.js 16** (App Router), **React 19**, **Tailwind CSS v4**, **shadcn/ui** (`base-nova` style backed by `@base-ui/react`), **Auth.js v5**, and **Recharts**. No database — data lives in module-scoped in-memory stores seeded from sample data.

## Stack

- Next.js 16 + React 19 (Server Components, Server Actions, `useActionState`)
- TypeScript (strict), Tailwind v4, shadcn/ui (`base-nova` style)
- Auth.js v5 (`next-auth@5.0.0-beta`) with a Credentials provider — single admin user from env
- Zod for input validation, Recharts for charts, lucide-react icons, Geist font
- bcryptjs for password hashing

## Run locally

Prereqs: Node 20+.

```bash
npm install
cp .env.example .env.local
# Fill in the three values — see "Environment" below.
npm run dev
```

Visit `http://localhost:3000`, log in with the dev credentials, and you'll land on the dashboard.

### Dev credentials

The defaults match the original Vite mockup: `admin` / `password123`. To regenerate:

```bash
# AUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# ADMIN_PASSWORD_HASH for any password
node -e "console.log(require('bcryptjs').hashSync('password123', 10))"
```

## Scripts

- `npm run dev` — Turbopack dev server on `:3000`
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — Next ESLint
- `npm run typecheck` — `tsc --noEmit`

## Environment

Set these in `.env.local` for dev and in Vercel for preview/production:

| Variable              | Notes                                                            |
|-----------------------|------------------------------------------------------------------|
| `AUTH_SECRET`         | 32-byte random base64 value.                                     |
| `ADMIN_USER`          | Login username. Default `admin`.                                 |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of the password.                                     |

## Branches

- `main` — production. Vercel auto-deploys every merge to `main`.
- `dev` — feature work. Every push to `dev` gets a preview deploy at `gstock-git-dev-giampier-pixel.vercel.app`.

## Limitaciones

This version has **no database**. Mutations (create/edit/delete on productos, movimientos, proveedores) live in process memory. They persist while the serverless function stays warm but reset on cold starts and are not shared across concurrent instances. This is intentional for the initial release.
