# KitchenMum

Responsive recipe-library prototype for collecting recipes from social posts, organizing them, and cooking from a clear recipe view.

## Run locally

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` first. For local access to the VPS API, start an SSH tunnel:

```bash
ssh -N -L 8000:127.0.0.1:8000 mc-vps
```

Next.js serves the app at `http://localhost:3000` when the port is free. The current development server may choose another port when 3000 is already occupied.

## Prototype routes

- `/` — product landing page
- `/app` — recipe dashboard and category filters
- `/app/recipes` — searchable recipe collection
- `/app/recipes/[id]` — ingredients, timings, cooking steps, and cook mode
- `/app/recipes/[id]/edit` — editable recipe form
- `/app/import` — pasted-text or screenshot selection, simulated AI draft, review, and save
- `/app/favorites` — saved favorites
- `/app/plan` — Free and Plus plan comparison with mock Stripe actions
- `/app/account` — account profile, data export, and app-data deletion
- `/login`, `/signup` — Firebase email/password account forms
- `/impressum`, `/datenschutz`, `/agb`, `/widerruf`, `/cookies` — legal prototype pages and cookie controls

Email/password signup, email verification, login, password reset, and Google sign-in use Firebase Authentication. Signup and login through the app create an `accounts/{uid}` Firestore document if one is missing. It stores account settings and the initial `free` subscription state. Profile, recipes, preferences, and subscription metadata also use the Python API and per-user PostgreSQL rows on the VPS. The API verifies Firebase ID tokens and applies PostgreSQL row-level security using the verified UID. The VPS API listens only on loopback; local development reaches it through the SSH tunnel above. Stripe and AI services are not connected.

## Frontend architecture

- Next.js App Router, React, and TypeScript provide route and UI structure.
- Bootstrap is included for the requested stack; Tailwind utilities are configured with Bootstrap preflight disabled to avoid competing resets. The visual system lives in `app/globals.css` and the legal page styles in `app/legal-pages.css` / `app/cookie-consent.css`.
- `lib/contexts/recipe-context.tsx` loads authenticated recipes from the API.
- `lib/services/contracts.ts` defines replaceable `AuthAdapter`, `BillingAdapter`, `AiImportAdapter`, and `RecipeRepository` interfaces.
- `lib/services/mock-adapters.ts` still supplies mock billing and AI-import behavior; authentication and recipe persistence use the real services.

## Firebase and VPS database

- Firebase project `kitchenmum-app` has a registered KitchenMum web app and the email/password Auth provider enabled. `.firebaserc` selects this project, and `.env.example` contains its public web SDK settings. Firebase Auth credentials must stay in Firebase; do not add Admin SDK credentials to client configuration.
- PostgreSQL and the Python API run on the VPS. The API is bound to loopback port 8000 and joins the private database network. The `app` schema stores profiles, recipes, preferences, and subscription records; row-level security scopes each query to the UID in the verified Firebase token.
- Run the API deployment and backup details from `backend/` and `database/README.md`. Before public production use, configure HTTPS/domain routing, verify provider and data-location disclosures, and arrange encrypted off-site backups.
- Agrave Pro is self-hosted in `public/fonts/` under the SIL Open Font License to avoid a browser request to Google Fonts.
- The Figma capture script in `components/figma-capture.tsx` loads only in development for URLs containing a `#figmacapture=` hash; production builds do not load it.

## Backend handoff

Firebase Auth, the Python API, and PostgreSQL-backed recipes are implemented. Keep secrets and privileged operations on the server. Stripe Checkout and the customer portal still need verified server endpoints; AI extraction should call a backend adapter that can route to Azure AI Foundry. Image persistence is not implemented. Preserve user ownership checks and validate all imported recipe fields server-side.

The current Plus prices and limits are placeholders for UX review. No purchase is made. Screenshot OCR, AI extraction, social-platform access, account security, data synchronization, and billing webhooks are not implemented in this frontend-only prototype. The legal pages distinguish active prototype behavior from planned providers; `docs/legal-release-checklist.md` lists the provider and business details that must be confirmed before launch. These draft pages are not legal sign-off.
