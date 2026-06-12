Deploy the frontend of this Vite + React project to GitHub Pages. Follow each step in order.

**Important:** GitHub Pages only serves static files — the Express/SQLite backend will not run. The game works in guest mode only (sign-up and sign-in will not function on GitHub Pages). For full-stack deployment with auth and scores, use the Vercel deployment instead.

## Step 1 — Check prerequisites

Run these checks:
```
gh --version
git --version
```
If `gh` (GitHub CLI) is not found, tell the user to install it from https://cli.github.com, authenticate with `gh auth login`, then re-run this command.

Check GitHub auth status:
```
gh auth status
```
If not authenticated, run `gh auth login` and wait for the user to complete browser auth before continuing.

## Step 2 — Ensure .gitignore exists

Check if `.gitignore` exists at the project root. If it does not, create one with the following contents:
```
node_modules/
build/
game.db
.env
```

## Step 3 — Initialize git and push to GitHub

Check if this is already a git repo:
```
git rev-parse --is-inside-work-tree
```

If not a git repo, initialize and make a first commit:
```
git init
git add .
git commit -m "Initial commit"
```

Get the GitHub username:
```
gh api user --jq .login
```

Check if a remote named `origin` already exists:
```
git remote get-url origin
```

If no remote exists, create the GitHub repo and link it (use `treasure-game` as the repo name):
```
gh repo create treasure-game --public --source=. --remote=origin --push
```

If the remote already exists, stage any uncommitted changes and push:
```
git add .
git diff --cached --quiet || git commit -m "Update before deploy"
git push origin HEAD
```

## Step 4 — Add `.nojekyll` to `public/`

Create an empty file at `public/.nojekyll`. Vite copies everything from `public/` verbatim into the build output, so this disables GitHub's Jekyll processor and ensures Vite's asset files are served correctly.

## Step 5 — Install `gh-pages`

Check if `gh-pages` is already installed:
```
npm list gh-pages --depth=0
```

If not installed:
```
npm install --save-dev gh-pages
```

## Step 6 — Add deploy scripts to `package.json`

Read the GitHub username obtained in Step 3. The repo name is `treasure-game`.

Edit `package.json` to add two scripts inside the `"scripts"` block:
```json
"predeploy": "vite build --base /treasure-game/",
"deploy": "gh-pages -d build --dotfiles"
```

The `--base /treasure-game/` flag makes Vite prefix all asset URLs with the repo subpath, which is required when the site is hosted at `https://<username>.github.io/treasure-game/` instead of a root domain.
`--dotfiles` ensures the `.nojekyll` file is included in the deployed branch.

## Step 7 — Build and deploy

Run:
```
npm run deploy
```

This automatically runs `predeploy` first (Vite build with the correct base path), then publishes the `build/` folder to the `gh-pages` branch on GitHub.

## Step 8 — Enable GitHub Pages on the `gh-pages` branch

After the branch is created, enable Pages via the GitHub API. Replace `OWNER` with the actual GitHub username:
```
gh api repos/OWNER/treasure-game/pages --method POST --field source[branch]=gh-pages --field source[path]=/ 2>/dev/null || gh api repos/OWNER/treasure-game/pages --method PUT --field source[branch]=gh-pages --field source[path]=/ 2>/dev/null || true
```

Then verify Pages is active:
```
gh api repos/OWNER/treasure-game/pages --jq .html_url
```

## Step 9 — Report the URL

The live URL is:
```
https://<username>.github.io/treasure-game/
```

Show this URL to the user and note:
- GitHub Pages may take **1–2 minutes** to go live after the first deploy.
- The game is fully playable in **guest mode** at that URL.
- Sign-up / sign-in are visible but will not work — there is no backend on GitHub Pages.
- To redeploy after future changes, just run `npm run deploy` again (no need to repeat these steps).
