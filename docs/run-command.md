# Run Commands

All commands must be run from the `app/` directory:

```bash
cd app
```

## Development

```bash
npm run dev        # Next.js dev server on localhost:3000 (fast refresh)
```

## Production Testing

```bash
npm run preview    # Build Worker bundle and serve via Wrangler (production runtime)
```

**Critical:** Always run `npm run preview` before `npm run deploy` to catch adapter/runtime issues that the dev server cannot detect.

## Deployment

```bash
npm run deploy     # Build and deploy to Cloudflare
```

## Code Quality

```bash
npm run lint       # ESLint with --max-warnings=0
npm run cf-typegen # Generate cloudflare-env.d.ts bindings
```

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server (fast refresh) |
| `npm run preview` | Build and serve via Wrangler (production runtime) |
| `npm run deploy` | Build and deploy to Cloudflare |
| `npm run lint` | Run ESLint |
| `npm run cf-typegen` | Generate Cloudflare TypeScript bindings |
