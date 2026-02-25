# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing page for "Suri", a mobile app for managing Telesur mobile credit and data plans in Suriname. Built with Astro 5 + React, styled with Tailwind CSS 4, deployed to Vercel with SSR.

Live site: https://suriapp.sr

## Commands

- `pnpm dev` — dev server on localhost:4321
- `pnpm build` — type-check (`astro check`) then build
- `pnpm lint` — run ESLint
- `pnpm lint:fix` — run ESLint with auto-fix
- `pnpm format` — format all files with Prettier
- `pnpm typecheck` — run Astro type checking
- `pnpm test` — run tests with Vitest
- `pnpm test:watch` — run tests in watch mode

## Code Conventions

### Imports

Use the `@/*` path alias for all src imports:

```ts
import Layout from '@/layouts/Layout.astro'
import { cn } from '@/lib/utils'
```

### Component Strategy

- **Astro components (.astro)**: For static/server-rendered sections (Header, Hero, Features, etc.)
- **React components (.tsx)**: Only for interactive elements requiring client-side JS (Navigation, ThemeToggle)

### Styling

- Tailwind CSS 4 via Vite plugin (configured in `astro.config.mjs`, not PostCSS)
- Use `cn()` from `@/lib/utils.ts` for conditional class merging (clsx + tailwind-merge)

### Formatting (Prettier)

- Single quotes, no semicolons, 2-space indentation, trailing commas (es5)
- `.astro` files parsed with `prettier-plugin-astro`
- **Do not format** `src/components/posthog.astro` (excluded in `.prettierignore` and `eslint.config.js`)

### Linting (ESLint)

- Flat config in `eslint.config.js`
- Astro recommended rules + TypeScript strict + React Hooks rules
- `@typescript-eslint/no-explicit-any`: warn
- Unused vars with `^_` prefix are allowed
- Ignored dirs: `dist/`, `.vercel/`, `.astro/`, `node_modules/`

### TypeScript

- Strict mode (extends `astro/tsconfigs/strict`)
- React JSX uses `react-jsx` transform — no explicit React imports needed

## Architecture Notes

### SSR

Output mode is `server` in `astro.config.mjs`. The Vercel adapter handles deployment with Web Analytics enabled.

### API Endpoint

`/api/telesur.json` returns Telesur prepaid data (USSD codes, data plans, pricing, app version). **This endpoint is consumed by the Suri mobile app** — coordinate any changes to the response shape.

### Analytics

Dual tracking with **Vercel Analytics** and **PostHog** — every event is sent to both.

- **Shared utility**: `src/lib/analytics.ts` provides `trackEvent()` and `trackSectionVisibility()`. Always use these instead of calling `track()` or `posthog.capture()` directly.
- **PostHog** is injected via `src/components/posthog.astro` in the base Layout. This component is excluded from both Prettier and ESLint.
- **Vercel Analytics** is enabled via the Vercel adapter in `astro.config.mjs`.
- **`Window.posthog`** type is declared in `src/env.d.ts`.

#### Event naming conventions

- `cta_click` — navigational/engagement CTA clicks (props: `type`, `location`)
- `download_start` — actual download/app store link clicks (props: `platform`, `location`)
- `section_viewed` — scroll depth/funnel tracking via IntersectionObserver (props: `section`)
- `faq_opened` — FAQ item expanded (props: `question`)

#### Tracked components

Hero, Features, HowItWorks, Download, FAQ, and Navigation all include analytics. When adding new sections or CTAs, use `trackEvent()` and `trackSectionVisibility()` from `@/lib/analytics`.

### SEO

- `StructuredData.astro` injects JSON-LD into the page
- `@astrojs/sitemap` generates a sitemap at build time
- OG image at `public/og.png`
- PWA manifest at `public/manifest.json`
