# juliet-landing - Technical Specification

**Author:** Yao
**Date:** 2025-10-26
**Project Level:** 1
**Project Type:** software
**Development Context:** greenfield

---

## Source Tree Structure

```
juliet-landing/
├── app/
│   ├── layout.tsx                 # [CREATE] Root layout with metadata
│   ├── page.tsx                   # [CREATE] Main landing page
│   └── globals.css                # [CREATE] Global styles
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx        # [CREATE] Section 1: Hero
│   │   ├── SocialProofSection.tsx # [CREATE] Section 2: Testimonials
│   │   ├── ProblemSolutionSection.tsx # [CREATE] Section 3: Problem vs Solution
│   │   ├── BenefitsSection.tsx    # [CREATE] Section 4: Key Benefits
│   │   ├── HowItWorksSection.tsx  # [CREATE] Section 5: How It Works
│   │   ├── FAQSection.tsx         # [CREATE] Section 6: FAQ
│   │   ├── FinalCTASection.tsx    # [CREATE] Section 7: Final CTA
│   │   └── Footer.tsx             # [CREATE] Section 8: Footer
│   └── ui/
│       ├── Button.tsx             # [CREATE] Reusable button component
│       └── Card.tsx               # [CREATE] Reusable card component
├── lib/
│   └── constants.ts               # [CREATE] Copy text, testimonials, FAQ data
├── public/
│   ├── images/                    # [CREATE] Image assets directory
│   └── icons/                     # [CREATE] Icon assets directory
├── package.json                   # [CREATE] Project dependencies
├── tsconfig.json                  # [CREATE] TypeScript configuration
├── tailwind.config.ts             # [CREATE] Tailwind configuration
├── next.config.ts                 # [CREATE] Next.js configuration
└── README.md                      # [CREATE] Project documentation
```

---

## Technical Approach

**Architecture:**

- Single-page application (SPA) with server-side rendering (SSR) via Next.js App Router
- Component-based architecture with section isolation
- Mobile-first responsive design
- Static generation for optimal performance

**Design System:**

- Tailwind CSS 4.1.16 for styling (utility-first approach)
- **Design Aesthetic:** Premium minimalism with borderless, clean aesthetic
- **Color Palette:**
  - Background: `#fffdf6` (warm off-white/cream) - creates premium, inviting feel
  - Primary: `#f9d544` (warm yellow) - energetic, friendly, attention-grabbing
  - Secondary: `#cab5d4` (soft lavender) - calming, sophisticated complement
  - Accent: `#ffe362` (bright yellow) - highlights and CTAs
- **Design Principles:**
  - Borderless design - no hard borders, use subtle shadows and color separation
  - Generous white space for breathing room
  - Subtle shadows for depth (not borders)
  - Clean typography hierarchy with Poppins font (weights: 400, 600, 700)
  - Smooth animations and transitions (using Motion via `motion/react` import)
  - Animations powered by tw-animate-css (Tailwind v4 compatible)

**Content Management:**

- Static content stored in TypeScript constants
- Easily maintainable copy text
- Type-safe data structures

**Performance Optimization:**

- Next.js Image component for optimized images
- Lazy loading for below-fold sections
- Font optimization with next/font
- Minimal JavaScript bundle

---

## Implementation Stack

**Core Framework:**

- Next.js 16.0.0 (App Router)
- React 19.0.0
- TypeScript 5.7.2

**Styling:**

- Tailwind CSS 4.1.16
- PostCSS 8.4.49
- Autoprefixer 10.4.20

**UI Components:**

- Shadcn UI 3.5.0 (component library built on Radix UI)
- Lucide React 0.468.0 (icon library)
- Framer Motion 12.23.24 (animations - imported as `motion/react`)

**Development Tools:**

- ESLint 9.17.0
- Prettier 3.4.2
- TypeScript strict mode enabled

**Deployment:**

- Cloudflare Workers via @opennextjs/cloudflare adapter (supports SSR/ISR/Middleware)
- Alternative: Cloudflare Pages with static export (for pure static deployment)
- Environment: Node.js ≥ 20.9 LTS
- Wrangler ≥ 3.99.0

---

## Technical Details

### 1. Hero Section

