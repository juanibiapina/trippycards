# Authentication

This flow describes how users authenticate in the Trippy Cards application.

## Prerequisites

- Google OAuth application configured with client ID and secret
- User must have a Google account

## Steps

1. **Navigate to Application**
   - User visits any page of the application
   - If not authenticated, user is redirected to the home page (`/`) with the original URL stored as a redirect parameter

2. **Sign In Prompt**
   - Application displays sign-in page with "Sign In with Google" button
   - Page shows "Trippy" title and authentication form

3. **Google OAuth Flow**
   - User clicks "Sign In with Google" button
   - Application redirects to Google OAuth consent screen with callback URL containing the original redirect URL
   - User authenticates with Google and grants permissions

4. **User Data Persistence**
   - Upon successful authentication, user data (email, name, picture) is persisted to database
   - System creates or updates user record using email as unique identifier

5. **Authenticated Session and Redirect**
   - User is redirected back to home page
   - If a redirect parameter exists, user is automatically redirected to the original URL they were trying to access
   - Session is maintained using JWT tokens stored in HTTP-only cookies
   - User can now access protected routes and create activities

6. **Sign Out**
   - User can sign out using the "Sign Out" button on the home page
   - Session is cleared and user returns to unauthenticated state

## Supported Auth Methods

Only Google OAuth is supported.

## Protected Routes

- `/activities/*` - All activity pages require authentication
- Users are automatically redirected to home page if attempting to access protected routes while unauthenticated

> [!WARNING]
> Websocket routes aren't protected by authentication.

## Test Authentication

For E2E testing, the application provides a mock authentication system:
- Special endpoint `/api/auth/test-signin` available when `MOCK_AUTH=true`
- Creates test user with email `test@example.com` and name `Test User`
- Used by Playwright tests to authenticate without Google OAuth flow

## Technical Details

- **Authentication Provider**: Google OAuth via @hono/auth-js
- **Session Management**: JWT tokens in HTTP-only cookies
- **Database**: User data stored in PostgreSQL via Prisma
- **Frontend**: React with @hono/auth-js/react hooks for session management
- **Backend**: Hono.js worker with authentication middleware for API protection

## Tests

- [Authentication Setup for E2E Tests](../../tests/e2e/auth.setup.ts)
- All E2E tests depend on the authentication setup project