# Trip Functionality Removal Plan

## Overview

This document outlines the plan for removing the old trip functionality that has been replaced by the Activity system. The trip functionality is a legacy feature that provides basic naming and display capabilities, while the Activity system offers a more robust, interactive question-and-response framework.

## General Steps

Each phase should be completed as a separate commit to maintain clean git history and allow for easy rollback if needed. After completing each phase:

1. Run all linting and type checking: `npm run lint`
2. Run all tests: `npm test` and `npm run test:e2e`
3. Ensure the application builds successfully: `npm run build`
4. Commit the changes with a descriptive message

All checks must pass before proceeding to the next phase.

## Removal Steps

### Phase 1: Frontend Cleanup
Remove all trip-related frontend components and routes.

**Files to Remove:**
- `src/react-app/components/TripPage.tsx`
- `src/react-app/components/TripNameForm.tsx`
- `src/react-app/components/TripPage.test.tsx`
- `src/react-app/components/TripNameForm.test.tsx`

**Files to Modify:**
- `src/react-app/main.tsx`: Remove trip route (`/trips/:tripId`)
- `src/react-app/Home.tsx`: Remove "Create Trip" button and functionality

### Phase 2: Backend API Cleanup
Remove all trip-related API endpoints and Durable Object handlers.

**Files to Remove:**
- `src/worker/trip.ts` (entire file)

**Files to Modify:**
- `src/worker/index.ts`: Remove trip routes (lines 88-135)
  - `GET /api/trips/:id` (v1 PostgreSQL endpoint)
  - `GET /api/trips/v2/:tripId` (v2 Durable Object endpoint)
  - `PUT /api/trips/v2/:tripId` (v2 update endpoint)

### Phase 3: Infrastructure Cleanup
Remove trip-related database schema and Cloudflare configurations.

**Database Changes:**
- `prisma/schema.prisma`: Remove Trip model
- Run database migration to drop Trip table: `npm run db:migrate`

**Cloudflare Configuration:**
- `wrangler.json`: Remove TRIPDO Durable Object binding

### Phase 4: Test Cleanup
Remove any remaining trip-related tests and update test suites.

**Files to Review:**
- Check for any integration tests mentioning trips
- Update E2E tests if they reference trip functionality
- Verify no remaining test fixtures or mocks for trips

> [!WARNING]
> If no e2e tests are left, write a simple test for opening the home page