- Full viewport height on desktop
- Centered headline + subheadline + CTA button
- Background: `bg-background` (#fffdf6) with subtle radial gradient accent
- CTA button: `bg-primary` (#f9d544) with `text-gray-900`, no border, soft shadow
- Smooth scroll to next section on CTA click
- Typography: Large, bold headline with generous letter spacing
- Responsive breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- **Design:** Premium minimalist - lots of white space, no borders, clean typography

### 2. Social Proof Section

- Card-based testimonial layout
- 2-3 testimonial cards with:
  - Customer quote
  - Customer name
  - Customer role/company
  - Optional avatar
- **Card Design:** Borderless with `shadow-soft`, white background, rounded corners
- Accent bar on left using `bg-secondary` (#cab5d4) for visual interest
- Horizontal scroll on mobile, grid on desktop
- Generous padding and line height for readability

### 3. Problem vs Solution Section

- Two-column layout (desktop) / stacked (mobile)
- "Old Way" (left/top) vs "New Way" (right/bottom)
- **Visual Contrast:**
  - Old Way: Muted grays with subtle `bg-gray-50`, `shadow-soft`
  - New Way: `bg-accent` (#ffe362) highlight with `shadow-hover`
- Borderless cards with icon differentiators
- Clear, concise bullet points for comparison

### 4. Key Benefits Section

- 4 benefit cards in 2x2 grid (desktop) / stacked (mobile)
- Each card contains:
  - Icon (Lucide React, colored with `text-primary`)
  - Benefit title
  - Short description
- **Card Design:** Borderless white cards with `shadow-soft`, `rounded-2xl`
- Hover effects: `shadow-hover` + subtle scale transform
- Icons with circular `bg-primary` backgrounds (10% opacity)

### 5. How It Works Section

- 4-step process visualization
- Numbered steps with:
  - Step number
  - Step title
  - Step description
- Timeline layout with connecting lines between steps

### 6. FAQ Section

- Accordion component from Shadcn UI for Q&A
- 4 questions addressing top objections:
  - Q1: Technical/integration question
  - Q2: Security/privacy concern
  - Q3: Support/onboarding question
  - Q4: General question
- Smooth expand/collapse animations

### 7. Final CTA Section

- Similar to Hero but more action-focused
- Reinforces value proposition
- Prominent CTA button
- Social proof indicators (optional: "Join 10,000+ users")

### 8. Footer

- Multi-column layout:
  - Column 1: Logo + tagline
  - Column 2: Quick links (Product, Features, Quiz)
  - Column 3: Company (About, Blog, Careers)
  - Column 4: Legal (Terms, Privacy, Cookies)
  - Column 5: Social links
- Copyright notice
- Newsletter signup (optional)

---

## Development Setup

### Prerequisites

- Node.js ≥ 20.9 LTS (required for Next.js 16)
- npm 10.x
- Git
- Cloudflare account with domain already configured

### Initial Setup

```bash
# Create Next.js project
npx create-next-app@latest juliet-landing --typescript --tailwind --app --eslint

# Navigate to project
cd juliet-landing

# Initialize Shadcn UI
# Option 1: Using Shadcn MCP (if available)
#   Say: "Initialize shadcn in my project"
#   Say: "Add accordion, card, and button components to my project"
# Option 2: Traditional CLI
npx shadcn@latest init
npx shadcn@latest add accordion
npx shadcn@latest add card
npx shadcn@latest add button

# Install additional dependencies
npm install lucide-react framer-motion
npm install tw-animate-css  # Tailwind v4 compatible animations
npm install -D prettier prettier-plugin-tailwindcss

# Install Cloudflare deployment dependencies
npm install @opennextjs/cloudflare@latest
npm install -D wrangler@latest

# Note: Import Motion animations using:
# import { motion } from "motion/react" (not "framer-motion")

# Font Setup: Import Poppins in app/layout.tsx
# Add this to app/layout.tsx:
# import { Poppins } from "next/font/google"
# const poppins = Poppins({
#   subsets: ["latin"],
#   weight: ["400", "600", "700"],
#   variable: "--font-poppins"
# })
# Then add className={poppins.variable} to <html> element

# Configure TypeScript strict mode
# Edit tsconfig.json: "strict": true

# Start development server
npm run dev
```

### Design Token Configuration

**Update `tailwind.config.ts`:**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fffdf6",
        primary: "#f9d544",
        secondary: "#cab5d4",
        accent: "#ffe362",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.08)",
        hover: "0 4px 16px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
```

**Update `app/globals.css`:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #fffdf6;
  --primary: #f9d544;
  --secondary: #cab5d4;
  --accent: #ffe362;
}

body {
  background-color: var(--background);
  color: #1a1a1a;
}

/* Premium minimalist utilities */
@layer utilities {
  .shadow-soft {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .shadow-hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  .no-border {
    border: none !important;
  }
}
```

### Cloudflare Configuration

> Primary references:
>
> - [Workers · Framework guides · Web applications · Next.js](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs)
> - [Workers · Configuration · Routes and domains · Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains)

1. **Install the Cloudflare adapter and Wrangler CLI** (run from `/app` so dependencies live next to `package.json`):

   ```bash
   npm install @opennextjs/cloudflare@latest
   npm install -D wrangler@latest
   ```

   These packages are required by the official Next.js on Workers guide to build (`opennextjs-cloudflare`) and deploy (`wrangler`) the project.

2. **Add `open-next.config.ts` at the project root (`/app/open-next.config.ts`)** so the adapter knows how to compile for Workers:

   ```typescript
   import { defineCloudflareConfig } from "@opennextjs/cloudflare";

   export default defineCloudflareConfig();
   ```

   The config can later be extended with caching directives as documented in the OpenNext/Cloudflare guide.

3. **Create `wrangler.jsonc`** (recommended over `wrangler.toml` per the Workers docs). Keep the compatibility date at or beyond `2024-09-23` so `nodejs_compat` is honored:

   ```jsonc
   {
     "$schema": "node_modules/wrangler/config-schema.json",
     "name": "juliet-landing",
     "main": ".open-next/worker.js",
     "compatibility_date": "2025-10-26",
     "compatibility_flags": ["nodejs_compat"],
     "assets": {
       "directory": ".open-next/assets",
       "binding": "ASSETS"
     },
     "routes": [
       {
         "pattern": "firstdatelabs.com",
         "custom_domain": true
       },
       {
         "pattern": "www.firstdatelabs.com",
         "custom_domain": true
       }
     ]
   }
   ```

   Replace the `pattern` values with the exact apex and subdomain(s) purchased on Cloudflare (for this project that’s `firstdatelabs.com` and `www.firstdatelabs.com`). Declaring `custom_domain: true` ensures Workers provisions DNS + TLS automatically once `npx wrangler deploy` is run on the account.

4. **Update `package.json` scripts** to match the adapter’s workflow documented by Cloudflare:

   ```json
   {
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
       "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
       "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts",
       "start": "next start",
       "lint": "next lint"
     }
   }
   ```

   - `preview` runs the compiled Worker locally via `wrangler dev`, which is how the official guide recommends validating the Workers runtime.
   - `cf-typegen` (optional but encouraged) mirrors the docs by emitting `cloudflare-env.d.ts` so server components get typed bindings.

5. **Configure Next.js for Cloudflare Images (optional but recommended)** following the official _Cloudflare Images → Integrate with frameworks → Next.js_ guidance:

   ```typescript
   // /app/lib/cloudflare-image-loader.ts
   const normalizeSrc = (src: string) =>
     src.startsWith("/") ? src.slice(1) : src;

   export default function cloudflareLoader({
     src,
     width,
     quality,
   }: {
     src: string;
     width: number;
     quality?: number;
   }) {
     if (process.env.NODE_ENV === "development") {
       return src;
     }
     const params = [`width=${width}`];
     if (quality) {
       params.push(`quality=${quality}`);
     }
     const paramsString = params.join(",");
     return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
   }
   ```

   Update `next.config.ts` accordingly:

   ```typescript
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     images: {
       loader: "custom",
       loaderFile: "./lib/cloudflare-image-loader.ts",
     },
   };

   export default nextConfig;
   ```

### Environment Configuration

No environment variables required for initial implementation.

### Code Quality Tools

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## Implementation Guide

### Phase 1: Project Setup & Structure (Story 1)

1. Initialize Next.js 16 project with TypeScript and Tailwind
2. Create folder structure (components/sections, components/ui, lib)
3. Configure Tailwind theme with custom colors and fonts
4. Set up ESLint and Prettier
5. Create constants.ts with placeholder content
6. Implement base layout.tsx and page.tsx

**Deliverable:** Runnable Next.js app with file structure

### Phase 2: Core Sections Implementation (Story 2)

1. Implement HeroSection.tsx with responsive design
2. Implement SocialProofSection.tsx with testimonial cards
3. Implement ProblemSolutionSection.tsx with two-column layout
4. Implement BenefitsSection.tsx with grid layout
5. Implement HowItWorksSection.tsx with step visualization
6. Create reusable Button.tsx and Card.tsx components

**Deliverable:** 5 functional sections with responsive layouts

### Phase 3: FAQ, CTA, Footer (Story 3)

1. Implement FAQSection.tsx with accordion (Shadcn UI)
2. Implement FinalCTASection.tsx
3. Implement Footer.tsx with multi-column layout
4. Add smooth scroll behavior
5. Polish animations and transitions

**Deliverable:** Complete landing page with all 8 sections

---

## Testing Approach

### Manual Testing

1. **Responsive Design Testing:**

   - Test on mobile (375px, 414px)
   - Test on tablet (768px, 1024px)
   - Test on desktop (1280px, 1920px)
   - Verify all sections adapt properly

2. **Browser Compatibility:**

   - Chrome (latest)
   - Safari (latest)
   - Firefox (latest)
   - Edge (latest)

3. **Interaction Testing:**

   - Verify all CTA buttons clickable
   - Test FAQ accordion expand/collapse
   - Test smooth scroll behavior
   - Verify hover states on interactive elements

4. **Performance Testing:**
   - Lighthouse score (aim for 90+ on all metrics)
   - Check page load time (< 2s on 3G)
   - Verify no layout shift (CLS < 0.1)

### Accessibility Testing

- Keyboard navigation through all interactive elements
- Screen reader compatibility (NVDA/JAWS)
- Color contrast ratio (WCAG AA minimum)
- Focus indicators visible

### Content Validation

- All copy text displays correctly
- No Lorem Ipsum in final version
- All images have alt text

---

## Deployment Strategy

### Deployment Method: Cloudflare Workers (Primary)

**Why Workers over Pages:**

- Supports SSR/ISR for future dynamic features (forms, A/B testing, personalization)
- No migration needed when adding server-side functionality
- Full Next.js App Router feature support

### Build and Deploy Process

**Local Preview:**

```bash
# Build and preview locally
npm run preview

# This runs:
# 1. opennextjs-cloudflare build
# 2. opennextjs-cloudflare preview
```

**Deploy to Cloudflare:**

```bash
# One-command deployment
npm run deploy

# This runs:
# 1. opennextjs-cloudflare build
# 2. opennextjs-cloudflare deploy
```

**First-time Cloudflare Authentication:**

```bash
# Login to Cloudflare (one-time setup)
npx wrangler login

# Verify deployment configuration
npx wrangler whoami
```

### Custom Domain Setup

1. **Navigate to Cloudflare Dashboard:**

   - Workers & Pages → juliet-landing → Settings → Domains & Routes

2. **Add Custom Domain:**

   - Click "Add" → "Custom Domain"
   - Enter `firstdatelabs.com` and (optionally) `www.firstdatelabs.com`
   - Cloudflare automatically configures DNS + TLS

3. **DNS Configuration (if apex domain):**
   - Cloudflare will create an A/AAAA record automatically
   - For `www` subdomain, a CNAME to `*.pages.dev` is created

### Alternative: Static Export to Cloudflare Pages

**If landing page remains 100% static:**

1. **Update next.config.ts:**

```typescript
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // or use custom Cloudflare loader
  },
};
```

2. **Create Pages project in Cloudflare:**

   - Framework preset: "Next.js (Static HTML Export)"
   - Build command: `npx next build`
   - Build output directory: `out`
   - Node version: 20.9+ (set via NODE_VERSION env var)

3. **Connect Git repository:**
   - Cloudflare Pages auto-builds on push to main branch

### Performance Optimization

**Image Optimization:**

- Use Cloudflare Images with custom loader (configured above)
- Images served via `/cdn-cgi/image/` with automatic WebP conversion
- On-the-fly resizing and optimization

**Caching Strategy:**

- Cloudflare CDN caches static assets automatically
- Workers cache responses at edge locations globally
- Configure cache headers in middleware if needed

**Analytics:**

- Enable Cloudflare Web Analytics (free, privacy-first)
- Track Core Web Vitals metrics
- Monitor real user performance data

### Rollout Plan

1. **Preview Deployment (Development):**

   - Deploy to `*.workers.dev` subdomain first
   - Test all functionality in production-like environment
   - Verify DNS and SSL work correctly

2. **Soft Launch (Staging):**

   - Attach custom domain
   - Share with internal team for final review
   - Verify analytics and monitoring working

3. **Public Launch (Production):**
   - Announce publicly
   - Monitor traffic and performance
   - Gather user feedback

### Post-Deployment Monitoring

**Cloudflare Dashboard:**

- Monitor deployment status and build logs
- Track worker invocations and requests
- Review security events and bot traffic

**Analytics:**

- Cloudflare Web Analytics for traffic insights
- Core Web Vitals monitoring
- Error tracking via Cloudflare Logs

**Performance Metrics:**

- Response time at edge locations
- Cache hit ratio
- Bandwidth usage

### Important Notes

⚠️ **Do not use** `export const runtime = 'edge'` in route handlers - the OpenNext Cloudflare adapter doesn't support edge runtime yet.

✅ **Node.js compatibility:** The `nodejs_compat` flag in wrangler.jsonc enables Node.js APIs in Workers.

✅ **Domain already in Cloudflare:** Since domain is managed by Cloudflare, custom domain setup is automatic with DNS + TLS provisioning.
