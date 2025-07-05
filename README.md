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

- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run cf-typegen` - Generate Cloudflare Workers type definitions

## Linting and Testing

- `npm run lint` - Run ESLint for code quality checks
- `npm test` - Run unit tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests with Playwright

## Authentication

This application uses OAuth authentication with Google via @hono/auth-js. To enable authentication, you need to set up the following environment variables:

### Required Environment Variables

- `AUTH_SECRET` - A secret key for encrypting sessions (generate a random string)
- `GOOGLE_ID` - Your Google OAuth Client ID 
- `GOOGLE_SECRET` - Your Google OAuth Client Secret

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Set the authorized redirect URI to: `https://your-domain.com/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your environment variables

### For Development

Create a `.dev.vars` file in the project root:
```
AUTH_SECRET=your-random-secret-string
GOOGLE_ID=your-google-client-id  
GOOGLE_SECRET=your-google-client-secret
```

### For Production

Set these environment variables in your Cloudflare Workers dashboard or use `wrangler secret put`.

## Deployment

- `npm run check` - Build and dry-run deploy
- `npm run deploy` - Deploy to Cloudflare Workers
## Prisma

Start by changing the schema in `prisma/schema.prisma` then run:

```bash
npm run migrate
```

and:
```bash
npm run generate
```
