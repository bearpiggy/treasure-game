Deploy this Vite + Express + SQLite project to Vercel as a full-stack app. Follow each step in order.

## Step 1 — Check Vercel CLI

Run `vercel --version`. If the command fails (not found), install it first:
```
npm install -g vercel
```

## Step 2 — Create `api/index.js` (Vercel serverless entry point)

Create the file `api/index.js` at the project root. This wraps the Express app for Vercel's serverless runtime (no `app.listen`):

```js
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/scores', require('../server/routes/scores'));

module.exports = app;
```

## Step 3 — Patch `server/db.js` for Vercel's read-only filesystem

Vercel serverless functions can only write to `/tmp`. Update the db path so it works in both environments. Edit `server/db.js` to replace the hardcoded path:

```js
// Before:
const db = new Database(path.join(__dirname, '..', 'game.db'));

// After:
const dbPath = process.env.VERCEL
  ? '/tmp/game.db'
  : path.join(__dirname, '..', 'game.db');
const db = new Database(dbPath);
```

Make only that one-line path change; leave the rest of db.js untouched.

## Step 4 — Create `vercel.json`

Create `vercel.json` at the project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/index" }
  ]
}
```

## Step 5 — Deploy

Run the deployment:
```
vercel --prod
```

If not logged in, Vercel will open a browser for authentication — wait for the user to log in, then re-run. Answer the interactive prompts:
- Set up and deploy: **Y**
- Scope: choose the user's personal account
- Link to existing project: **N** (first deploy)
- Project name: accept default or use `treasure-game`
- In which directory is your code located: **.** (current directory)

## Step 6 — Report the URL

After deployment succeeds, extract the production URL from the output (it looks like `https://treasure-game-xxx.vercel.app`) and show it to the user.

Also tell the user:
- The game is fully playable in guest mode on the deployed URL.
- Sign-up / sign-in works, but **scores and accounts do not persist** across Vercel cold starts because SQLite uses ephemeral `/tmp` storage. For persistent data, they would need to migrate to a hosted database (e.g., Vercel Postgres, PlanetScale, Turso).
