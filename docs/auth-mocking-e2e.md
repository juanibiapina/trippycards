# Authentication Mocking for E2E Tests

## Overview

E2E tests use a mock authentication system that bypasses Google OAuth and creates a test user session.

## Key Components

### Environment Variable

- `MOCK_AUTH=true` set in `.dev.vars:11` enables mock auth during test runs

### Configuration File

- `.dev.vars` contains the `MOCK_AUTH=true` setting that enables test authentication
- This configuration is automatically loaded by the development server

### Test Authentication Endpoint  

- `/api/auth/test-signin` endpoint in `src/worker/index.ts:82-108`
- Only available when `MOCK_AUTH=true` (checked at `src/worker/index.ts:83`)
- Returns mock user: `test@example.com` (defined at `src/worker/index.ts:89`)

### Authentication Setup

- `tests/e2e/auth.setup.ts` runs before all tests
- Setup function at `tests/e2e/auth.setup.ts:5`
- Calls `/api/auth/test-signin` to create session (`tests/e2e/auth.setup.ts:12`)
- Saves authenticated state to `playwright/.auth/user.json` (`tests/e2e/auth.setup.ts:31`)

## How it Works

1. Dev server runs with `MOCK_AUTH=true` from `.dev.vars`
2. Setup project calls `/api/auth/test-signin` endpoint
3. Mock session created with `test@example.com` user
4. Browser state saved to auth file
5. All test projects load the saved authenticated state
6. Tests run with authenticated user context
