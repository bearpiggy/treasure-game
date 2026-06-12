# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install           # Install dependencies
npm run dev           # Start Vite dev server at http://localhost:3000 (opens browser automatically)
npm run build         # Build frontend to ./build directory
npm run server        # Start Express API server at http://localhost:3001
```

No test runner is configured.

> During development, both `npm run dev` and `npm run server` must be running. The Vite dev server proxies `/api/*` requests to `http://localhost:3001`.

## Architecture

This is a two-process app: a React + Vite frontend and a Node/Express backend.

### Frontend (`src/`)

All game logic lives in `src/App.tsx`. Entry point is `src/main.tsx`, which wraps `<App>` in `<AuthProvider>`.

**Auth flow:** `src/context/AuthContext.tsx` stores `user` and `token` in `localStorage` and exposes `login`/`logout`. On load, `App.tsx` checks `user` (authenticated) or `isGuest` state; if neither, it renders `<AuthPage>` (`src/components/AuthPage.tsx`). `AuthPage` uses `react-hook-form` with sign-in/sign-up tabs.

**Game flow:** `App.tsx` holds all state (`boxes`, `score`, `gameEnded`, `scoreSaved`). On mount, `initializeGame()` randomly assigns treasure to one of three `Box` objects. Clicking a closed chest calls `openBox(id)`, which updates score (+100 for treasure, -50 for skeleton) and plays the corresponding audio. When treasure is found or all boxes are opened, `gameEnded` is set. If authenticated, the final score is POST-ed to `/api/scores`.

**Styling:** Tailwind CSS v4 with CSS custom properties in `src/styles/globals.css`. The `@` alias resolves to `src/`.

**UI components:** `src/components/ui/` is a full shadcn/ui library (Radix UI + Tailwind). Don't modify these — add new components alongside them.

**Animations:** `motion/react` (Motion library) for chest flip/scale transitions.

**Assets:**
- `src/assets/` — chest images (`treasure_closed.png`, `treasure_opened.png`, `treasure_opened_skeleton.png`, `key.png`)
- `src/audios/` — `chest_open.mp3` (treasure), `chest_open_with_evil_laugh.mp3` (skeleton)

### Backend (`server/`)

Express API (CommonJS, no TypeScript) running on port 3001.

- `server/index.js` — bootstraps Express, mounts `/api/auth` and `/api/scores` routers
- `server/db.js` — opens `game.db` (SQLite via `better-sqlite3`) and creates `users` and `scores` tables on startup
- `server/routes/auth.js` — `POST /api/auth/signup` and `POST /api/auth/signin`; passwords hashed with `bcryptjs`; returns a JWT
- `server/routes/scores.js` — `POST /api/scores` (authenticated); saves score for the signed-in user
- `server/middleware/auth.js` — JWT verification middleware used by the scores route

The SQLite database file (`game.db`) is created at the project root on first server start.
