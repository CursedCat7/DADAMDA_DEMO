# Deploying DaDamDa to the Ubuntu VM

Target: Ubuntu cloud server (Oracle Cloud) at `141.147.179.193`, domain
`dadamda.duckdns.org` (DuckDNS A record already points at the server).

This replaces the Cloudflare Tunnel plan in `Docs/02 §13` — direct deployment
on the VM with a real domain and Let's Encrypt TLS instead.

**This server already runs another project** via its own Docker Compose
stack (container `ca_nginx` on network `ca_network`, serving
`cwu.duckdns.org`), which already owns ports 80/443. Use **Path B** below,
not Path A - Path A is kept for reference (e.g. deploying DaDamDa alone on
a fresh server some other time).

## 0. Prerequisites on the server

```bash
# Docker + Compose plugin
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # log out/in again after this

# Firewall: only 22 (SSH), 80, 443 need to be reachable from the internet
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

**Oracle Cloud has a second firewall layer** in the OCI Console (Security
List / Network Security Group on the VCN's subnet), separate from `ufw` on
the instance itself - both must allow TCP 22/80/443 or connections will
time out even though `ufw` looks fine. VCN → subnet → Security List →
Ingress Rules → allow `0.0.0.0/0` TCP `22`, `80`, `443`.

Confirm DNS is actually resolving to this server before continuing:

```bash
dig +short dadamda.duckdns.org   # should print 141.147.179.193
```

## 1. Get the code onto the server

```bash
git clone <this-repo-url> dadamda
cd dadamda
cp .env.production.example .env
```

Edit `.env`: set a real `POSTGRES_PASSWORD` and `JWT_SECRET` (e.g.
`openssl rand -hex 32` for the secret), and set `NEXT_PUBLIC_KAKAO_MAP_KEY`
(see step 1.5 below). Leave the `dadamda.duckdns.org` URLs as-is unless the
domain changes.

## 1.5. Register the domain with the Kakao Maps key

Kakao rejects the JS SDK for any origin that isn't explicitly registered
against the app the key belongs to - this bit local dev during
verification, and will bite production too if skipped:

1. [Kakao Developers](https://developers.kakao.com) → 내 애플리케이션 →
   select the app the key belongs to → 앱 설정 → 플랫폼 → Web 플랫폼 등록.
2. Add **`https://dadamda.duckdns.org`** as a registered site domain (no
   trailing slash). For local dev, also add `http://localhost` (or
   whichever origin you actually browse from).
3. Changes apply within a few minutes - no redeploy needed on this side,
   since the key itself doesn't change, just what origins it accepts.

If the map view shows the fallback error message, check the browser
console network tab for the `dapi.kakao.com/v2/maps/sdk.js` request: a 401
with `"domain mismatched"` in the body means step 2 above wasn't done (or
was done for the wrong domain/app).

---

## Path B: Coexisting with the existing `ca_nginx` project (use this one)

DaDamDa doesn't run its own nginx or certbot here at all - the other
project's nginx already owns 80/443 and terminates TLS for everything on
this server. DaDamDa's backend/frontend just need to join `ca_network` so
that nginx can reach them by container name, and that nginx's config gets
one more server block for `dadamda.duckdns.org`.

### B1. Add the DaDamDa server block to the other project

From the **other project's** directory (the one with `ca_nginx`):

```bash
cp /path/to/dadamda/nginx/shared-nginx-dadamda.conf nginx/conf.d/dadamda.conf
```

Open that copied file and **comment out or delete the second (`listen 443
ssl`) server block for now** - the certificate it references doesn't exist
yet and nginx will refuse to start with a config that points at a missing
file. Keep only the first (port 80) server block for this step.

Reload that project's nginx:

```bash
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
# container name may be `ca_nginx` - `docker exec ca_nginx nginx -s reload` also works
```

### B2. Get a certificate for dadamda.duckdns.org

Still from the **other project's** directory, using its existing certbot
service (webroot at `/var/www/certbot`, shared with its nginx).

**That project's `certbot` service has a custom `entrypoint`** (a
`while :; do certbot renew; sleep 12h; done` loop for auto-renewal), which
means `docker compose run --rm certbot <anything>` ignores whatever you
type after `certbot` and just runs that loop instead - confirmed on this
server: the output showed it processing `cwu.duckdns.org`'s existing
renewal config ("not yet due for renewal") instead of even attempting
`dadamda.duckdns.org`, then appeared to hang (it didn't - it was sitting
in `sleep 12h`). `--rm` doesn't help here since the loop keeps the
container alive on its own.

**Override the entrypoint** so your arguments actually reach `certbot`:

```bash
docker compose -f docker-compose.prod.yml run --rm --entrypoint certbot certbot \
  certonly --webroot -w /var/www/certbot \
  -d dadamda.duckdns.org \
  --email <your-email> --agree-tos --no-eff-email
```

