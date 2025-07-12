# Current E2E Testing Setup Summary

## Playwright Configuration

- Tests in tests/e2e/ directory
- Runs against http://localhost:5173 `playwright.config.ts:11`
- Tests Chrome, Firefox, and Safari `playwright.config.ts:14-26`

## Authentication Setup

- Google OAuth via @hono/auth-js `src/worker/index.ts:5`
- Protected API routes require authentication `src/worker/index.ts:81`
- ActivityPage redirects unauthenticated users to home `src/react-app/components/ActivityPage.tsx:46`

## Authentication

- Mock authentication system for testing - see [auth-mocking-e2e.md](auth-mocking-e2e.md)

## Test Scripts

- `npm run test:e2e` - Run tests `package.json:69`
