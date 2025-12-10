# Story: FAQ, CTA, Footer & Deployment

Status: Draft

## Story

As a **potential customer**,
I want **to get answers to common questions, and take action through clear CTAs**,
so that **I can make an informed decision and convert into a user**.

## Acceptance Criteria

1. **AC1:** FAQSection.tsx implements accordion component from Shadcn UI with 4 Q&A pairs
2. **AC2:** FAQ accordion expands/collapses smoothly with animations
3. **AC3:** FAQ addresses top objections: technical/integration, security/privacy, support/onboarding, general questions
4. **AC4:** FinalCTASection.tsx displays action-focused CTA similar to Hero but more urgent/prominent
5. **AC5:** Final CTA includes social proof indicator (e.g., "Join 10,000+ users")
6. **AC6:** Footer.tsx implements multi-column layout with Logo, Quick Links, Company, Legal, Social
7. **AC7:** Footer includes copyright notice with current year
8. **AC8:** Footer responsive: stacked on mobile, multi-column on desktop
9. **AC9:** All CTA buttons functional and linked properly
10. **AC10:** Smooth scroll behavior works for all internal links
11. **AC11:** All animations polished using Framer Motion and Tailwind transitions
12. **AC12:** Lighthouse performance score ≥ 90 on all metrics (Performance, Accessibility, Best Practices, SEO)
13. **AC13:** Successfully deployed to Cloudflare Workers via `npm run deploy`
14. **AC14:** Custom domain configured and working with HTTPS
15. **AC15:** No console errors or warnings in production build
16. **AC16:** All 8 sections complete and polished

## Tasks / Subtasks

### Install Shadcn UI Components (AC: #1)

**Choose your installation method:**

**Option A: Using Shadcn MCP (if available):**
- [ ] Say: "Initialize shadcn in my project" (if not done in Story 1)
- [ ] Say: "Add accordion component to my project"
- [ ] Verify Shadcn components folder created and configured

**Option B: Traditional CLI:**
- [ ] Run `npx shadcn@latest init` to initialize Shadcn UI (if not done in Story 1)
- [ ] Run `npx shadcn@latest add accordion` for FAQ component
- [ ] Verify Shadcn components folder created and configured

**Both methods:**
- [ ] Test accordion component in isolation

### FAQ Section (AC: #1, #2, #3)
- [ ] Create components/sections/FAQSection.tsx
- [ ] Implement Shadcn Accordion component
- [ ] Add 4 FAQ items addressing key objections:
  - Q1: Technical/integration question (e.g., "How does it work?")
  - Q2: Security/privacy concern (e.g., "Is my data secure?")
  - Q3: Support/onboarding question (e.g., "How do I get started?")
  - Q4: General question (e.g., "What makes this different?")
- [ ] Style accordion with Tailwind classes
- [ ] Test expand/collapse animations
- [ ] Add FAQ data to lib/constants.ts (4 Q&A pairs)

### Final CTA Section (AC: #4, #5)
- [ ] Create components/sections/FinalCTASection.tsx
- [ ] Implement layout similar to Hero but more action-focused
- [ ] Add reinforced value proposition headline
- [ ] Add prominent CTA button (larger, more colorful than earlier CTAs)
- [ ] Add social proof indicator (e.g., "Join 10,000+ users" with count)
- [ ] Add gradient background similar to Hero
- [ ] Make responsive and centered
- [ ] Add content to lib/constants.ts (final CTA headline, subtext, social proof count)

### Footer (AC: #6, #7, #8)
- [ ] Create components/sections/Footer.tsx
- [ ] Implement multi-column layout (5 columns):
  - Column 1: Logo + tagline
  - Column 2: Quick links (Product, Features, Quiz)
  - Column 3: Company (About, Blog, Careers)
  - Column 4: Legal (Terms, Privacy, Cookies)
  - Column 5: Social links (icons with links)
- [ ] Add copyright notice with dynamic year `© ${new Date().getFullYear()} Juliet`
- [ ] Implement responsive layout: stacked on mobile, grid on desktop
- [ ] Style with subtle background color and top border
- [ ] Add footer data to lib/constants.ts (links arrays, social links)
- [ ] Use Lucide React icons for social media icons

### Content Finalization (AC: #9, #10)
- [ ] Update lib/constants.ts with:
  - FAQ: 4 Q&A objects
  - Final CTA: headline, subtext, social proof
  - Footer: navigation links, legal links, social media links
