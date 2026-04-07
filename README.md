# Tamil Trainer

A static, production-minded MVP for learning **spoken Tamil** as an English or Spanish speaker. The app emphasizes conversational usefulness, evidence-based practice (spaced repetition, retrieval, interleaving), unlimited retries, and honest pronunciation support (local audio when present; browser speech synthesis otherwise).

There is **no backend** in this MVP: lessons and vocabulary ship with the app; progress is stored locally in the browser (IndexedDB via Dexie).

## Architecture (brief)

- **React + TypeScript + Vite** for a fast static bundle suitable for GitHub Pages.
- **Tailwind CSS v4** (`@tailwindcss/vite`) for styling; small reusable UI primitives (`src/components/ui`).
- **Zustand** for client state; **Dexie** for durable IndexedDB persistence (word progress, streak, settings, lesson completion).
- **Zod** validates curriculum data at load time (`src/content`).
- **Pure, testable modules** for scheduling and scoring (`src/lib/srs`).
- **React Router** with `basename` set from Vite’s `import.meta.env.BASE_URL` so subpath deploys work.
- **Exercise engine** builds mixed sessions from lesson items + optional review pulls (`src/lib/session`).

Future features (Tamil script writing, speech recognition, accounts, cloud sync) should remain behind explicit modules and **never** embed secrets or privileged APIs in the static bundle.

## Local development

Requirements: Node 20+ (recommended).

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

### Quality checks

```bash
npm run lint
npm run test:run
npm run build
npm run audit
```

## GitHub Pages (static deploy)

1. In `vite.config.ts`, `base` defaults to `'/'`. For a **project site** at `https://<user>.github.io/<repo>/`, set the base to your repository name at build time:

   ```bash
   VITE_BASE_URL=/your-repo-name/ npm run build
   ```

   Or use Vite’s CLI:

   ```bash
   npx vite build --base=/your-repo-name/
   ```

2. Upload the `dist/` folder to the `gh-pages` branch, or use **GitHub Actions** / **peaceiris/actions-gh-pages** with `publish_dir: dist` and the same `base` as your Pages URL.

3. In the repo **Settings → Pages**, choose the branch/folder that serves `dist`.

Because this is a client-side SPA, the hosting path must match the `base` you build with so assets and `import.meta.env.BASE_URL` line up.

## Privacy (MVP)

All learning progress and preferences stay **in this browser** (IndexedDB). Nothing is sent to a server by this app. See `SECURITY.md` for assumptions and hardening notes.

## Documentation

- `PROJECT_RULES.md` — product and UX guardrails for contributors.
- `docs/content-schema.md` — vocabulary and curriculum fields.
- `docs/curriculum-roadmap.md` — staged roadmap toward a larger conversational corpus.
- `docs/learning-method.md` — pedagogy and SRS behavior.
- `SECURITY.md` — threat model and client-only constraints.

## License

Private project (`"private": true` in `package.json`). Adjust as needed.
