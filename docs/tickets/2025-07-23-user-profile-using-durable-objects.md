# User profile using Durable Objects

- start: 2025-07-23
- end: 2025-07-25

## Goal

All users are stored in one UsersDO Durable Object.

## Technical Design

We will implement a `UsersDO` Singleton Durable Object that centralizes all user management operations:

- **Singleton Pattern**: Use `idFromName("singleton")` to ensure only one `UsersDO` instance exists
- **SQLite Storage**: Use Durable Object's built-in SQLite via `ctx.storage.sql`
- **Drizzle ORM**: Use Drizzle ORM for type-safe database operations
- **Migration Strategy**: Migrations happen on Durable Object startup

## Steps

### Step 1: Write users to UsersDO

**Goal:** Implement user creation and updates in the UsersDO Durable Object to establish the foundation for centralized user management.

**Main changes:**
- Implement `UsersDO.upsertUser()` method in `src/worker/UsersDO.ts`
- Update `persistUser()` function to call UsersDO in `src/worker/user.ts`
- Implement singleton pattern with `idFromName("singleton")`
- Set up Drizzle ORM integration with SQLite storage

**Commits:** 
- [5e89328](https://github.com/juanibiapina/cf-travelcards/commit/5e89328) - Create UsersDO
- [186ccfd](https://github.com/juanibiapina/cf-travelcards/commit/186ccfd) - Initial writes

### Step 2: Read users from UsersDO ✅ COMPLETED

**Goal:** Implement user retrieval operations from the UsersDO to complete basic CRUD functionality.

**Main changes:**
- ✅ Implement `UsersDO.getUserById()` and `getUserByEmail()` methods in `src/worker/UsersDO.ts`
- ✅ Update existing user lookup logic to use UsersDO instead of external database

**Status:** All user read operations now go through UsersDO. The `getUserById()` and `getUserByEmail()` functions in `src/worker/user.ts` have been updated to call UsersDO methods, and all API endpoints are using these updated functions.

**Commits:**
- [d823c39](https://github.com/juanibiapina/cf-travelcards/commit/d823c39) - Read from users do

### Step 3: Remove all traces of Prisma ✅ COMPLETED

**Goal:** Complete the migration away from Prisma

**Main changes:**
- ✅ Remove all Prisma imports from source code files
- ✅ Remove Prisma dependencies from `package.json`
- ✅ Remove generated Prisma client directory (`src/generated/prisma/`)

**Status:** All Prisma traces have been successfully removed from the codebase. The migration to UsersDO is now complete. Remaining Prisma references in `package-lock.json` are transitive dependencies from `drizzle-orm` and do not affect functionality.
