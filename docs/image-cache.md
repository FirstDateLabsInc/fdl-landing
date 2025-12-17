# Archetype Email Images: Cache + Cost Plan

## Why this exists

Our Resend emails include an archetype image (for example: `/archetypes/chameleon-chameleon.png`). Email clients (Gmail included) fetch images from the public internet. If the URL is not publicly reachable (or returns `404`), the image will not render — even if the file exists locally in `app/public/`.

This doc outlines a low-compute, low-cost setup for serving `/archetypes/*` with aggressive caching on Cloudflare Workers.

## Key constraints

- **No localhost images in email**: `http://localhost:3000/...` will not work for recipients.
- **Public URL required**: emails should reference a deployed hostname (staging or production).
- **Minimize Worker compute**: static assets should be served directly without running the Worker script whenever possible.
- **Aggressive caching is safe only if assets are immutable**: long TTL means clients may keep old images unless filenames change.

## Background (relevant code path)

- `app/src/app/api/waitlist/route.ts` builds an absolute image URL:
  - `baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://firstdatelabs.com"`
  - `archetypeImageUrl = ${baseUrl}${archetype.image}`

If `NEXT_PUBLIC_SITE_URL` is unset locally, quiz emails will point to `https://firstdatelabs.com/...` even when testing locally.

## Cloudflare docs references

- Workers Static Assets `_headers` support and default headers:  
  `https://developers.cloudflare.com/workers/static-assets/headers/`
- `assets.run_worker_first` default behavior (`false`):  
  `https://developers.cloudflare.com/workers/static-assets/binding/`
- Cache Rules (Edge TTL example):  
  `https://developers.cloudflare.com/cache/how-to/cache-rules/examples/edge-ttl/`

## Step-by-step plan

### 1) Confirm the image URL is correct and public

1. Determine the hostname used in emails:
   - Preferred: set `NEXT_PUBLIC_SITE_URL` to your deployed hostname (staging or prod).
   - Fallback: `https://firstdatelabs.com`.
2. Pick one archetype image path from `app/public/archetypes/`.
3. Verify it’s reachable publicly:
   - `curl -I https://<your-hostname>/archetypes/<file>.png`
   - Expect: `200 OK`

If it’s not `200`, fix the deploy first — caching won’t help if the asset is missing.

### 2) Ensure static assets are served without running Worker code (minimize compute)

1. In Cloudflare Workers Static Assets, `assets.run_worker_first` defaults to `false`.
2. Confirm we do **not** enable “run worker first” globally for the assets binding (in `app/wrangler.jsonc` if present/used).

Goal: requests to `/archetypes/*` should be handled by the static asset system, not by SSR/Worker logic.

### 3) Set aggressive browser caching for `/archetypes/*` with `_headers`

1. Create or update `app/public/_headers`.
2. Add a rule to mark archetype images as immutable for ~1 year:

```txt
/archetypes/*
  Cache-Control: public, max-age=31556952, immutable
```

Notes:
- Cloudflare’s Static Assets default is `Cache-Control: public, max-age=0, must-revalidate`. We override that specifically for archetype images.
- Only do this if archetype image filenames are treated as immutable.

### 4) Treat archetype image filenames as immutable (avoid stale caches)

With `immutable` + a long `max-age`, clients can keep cached images for a long time.

Rules of thumb:
- If you need to change an image, **publish it under a new filename**, then update the archetype mapping that points to it.
- Avoid reusing the same filename for new image content unless you also plan a cache purge.

### 5) (Optional) Enforce edge caching with a Cache Rule

If you want a Cloudflare-side guarantee independent of origin headers:
1. Cloudflare Dashboard → **Caching** → **Cache Rules** → create a rule.
2. Match expression: requests for `/archetypes/*` on your hostname.
3. Set:
   - **Cache eligibility**: Eligible for cache
   - **Edge TTL**: set to 1 year (optionally “ignore cache-control header”)

This is optional if `_headers` is set correctly, but it can make behavior more explicit.

### 6) Verify headers and caching behavior after deploy

After deploying:
1. Inspect headers:
   - `curl -I https://<your-hostname>/archetypes/<file>.png`
2. Confirm:
   - `Cache-Control: public, max-age=31556952, immutable`
   - `CF-Cache-Status` becomes `HIT` on subsequent requests (after the first warm-up)

### 7) Re-test email rendering

1. Trigger a quiz result email through the normal flow.
2. Open in Gmail and confirm the archetype image renders.

If it still fails:
- Check the exact URL in the email HTML.
- Verify it’s reachable from a non-local network (not behind VPN/firewall).
- Confirm the file exists at the deployed origin path.

## Cost notes (what this saves)

- Static assets served directly (with `run_worker_first=false`) avoid billable Worker compute for image requests.
- Long-lived caching reduces repeat fetches from origin and lowers bandwidth/egress from your worker setup.

## Rollout checklist

- [ ] Deployed hostname serves `/archetypes/*` with `200 OK`
- [ ] `NEXT_PUBLIC_SITE_URL` is set correctly for the environment sending emails
- [ ] `app/public/_headers` includes `/archetypes/*` caching rule
- [ ] Verified headers + `CF-Cache-Status` behavior in production/staging
- [ ] Verified Gmail renders archetype image in quiz email