- [ ] Remove all placeholder/Lorem Ipsum text
- [ ] Verify all content is production-ready
- [ ] Ensure all links are valid (or use # for placeholders)

### Page Integration (AC: #9, #10, #16)
- [ ] Import FAQ, FinalCTA, Footer sections into app/page.tsx
- [ ] Verify all 8 sections render in correct order:
  1. Hero
  2. Social Proof
  3. Problem/Solution
  4. Benefits
  5. How It Works
  6. FAQ
  7. Final CTA
  8. Footer
- [ ] Test smooth scroll behavior between sections
- [ ] Verify all internal navigation links work
- [ ] Test all CTA buttons (even if they link to #)

### Animations & Polish (AC: #11)
- [ ] Add subtle animations to FAQ accordion
- [ ] Add Final CTA entrance animation (fade + scale)
- [ ] Polish all hover states and transitions
- [ ] Test animations on slower devices
- [ ] Ensure smooth 60fps animations throughout

### Performance Optimization (AC: #12)
- [ ] Run Lighthouse audit in incognito mode
- [ ] Optimize images (use Next.js Image component everywhere)
- [ ] Ensure fonts loaded with next/font (no FOUT/FOIT)
- [ ] Check for layout shift issues (CLS < 0.1)
- [ ] Verify lazy loading for below-fold sections
- [ ] Minimize JavaScript bundle size
- [ ] Fix any performance warnings
- [ ] Achieve ≥ 90 score on all 4 Lighthouse metrics

### Accessibility & Quality Checks (AC: #12, #15)
- [ ] Test keyboard navigation through all interactive elements
- [ ] Verify all images have alt text
- [ ] Check color contrast ratios (WCAG AA minimum)
- [ ] Ensure focus indicators visible
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Run `npm run build` and verify no errors
- [ ] Check for console warnings in production build
- [ ] Verify no React hydration errors

### Deployment to Cloudflare Workers (AC: #13, #14, #15)
- [ ] Login to Cloudflare: `npx wrangler login`
- [ ] Verify wrangler configuration: `npx wrangler whoami`
- [ ] Run local preview: `npm run preview`
- [ ] Test app locally on preview URL (*.workers.dev)
- [ ] Deploy to production: `npm run deploy`
- [ ] Verify deployment successful in Cloudflare dashboard
- [ ] Configure custom domain in Cloudflare Workers settings
- [ ] Add custom domain (e.g., juliet.app or www.juliet.app)
- [ ] Verify DNS and TLS configured automatically
- [ ] Test production URL with custom domain
- [ ] Verify HTTPS working correctly
- [ ] Test page load speed on production

### Final Verification (AC: #12, #13, #14, #15, #16)
- [ ] Run final Lighthouse audit on production URL
- [ ] Test all 8 sections on production
- [ ] Test responsive behavior on production (mobile, tablet, desktop)
- [ ] Verify no console errors on production
- [ ] Test all CTA buttons and links on production
- [ ] Check Cloudflare Analytics enabled
- [ ] Document deployment process in README.md (optional)

## Dev Notes

### Technical Summary

Complete the landing page by implementing the final conversion-focused sections: FAQ (Shadcn accordion addressing objections), Final CTA (urgent call-to-action with social proof), and Footer (multi-column navigation). Integrate Shadcn UI for the FAQ accordion component. Polish all animations and transitions using Framer Motion. Apply the **premium minimalist, borderless aesthetic** consistently across all sections. Optimize performance to achieve Lighthouse score ≥ 90 on all metrics. Deploy to Cloudflare Workers using the @opennextjs/cloudflare adapter and configure custom domain with automatic DNS + TLS.

**Design System Application:**
- **CTA Buttons:** bg-primary (#f9d544) with hover:bg-accent (#ffe362) transitions
- **Borderless Throughout:** All cards use shadows (no borders) for depth and separation
- **Premium Feel:** Generous padding (p-8), rounded corners (rounded-2xl), clean typography

**Key Technical Decisions:**
- Shadcn UI Accordion for FAQ (Radix UI under the hood) - customize with borderless style
- Component installation: Use Shadcn MCP (natural language: "Add accordion component") or traditional CLI (npx shadcn@latest add accordion)
- Framer Motion for all animations (motion/react import)
- Cloudflare Workers deployment (not Pages) for SSR support
- Custom domain with automatic Cloudflare DNS + TLS setup
- Performance-first approach targeting Lighthouse 90+ scores
- Production-ready content (no Lorem Ipsum)

**Deployment Notes:**
- Use `npm run preview` to test locally before deploying
- Use `npm run deploy` for one-command production deployment
- Cloudflare automatically provisions DNS + TLS for custom domain
- Workers support SSR/ISR for future dynamic features

### Project Structure Notes

- **Files to create:**
  - components/sections/FAQSection.tsx
  - components/sections/FinalCTASection.tsx
  - components/sections/Footer.tsx
  - components/ui/accordion.tsx (auto-generated by Shadcn)

- **Files to modify:**
  - lib/constants.ts (add FAQ, final CTA, footer content)
  - app/page.tsx (import and render final 3 sections)
  - README.md (optional: document deployment process)

- **Expected test locations:**
  - Lighthouse audit (Chrome DevTools)
  - Manual testing on production URL
  - Responsive testing via browser DevTools
  - Cloudflare Analytics dashboard

- **Estimated effort:** 3 story points (2-3 days)

### References

- **Tech Spec:** See tech-spec.md → Technical Details (sections 6-9), Deployment Strategy
- **Architecture:** tech-spec.md → Implementation Stack (Shadcn UI, Cloudflare Workers)
- **Deployment Guide:** tech-spec.md → Deployment Strategy (Cloudflare Workers section)
- **Performance Targets:** tech-spec.md → Testing Approach (Performance Testing)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- Will be populated during dev-story execution -->

### Debug Log References

<!-- Will be populated during dev-story execution -->

### Completion Notes List

<!-- Will be populated during dev-story execution -->

### File List

<!-- Will be populated during dev-story execution -->
