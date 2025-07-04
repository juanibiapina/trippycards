# Travel Cards

A full-stack web application built with React and Cloudflare Workers for managing trips with Google OAuth authentication.

## Prerequisites

- Node.js (latest LTS version)
- npm package manager
- Google OAuth credentials (for authentication)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.dev.vars` file in the root directory with:
   ```
   DATABASE_URL="your-database-url"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   BASE_URL="http://localhost:5173"
   ```

3. Generate Prisma client:
   ```bash
   npm run generate
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   
   Your application will be available at [http://localhost:5173](http://localhost:5173).

## Authentication

The application uses Better Auth with Google OAuth for authentication. To access trips and features, users must sign in with their Google account.

### Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:5173` and your production domain to authorized origins
6. Add the client ID and secret to your `.dev.vars` file

### Features

- **Google OAuth Sign-in**: Secure authentication with Google accounts
- **User Profile Display**: Shows authenticated user name and profile picture
- **Protected Routes**: Trip access requires authentication
- **Session Management**: Automatic session handling with sign-out functionality

## Development Commands

- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run cf-typegen` - Generate Cloudflare Workers type definitions

## Linting and Testing

- `npm run lint` - Run ESLint for code quality checks
- `npm test` - Run unit tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests with Playwright

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