(Double-check there's a space before every `--flag` - `--email
you@example.com--agree-tos` with no space between them silently merges
into one broken argument instead of erroring.)

If a previous attempt is stuck in the renew loop, stop it first:

```bash
docker compose -f docker-compose.prod.yml stop certbot
docker rm -f $(docker ps -aq --filter "name=certbot-run") 2>/dev/null
```

This adds a new, separate certificate at
`/etc/letsencrypt/live/dadamda.duckdns.org/` alongside the existing
`cwu.duckdns.org` one - they don't conflict.

Now uncomment/restore the second (port 443) server block in
`nginx/conf.d/dadamda.conf` and reload nginx again:

```bash
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

If this reload fails with `host not found in upstream "dadamda-backend"`
(or `dadamda-frontend`): the template's `proxy_pass` targets are resolved
at request time via `resolver 127.0.0.11` + `set $var; proxy_pass $var;`
specifically so this *shouldn't* happen regardless of whether DaDamDa's
containers are up yet - if you still hit it, `nginx/conf.d/dadamda.conf`
on the server has an older copy of this file using plain
`proxy_pass http://dadamda-backend:8000` (resolved once at config-load
time, which does fail this way if the container isn't up yet); re-copy
the current `nginx/shared-nginx-dadamda.conf` and reload again.

### B3. Bring up DaDamDa itself

Back in the **DaDamDa** repo directory. Only start `postgres redis backend
frontend` explicitly - never `nginx`/`certbot` from DaDamDa's own compose
files in this path, since the other project's nginx is the one serving
traffic:

```bash
docker compose -f docker-compose.yml -f docker-compose.shared-nginx.yml \
  up -d --build postgres redis backend frontend

docker compose -f docker-compose.yml -f docker-compose.shared-nginx.yml \
  exec backend alembic upgrade head
```

`docker-compose.shared-nginx.yml` attaches `backend`/`frontend` to
`ca_network` (declared `external: true` - it must already exist, created
by the other project) so the other project's nginx can reach them as
`http://dadamda-backend:8000` / `http://dadamda-frontend:3000`, exactly as
referenced in `nginx/shared-nginx-dadamda.conf`.

Verify:

```bash
curl -I https://dadamda.duckdns.org/
curl -s https://dadamda.duckdns.org/api/v1/health
```

### Updating DaDamDa later (Path B)

```bash
git pull
docker compose -f docker-compose.yml -f docker-compose.shared-nginx.yml \
  up -d --build postgres redis backend frontend
docker compose -f docker-compose.yml -f docker-compose.shared-nginx.yml \
  exec backend alembic upgrade head
```

Certificate renewal is handled by the *other* project's certbot service -
nothing to do on DaDamDa's side for that.

---

## Path A: Standalone (fresh server, no existing reverse proxy)

Only relevant if DaDamDa is ever deployed alone on a box with nothing else
on 80/443. Not what applies to the current server.

### A1. First-time TLS certificate (one-time only)

`nginx/prod.conf` expects a certificate that doesn't exist yet, so bootstrap
it first with the HTTP-only config. This brings up the whole stack (backend/
frontend still built from the dev Dockerfiles at this point - harmless,
step A2 replaces them) plus nginx serving the ACME challenge on port 80:

```bash
docker compose -f docker-compose.yml -f docker-compose.bootstrap.yml up -d

docker compose -f docker-compose.yml -f docker-compose.bootstrap.yml run --rm certbot \
  certonly --webroot -w /var/www/certbot \
  -d dadamda.duckdns.org \
  --email <your-email> --agree-tos --no-eff-email

docker compose -f docker-compose.yml -f docker-compose.bootstrap.yml down
```

If certbot fails with a connection/timeout error, it almost always means
port 80 isn't actually reachable from the internet yet (firewall/security
group) or the DNS record hasn't propagated - re-check step 0 before retrying.

### A2. Bring up the real stack

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec backend alembic upgrade head
```

Verify:

```bash
curl -I https://dadamda.duckdns.org/
curl -s https://dadamda.duckdns.org/api/v1/health
```

### A3. Certificate renewal

The `certbot` service in `docker-compose.prod.yml` runs `certbot renew`
every 12h in a loop, which silently no-ops until the cert is within 30
days of expiring. Renewal alone doesn't make nginx pick up the new file,
though, so reload it periodically (e.g. a weekly cron job on the host):

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec nginx nginx -s reload
```

### Updating the deployment later (Path A)

```bash
git pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec backend alembic upgrade head
```

---

## Seed demo data for the presentation (either path)

The database starts empty - there's no market/store/product data until
you load some. For the competition demo, reset to the known-good
모래내시장 dataset (13 stores, 14 products, matches what the Kakao Map
view expects to show):

```bash
# Path B
docker compose -f docker-compose.yml -f docker-compose.shared-nginx.yml \
  exec -T postgres psql -U dadamda -d dadamda < scripts/seed_demo_data.sql

# Path A
docker compose -f docker-compose.yml -f docker-compose.prod.yml \
  exec -T postgres psql -U dadamda -d dadamda < scripts/seed_demo_data.sql
```

This is destructive (`TRUNCATE ... RESTART IDENTITY`) by design so it's
safe to re-run before every rehearsal - never point it at anything but
this disposable demo database.

## Notes

- Postgres/Redis/backend/frontend bind their ports to `127.0.0.1` only
  (see `docker-compose.yml`), so they're reachable from the VM itself
  (e.g. `docker compose exec` or a local `psql`) but not from the public
  internet, in addition to whatever Docker-network access the reverse
  proxy has (Path B).
- `docker-compose.override.yml` (dev-only bind mounts + dev nginx config)
  is auto-loaded by plain `docker compose up`, but explicit `-f` combos
  like the ones above skip it automatically - that's intentional, not a
  file to merge in for prod.
- `NEXT_PUBLIC_*` values (including `NEXT_PUBLIC_KAKAO_MAP_KEY`) are baked
  into the frontend image at build time. Changing any of them in `.env`
  requires rebuilding the frontend (`up -d --build frontend`), not just a
  restart.
- The Kakao Map view (`/markets` → 지도 보기) is lazy-loaded - the SDK
  script is never fetched from the list view, only once the map tab is
  actually opened.
- The demo DB is disposable dev/competition data, not a real production
  database - there's no backup strategy here yet. Add one before treating
  this as anything more than a demo deployment.
