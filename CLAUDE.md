# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a landing page for "Suri", a mobile app for managing Telesur mobile credit and data plans in Suriname. The site is built with Astro 5, using React components for interactive elements, and deployed to Vercel with server-side rendering.

## Technology Stack

- **Framework**: Astro 5 (SSR mode with Vercel adapter)
- **UI Components**: Mix of Astro components (.astro) and React components (.tsx)
- **Styling**: Tailwind CSS 4 (via Vite plugin)
- **Package Manager**: pnpm 10.18.2 (enforced via packageManager field)
- **TypeScript**: Strict mode enabled (extends "astro/tsconfigs/strict")
- **Analytics**: Vercel Web Analytics + PostHog

## Development Commands

All commands use pnpm:

- **Start dev server**: `pnpm dev` (runs on localhost:4321)
- **Type checking**: `astro check` (runs automatically before build)
- **Build**: `pnpm build` (includes type check + astro build)
- **Preview build**: `pnpm preview`
- **Format code**: `pnpm prettier` (formats all files using Prettier)

## Project Structure

```
src/
├── components/          # UI components (both .astro and React)
│   ├── ui/             # Reusable UI components (Button variants)
│   ├── Hero.astro      # Landing sections
│   ├── Features.astro
│   ├── HowItWorks.astro
│   ├── Screenshots.astro
│   ├── Download.astro
│   ├── Header.astro
│   ├── Footer.astro
│   └── posthog.astro   # Analytics component (excluded from formatting)
├── layouts/
│   └── Layout.astro    # Base layout with SEO meta tags
├── pages/              # File-based routing
│   ├── index.astro     # Homepage (composes all section components)
│   ├── privacy.astro
│   ├── terms.astro
│   └── api/
│       └── telesur.json.ts  # API endpoint returning Telesur data
├── lib/
│   └── utils.ts        # Utility functions (cn for className merging)
└── styles/
    └── global.css      # Global styles
```

## Key Architecture Patterns

### Path Aliases

- Use `@/*` imports (configured in tsconfig.json): `import Layout from '@/layouts/Layout.astro'`

### Component Strategy

- **Astro components**: For static/server-rendered sections (Header, Hero, Features, etc.)
- **React components**: For interactive UI elements (Button.tsx)
- Both can coexist (e.g., Button.astro wraps styling, Button.tsx handles interactivity)

### Styling

- Tailwind CSS 4 integrated via Vite plugin (not PostCSS)
- Use `cn()` utility from `@/lib/utils.ts` for conditional classes
- Prettier configured to format .astro files with prettier-plugin-astro

### API Routes

- `/api/telesur.json.ts`: Returns JSON with Telesur prepaid options, data plans, and app version
- Used by the mobile app to fetch current service codes and pricing

### Server-Side Rendering

- Output mode: `server` (astro.config.mjs)
- Deployed to Vercel with SSR adapter
- Vercel Web Analytics enabled in adapter config

### Analytics

- PostHog analytics injected via `posthog.astro` component in Layout
- Component excluded from Prettier formatting (see .prettierignore)

## Important Notes

- **DO NOT format** `src/components/posthog.astro` (excluded in .prettierignore)
- The `/api/telesur.json` endpoint is consumed by the mobile app - coordinate changes
- Prettier uses single quotes, no semicolons, 2-space tabs
- React JSX uses `react-jsx` transform (no explicit React imports needed)
