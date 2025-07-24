# Travel Cards

A full-stack web application built with React and Cloudflare Workers for managing activities.

## Prerequisites

- Node.js v22+
- npm package manager

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server: (it's automatically started in the tmux session `cf-travelcards`, window `5:dev`.
   ```bash
   npm run dev
   ```
   
   Your application will be available at [http://localhost:5173](http://localhost:5173).

## Development Commands

- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run cf-typegen` - Generate Cloudflare Workers type definitions

## Linting and Testing

- `npm run lint` - Run ESLint for code quality checks
- `npm test` - Run unit tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests with Playwright
  - Tests run across multiple browsers: Desktop Chrome, Firefox, Safari, and Chrome Mobile (Pixel 5)
  - Chrome Mobile configuration includes touch support and mobile viewport for mobile testing

## Deployment

- `npm run check` - Build and dry-run deploy
- `npm run deploy` - Deploy to Cloudflare Workers

## Prisma

Start by changing the schema in `prisma/schema.prisma` then run:

```bash
npm run db:migrate
```

and:
```bash
npm run generate
```

## Wrangler

`wrangler.json` is used to configure Workers in Cloudflare.
Options here also affect the local environment.
