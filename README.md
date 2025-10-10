# Suri Landing Page

Official landing page for **Suri**, a mobile app designed to help users effortlessly manage their Telesur phone credit and mobile data plans in Suriname.

🌐 **Live Site**: [suri.reinierhernandez.com](https://suri.reinierhernandez.com)

## About

Suri is a mobile application that simplifies managing Telesur prepaid services without requiring an account. This landing page showcases the app's features, screenshots, and provides download links for iOS and Android.

## Tech Stack

- **Framework**: [Astro 5](https://astro.build) (Server-Side Rendering)
- **UI Components**: Astro + React
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Deployment**: [Vercel](https://vercel.com) (SSR with edge functions)
- **Analytics**: Vercel Web Analytics + PostHog
- **Package Manager**: pnpm 10.18.2

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10.18.2 (enforced by packageManager field)

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

Build the production site with type checking:

```bash
pnpm build
```

### Preview

Preview the production build locally:

```bash
pnpm preview
```

### Code Formatting

Format all files with Prettier:

```bash
pnpm prettier
```

## Project Structure

```
src/
├── components/          # UI components
│   ├── ui/             # Reusable UI elements
│   ├── Hero.astro
│   ├── Features.astro
│   ├── HowItWorks.astro
│   ├── Screenshots.astro
│   ├── Download.astro
│   └── posthog.astro   # Analytics (excluded from Prettier)
├── layouts/
│   └── Layout.astro    # Base layout with SEO
├── pages/
│   ├── index.astro     # Homepage
│   ├── privacy.astro   # Privacy policy
│   ├── terms.astro     # Terms of service
│   └── api/
│       └── telesur.json.ts  # API endpoint for mobile app
├── lib/
│   └── utils.ts        # Utility functions
└── styles/
    └── global.css      # Global styles
```

## API Endpoint

The `/api/telesur.json` endpoint provides current Telesur service data consumed by the mobile app:

- Prepaid USSD codes (balance check, recharge, etc.)
- SMS codes for data plans and P2P transfers
- Available data plans with pricing
- Current app version

## Deployment

Deployed to Vercel with automatic deployments from the main branch. The site uses server-side rendering for optimal performance and SEO.

## Development Notes

- Uses path alias `@/*` for imports (e.g., `@/components/Header.astro`)
- Prettier configured for Astro files with single quotes and no semicolons
- `posthog.astro` component excluded from Prettier formatting
- TypeScript strict mode enabled
