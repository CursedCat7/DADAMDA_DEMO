# Deploying DaDamDa to the Ubuntu VM

Target: Ubuntu cloud server at `141.147.179.193`, domain `dadamda.duckdns.org`
(DuckDNS A record already points at the server).

This replaces the Cloudflare Tunnel plan in `Docs/02 §13` — direct deployment
on the VM with a real domain and Let's Encrypt TLS instead.

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

If the VM is on a cloud provider with its own network security group /
firewall (in addition to `ufw`), open 80/443 there too - `ufw` alone isn't
enough on most cloud providers.

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
`openssl rand -hex 32` for the secret). Leave the `dadamda.duckdns.org`
URLs as-is unless the domain changes.

## 2. First-time TLS certificate (one-time only)

`nginx/prod.conf` expects a certificate that doesn't exist yet, so bootstrap
it first with the HTTP-only config. This brings up the whole stack (backend/
frontend still built from the dev Dockerfiles at this point - harmless,
step 3 replaces them) plus nginx serving the ACME challenge on port 80:

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

## 3. Bring up the real stack

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec backend alembic upgrade head
```

Verify:

```bash
curl -I https://dadamda.duckdns.org/
curl -s https://dadamda.duckdns.org/api/v1/health
```

## 4. Certificate renewal

The `certbot` service in `docker-compose.prod.yml` runs `certbot renew`
every 12h in a loop, which silently no-ops until the cert is within 30
days of expiring. Renewal alone doesn't make nginx pick up the new file,
though, so reload it periodically (e.g. a weekly cron job on the host):

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec nginx nginx -s reload
```

## Updating the deployment later

```bash
git pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec backend alembic upgrade head
```

## Notes

- Postgres/Redis/backend/frontend bind their ports to `127.0.0.1` only
  (see `docker-compose.yml`), so they're reachable from the VM itself
  (e.g. `docker compose exec` or a local `psql`) but not from the public
  internet. Only nginx publishes on `0.0.0.0` (80/443).
- `docker-compose.override.yml` (dev-only bind mounts + dev nginx config)
  is auto-loaded by plain `docker compose up`, but explicit `-f` combos
  like the prod one above skip it automatically - that's intentional,
  not a file to merge in for prod.
- `NEXT_PUBLIC_*` values are baked into the frontend image at build time.
  Changing `.env`'s `NEXT_PUBLIC_*` values requires rebuilding the frontend
  (`up -d --build frontend`), not just a restart.
- The demo DB is disposable dev/competition data, not a real production
  database - there's no backup strategy here yet. Add one before treating
  this as anything more than a demo deployment.
