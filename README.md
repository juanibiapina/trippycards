# Travel Cards

A full-stack web application built with React and Cloudflare Workers for managing trips.

## Prerequisites

- Node.js (latest LTS version)
- npm package manager

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   
   Your application will be available at [http://localhost:5173](http://localhost:5173).

## Development Commands

- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run check` - Full validation (TypeScript + build + dry-run deploy)
- `npm run cf-typegen` - Generate Cloudflare Workers type definitions

## Prisma

Start by changing the schema in `prisma/schema.prisma` then run:

```bash
npm run migrate
```

and:
```bash
npm run generate
```
