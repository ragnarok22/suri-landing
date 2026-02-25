# Suri Landing Page

[![CI](https://github.com/ragnarok22/suri-landing/actions/workflows/ci.yml/badge.svg)](https://github.com/ragnarok22/suri-landing/actions/workflows/ci.yml)

Official landing page for **Suri**, a mobile app designed to help users effortlessly manage their Telesur phone credit and mobile data plans in Suriname.

[Live Site](https://suriapp.sr)

![Suri OG](public/og.png)

## About

Suri is a mobile application that simplifies managing Telesur prepaid services without requiring an account. This landing page showcases the app's features, screenshots, and provides download links for iOS and Android.

## Tech Stack

- **Framework**: [Astro 5](https://astro.build) with SSR
- **UI Components**: Astro (.astro) + React (.tsx)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) (via Vite plugin)
- **Deployment**: [Vercel](https://vercel.com)
- **Analytics**: Vercel Web Analytics + PostHog
- **Testing**: [Vitest](https://vitest.dev)
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (see `packageManager` in package.json for the exact version)

### Installation

```bash
pnpm install
```

### Development

Start the development server at `localhost:4321`:

```bash
pnpm dev
```

### Building

Type-check and build for production:

```bash
pnpm build
```

### Other Commands

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `pnpm preview`    | Preview the production build locally |
| `pnpm format`     | Format all files with Prettier       |
| `pnpm lint`       | Run ESLint                           |
| `pnpm lint:fix`   | Run ESLint with auto-fix             |
| `pnpm typecheck`  | Run Astro type checking              |
| `pnpm test`       | Run tests with Vitest                |
| `pnpm test:watch` | Run tests in watch mode              |

## Project Structure

```
src/
├── components/
│   ├── ui/                  # Reusable UI elements (Button variants)
│   ├── Header.astro         # Site header with navigation
│   ├── Hero.astro           # Hero section
│   ├── Features.astro       # Feature highlights
│   ├── Screenshots.astro    # App screenshot gallery
│   ├── HowItWorks.astro     # Step-by-step usage guide
│   ├── Download.astro       # App store download links
│   ├── FAQ.astro            # Frequently asked questions
│   ├── Footer.astro         # Site footer
│   ├── Card.astro           # Reusable card component
│   ├── StructuredData.astro # JSON-LD structured data for SEO
│   ├── Navigation.tsx       # React navigation component
│   ├── ThemeToggle.tsx      # Dark/light mode toggle
│   └── posthog.astro        # PostHog analytics
├── layouts/
│   └── Layout.astro         # Base layout with SEO meta tags
├── pages/
│   ├── index.astro          # Homepage
│   ├── privacy.astro        # Privacy policy
│   ├── terms.astro          # Terms of service
│   └── api/
│       └── telesur.json.ts  # API endpoint for the mobile app
├── lib/
│   ├── utils.ts             # Utility functions (cn helper)
│   ├── telesur-scraper.ts   # Telesur data plan scraper with caching
│   └── telesur-scraper.test.ts # Unit tests for scraper parsers
└── styles/
    └── global.css           # Global styles
```

## API Endpoint

The `/api/telesur.json` endpoint provides current Telesur service data consumed by the Suri mobile app:

- Prepaid USSD codes (balance check, recharge, etc.)
- SMS codes for data plans and P2P transfers
- Available data plans with pricing
- Current app version

## Deployment

Deployed to Vercel with automatic deployments from the main branch. The site uses server-side rendering via the `@astrojs/vercel` adapter.

Additional production features:

- **Sitemap** generation via `@astrojs/sitemap`
- **PWA manifest** at `/manifest.json`
- **Structured data** (JSON-LD) for search engines
- **OG image** for social sharing
