# KitchenMum data database

PostgreSQL runs on the VPS as an isolated Docker service. It has no published host port; only services attached to the private `kitchenmum_data` Docker network can reach it. Persistent data lives in the named Docker volume `kitchenmum_postgres_data`.

The `app` schema stores profiles, recipes, account preferences, and subscription state. `user_id` is the string UID from a verified Firebase Authentication ID token. It is intentionally not a foreign key because Firebase Authentication and the VPS PostgreSQL database are separate services.

Every table has row-level security. After the Python API verifies a Firebase ID token, it must set the authenticated UID transaction-locally before querying user data:

```sql
SET LOCAL app.user_id = 'verified-firebase-uid';
```

The backend derives that UID from a verified Firebase ID token, never from request JSON. The Python API uses Google public signing certificates and verifies the token audience, issuer, signature, and expiry before setting the UID transaction-locally. `SET LOCAL` must run in the same transaction as queries because pooled connections are reused. RLS is defense in depth.

The `km_db_admin` credentials are for migrations and administration only. The backend should use `kitchenmum_app` and its separate password. Do not expose either secret to browser code or commit the VPS `.env` file.

## VPS deployment

1. Copy this directory to `/opt/kitchenmum/database` on the VPS.
2. Create `database/.env` from `.env.example` with two distinct random secrets; set permissions to `0600`.
3. Start it with `docker compose --env-file .env -f compose.yml up -d` from that directory.
4. Confirm the container is healthy and `docker exec kitchenmum-postgres psql -U km_db_admin -d kitchenmum -c '\\dt app.*'` lists the four tables.

The database port is not published. The Python API container joins the external Docker network `kitchenmum_data` in addition to its outbound-enabled network. It listens only on VPS loopback port `8000`. Its database connection host is `kitchenmum-postgres`, port `5432`, database `kitchenmum`, user `kitchenmum_app`. API deployment files and environment template are in `backend/`.

The Docker volume persists across container replacement. A systemd timer keeps 14 days of mode-0600 custom-format dumps under `/var/backups/kitchenmum`; these local backups do not protect against VPS loss. Configure encrypted off-site backups and a tested restore before storing real customer data. Keep Firebase Authentication passwords only in Firebase; never copy password hashes or plaintext passwords into this database.
