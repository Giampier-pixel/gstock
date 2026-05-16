# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Inventra** — a Spanish-language inventory-management UI ("Sistema de control de inventario web con un diseño limpio"). Scaffolded as a Google AI Studio app (see `metadata.json`, AI Studio URL in `README.md`). All UI text and mock data are in Spanish; preserve that when editing.

The app is currently a pure front-end mockup: state is local (`useState`), and all data shown in the dashboard/tables/charts comes from hard-coded `mock*` arrays at the top of `src/App.tsx`. There is no backend wired up yet, even though `@google/genai`, `express`, and `dotenv` appear in `package.json`.

## Commands

```bash
npm install           # install deps
npm run dev           # vite dev server on 0.0.0.0:3000
npm run build         # production build to dist/
npm run preview       # preview built bundle
npm run clean         # rm -rf dist
npm run lint          # tsc --noEmit  (the only type/lint check; there is no ESLint config)
```

There is **no test suite** and no test runner configured.

## Architecture

### Single-file app shell
The entire application lives in **`src/App.tsx`** (~520 lines). It is not split into routed pages — instead, a single component holds two pieces of state:

- `isAuthenticated` — toggles between a login card and the main app. The login form has no real auth; submitting it just calls `setIsAuthenticated(true)`. Default values `admin` / `password123` are pre-filled.
- `currentView` (`'dashboard' | 'products' | 'movements' | 'providers' | 'reports' | 'settings'`) — the sidebar nav mutates this string, and the main panel renders different JSX branches based on it. The data tables for `products` / `movements` / `providers` all share **one** `<Table>` block with conditional `<TableHead>` / `<TableBody>` branches keyed off `currentView`. When adding a new entity table, extend those conditionals rather than introducing a new top-level branch.

If/when the app grows past this monolith, the natural split is by `currentView` value into separate view components, keeping the sidebar + header shell in `App.tsx`.

### Styling system
- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin (no `tailwind.config.js`). Theme tokens, custom colors, and CSS variables are declared inside `src/index.css` using `@theme` / `@theme inline` / `:root` blocks. A `.dark` variant block exists but the app does not currently toggle it.
- **shadcn/ui** with the `base-nova` style (see `components.json`). Primitives live in `components/ui/` (avatar, badge, button, card, input, table). When adding a new primitive, place it there and consume it via the `@/components/ui/...` alias.
- The visual language relies heavily on **glassmorphism**: `bg-card/60 backdrop-blur-xl`, decorative blurred blobs (`bg-secondary/80 ... blur-[100px]`), and gradient buttons. Match this aesthetic when adding UI rather than introducing plain solid surfaces.
- Charts use **Recharts** (`AreaChart`, `BarChart`) inside `<ResponsiveContainer>`.

### Path alias gotcha
`tsconfig.json` and `vite.config.ts` both alias `@/*` to the **project root**, not to `src/`. So:

- `@/components/ui/button` → `<root>/components/ui/button.tsx` ✓
- `@/lib/utils` → `<root>/lib/utils.ts` ✓
- `@/...` from inside `src/` resolves **upward** out of `src/`

When creating new shared modules (UI primitives, hooks, helpers), put them under the top-level `components/`, `lib/`, or `hooks/` directories — not under `src/`. `src/` is reserved for app entry (`main.tsx`, `App.tsx`, `index.css`). `components.json` already declares `components`, `ui`, `lib`, and `hooks` aliases consistent with this layout.

### Environment / AI Studio integration
- `GEMINI_API_KEY` is exposed to client code via a Vite `define` in `vite.config.ts` as `process.env.GEMINI_API_KEY`. It is read from `.env.local`. (Note: nothing in the current source actually reads it — the dependency `@google/genai` is installed but unused.)
- `DISABLE_HMR=true` disables Vite's file watcher. AI Studio sets this to prevent flicker during agent edits. Do not remove the guard in `vite.config.ts`.
- `APP_URL` is also documented in `.env.example` as auto-injected by AI Studio.
