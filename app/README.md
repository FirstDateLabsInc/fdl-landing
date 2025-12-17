# Juliet Landing

A premium, borderless landing page for Juliet (First Date Labs) built with Next.js 16, Tailwind CSS 4, and Cloudflare Workers via the OpenNext adapter.

## Local Development

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts the Next.js dev server with fast refresh on `http://localhost:3000`. Use this while building UI and iterating on components. |
| `npm run preview` | Builds the Worker bundle via `opennextjs-cloudflare build` and serves it through Wrangler so you can validate the Cloudflare runtime before deploying. |
| `npm run deploy` | Produces the Worker bundle and publishes it to your Cloudflare account using the routes defined in `wrangler.jsonc`. |
| `npm run cf-typegen` | Generates `cloudflare-env.d.ts` bindings, keeping server components in sync with Cloudflare environment variables. |
| `npm run lint` | Runs `next lint` with ESLint 9.17 rules. |

> ⚠️ Run `npm run preview` at least once before `npm run deploy`. The preview flow uses the same OpenNext compilation pipeline and catches adapter/runtime mismatches that `npm run dev` cannot surface.

## Internal Test Routes (Disabled)

This repo includes a few test-only routes/pages that are intentionally disabled so they can’t be deployed by accident:

- `src/app/api/test-email/route.disabled.ts` (was `/api/test-email`)
- `src/app/test-images/page.disabled.tsx` (was `/test-images`)
- `src/app/test-results/page.disabled.tsx` (was `/test-results`)

To re-enable locally, rename them back to `route.ts` / `page.tsx`.

## Design Tokens & Structure

- Tailwind tokens live in `tailwind.config.ts`, mapping project colors (`#fffdf6`, `#f9d544`, `#cab5d4`, `#ffe362`), Poppins font family, and premium shadows.
- Global CSS (`src/app/globals.css`) sets CSS variables, borderless defaults, and custom utilities (`.shadow-soft`, `.shadow-hover`, `.no-border`).
- Static copy plus placeholder data for future sections sit in `src/lib/constants.ts` so Story 2+ can hydrate real sections without touching layout glue code.
- Base layout (`src/app/layout.tsx`) wires the locally hosted Poppins subsets (weights 400/600/700) found in `public/fonts/poppins/`. If you prefer variable fonts, swap in the official Poppins variable file and update `src/app/fonts.ts` accordingly.
- Cloudflare image resizing is opt-in: set `NEXT_PUBLIC_ENABLE_CF_IMAGE_RESIZING=true` when your zone has Image Resizing enabled. Otherwise the loader falls back to serving the original asset paths.
- The custom Next.js image loader (`src/lib/cloudflare-image-loader.ts`) defaults to serving assets directly. Set `NEXT_PUBLIC_ENABLE_CF_IMAGE_RESIZING=true` in the environment to opt in to Cloudflare Image Resizing (requires the feature on your zone).

## Cloudflare Deployment

1. Install the Cloudflare adapter + Wrangler (already in `package.json`).
2. Configure project-level settings:
   - `open-next.config.ts` exports `defineCloudflareConfig` with the default R2 incremental cache override.
   - `next.config.ts` sets a custom image loader (`./src/lib/cloudflare-image-loader.ts`) so Cloudflare Images power optimized assets in production.
   - `wrangler.jsonc` points `main` to `.open-next/worker.js`, enables `nodejs_compat`, and declares the managed domains:
     - `firstdatelabs.com`
     - `www.firstdatelabs.com`
3. Preview locally with `npm run preview` (wraps `opennextjs-cloudflare build && opennextjs-cloudflare preview`). Wrangler spins up the Worker using your account credentials, matching production behavior.
4. Deploy with `npm run deploy` once preview output looks correct.

### Custom Domain Flow (per Cloudflare docs)

1. Open the Cloudflare Dashboard → **Workers & Pages** → select your Worker → **Settings** → **Domains & Routes**.
2. Click **Add > Custom Domain** and enter `firstdatelabs.com`, then repeat for `www.firstdatelabs.com` if you want a www alias.
3. Cloudflare provisions the DNS + TLS certificates automatically. Because the domains already live in Cloudflare, no manual DNS edits are needed beyond approving the generated routes.

## Continuous Deployment

Automated deploys run via GitHub Actions whenever `main` changes:

1. Repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` authenticate the workflow.
2. Workflow file: `.github/workflows/deploy.yml`.
   - Checks out the repo, installs Node 20, and runs `npm ci`.
   - Executes `npm run lint` to block broken builds.
   - Calls `npm run deploy`, which runs `opennextjs-cloudflare build && ... deploy`.
3. Concurrency is limited to one active deploy (`cloudflare-deploy-main`) so sequential pushes don’t overlap. Use the **Actions** tab → **Deploy to Cloudflare** workflow to monitor status or trigger manual redeploys via **Run workflow**.
4. After propagation, confirm both domains resolve to the Worker. Future `npm run deploy` runs continue using the same routes.

## Additional Notes

- Use `npm run cf-typegen` whenever you add KV namespaces, R2 buckets, or environment bindings so server-side TypeScript stays accurate.
- The repo keeps placeholder directories (`public/images`, `public/icons`, `src/components/sections`) tracked for the follow-up stories that add real assets and JSX sections.
- Fonts: we ship subsetted Poppins 400/600/700 weights (`public/fonts/poppins/`). To regenerate, run `pyftsubset` against the source TTFs (see command examples in docs) or swap in a single variable file if you need the full weight range.
