# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**gstock** — Spanish-language inventory management web app. Original Vite + React mockup ported to Next.js 16 (App Router) with Tailwind v4 + shadcn/ui (`base-nova` style backed by `@base-ui/react`), Auth.js v5 Credentials provider, and Server Actions over in-memory stores. Deployed on Vercel from `main`; ongoing work happens on `dev`.

## Commands

```bash
npm install
npm run dev          # next dev --turbopack -p 3000
npm run build        # next build
npm run start        # next start -p 3000
npm run lint         # next lint
npm run typecheck    # tsc --noEmit
```

There is **no test suite** by design (see the design spec under `docs/superpowers/specs/`, gitignored).

## Architecture

### Route groups
- `app/(auth)/login` — public login page (Auth.js Credentials).
- `app/(app)/*` — protected by `proxy.ts` at the repo root (Next.js 16 renamed the `middleware` convention to `proxy`). The proxy uses `auth.config.ts` which is edge-safe (no bcrypt). The protected layout at `app/(app)/layout.tsx` does a server-side `auth()` check as a second line of defense and renders the sidebar + main panel.

### Data layer
- `lib/seed.ts` exports the original mock arrays.
- `lib/store/{products,movements,providers}.ts` are module-scoped `Map`s seeded from `lib/seed.ts`. Pure functions: `listX`, `getX`, `createX`, `updateX`, `deleteX`, plus dashboard aggregates (`totalSkus`, `countLowStock`, `ordersToday`).
- **Cold-start caveat**: each Vercel function instance has its own copy of the in-memory store. Mutations only persist for the lifetime of that warm instance and are not shared across instances. Documented in README §"Limitaciones".

### Mutations
- `lib/actions/*.ts` are Server Actions. Each: `'use server'` → `auth()` check → Zod parse → store mutation → `revalidatePath()`. Return shape: `{ ok?: true, error?: string, fieldErrors?: Record<string, string[]> }` (`ActionState` type in `lib/actions/products.ts`, imported by the others).
- Client forms consume them via React 19's `useActionState`. Toasts via `sonner`.

### Auth
- `auth.config.ts` (edge-safe, no bcrypt, used by `proxy.ts`) holds the `authorized` callback that redirects.
- `lib/auth.ts` extends the config with the `Credentials` provider whose `authorize()` compares `ADMIN_USER` + `ADMIN_PASSWORD_HASH` (bcryptjs) from env.
- Single user only (no signup, no DB).

### shadcn primitives + Base UI quirks
- The `base-nova` shadcn style uses **`@base-ui/react`**, not Radix UI. This is a meaningful API difference:
  - **Dialog trigger:** use `<DialogTrigger render={<Button>...</Button>}>` — *not* `<DialogTrigger asChild>`.
  - **Select:** `<Select name="status" defaultValue="...">` works natively in HTML forms (Base UI renders a hidden input automatically). No need to wire a hidden `<input>` manually.
- Only `react-hook-form` integration (`components/ui/form.tsx`) uses `@radix-ui/react-slot` because the shadcn registry's form primitive uses Slot regardless of style.

### Path alias
- `@/*` → project root (same as the old Vite config). `components/ui/*` lives at the repo root, not under `src/`. There is no `src/` directory.

### Visual fidelity
The design tokens, glassmorphism, gradients, Spanish copy, and Geist font are migrated verbatim from the original mockup. The sole branding change is "Inventra" → "**gstock**".

## Environment variables

Required in every environment (`.env.local` for dev, Vercel env for prod/preview):

- `AUTH_SECRET` — `openssl rand -base64 32` or `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.
- `ADMIN_USER` — username (default `admin`).
- `ADMIN_PASSWORD_HASH` — bcrypt hash. Generate with `node -e "console.log(require('bcryptjs').hashSync('your-pw', 10))"`.

## Branches and deploys

- `main` → production deploy on Vercel.
- `dev` → preview deploys at `gstock-git-dev-giampier-pixel.vercel.app` on every push.
- Commits: **never** include `Co-Authored-By: Claude` trailers or "Generated with Claude" lines. Author and committer must be `Giampier-pixel <usuarioae87@gmail.com>`.
