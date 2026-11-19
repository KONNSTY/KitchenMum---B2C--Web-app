# KitchenMum API

FastAPI verifies Firebase ID tokens and stores each account's profile, recipes, preferences, and subscription metadata in the VPS PostgreSQL database. It never accepts an owner UID from request data. PostgreSQL row-level security receives the UID from the verified token in a transaction-local setting.

## Current deployment

- VPS deployment directory: `/opt/kitchenmum/api`
- Container: `kitchenmum-api`
- API health: `http://127.0.0.1:8000/health/ready` on the VPS
- The API port is bound to VPS loopback only. Local development reaches it with `ssh -N -L 8000:127.0.0.1:8000 mc-vps`.
- Production access is not public. Before hosting the web app publicly, choose HTTPS routing or attach the web container to a private Docker network and set server-only `KITCHENMUM_API_URL` accordingly.

## Deploy updates

Copy `Dockerfile`, `compose.yml`, and `main.py` to `/opt/kitchenmum/api`. Keep `.env` on the VPS with mode `0600`; its `DATABASE_URL` uses the `kitchenmum_app` role and the private hostname `kitchenmum-postgres`. Do not copy database credentials into the repository or browser configuration. Then run:

```bash
cd /opt/kitchenmum/api
docker compose --env-file .env -f compose.yml up -d --build
curl --fail http://127.0.0.1:8000/health/ready
```

The API verifies Firebase tokens against project `kitchenmum-app`. This environment uses public certificate verification and does not require a Firebase Admin private key. Account passwords remain exclusively in Firebase Authentication.

`GET /api/v1/subscription` creates/returns the account's free metadata row. Subscription changes are intentionally not exposed to clients; Stripe billing is not configured. Recipe images and uploaded files are not persisted yet; the current schema stores recipe text, metadata, and image URLs.
