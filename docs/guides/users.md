# Users Management Implementation Plan

This document describes the plan for implementing a `UsersDO` Singleton Durable Object to manage users in the Trippy Cards application.

## Current State

- **PostgreSQL + Prisma**: Users stored in database with schema `{id, email, name, picture}`

## UsersDO Implementation Plan

### 1. Architecture Decision

Create a new `UsersDO` Singleton Durable Object:

- Extend `DurableObject<Env>`
- Use SQLite storage via `ctx.storage.sql`
- Singleton pattern with fixed Durable Object ID

### 2. Singleton Implementation Strategy

```typescript
// Get singleton UsersDO instance
const id = env.USERSDO.idFromName("singleton");
const stub = env.USERSDO.get(id);
```

**Key Points:**
- Use `idFromName("singleton")` to ensure only one instance
- All user operations go through this single instance
- The Durable Object handles concurrency natively without any extra code from our side

### 3. Data Migration Plan

**Phase 1: Dual Write**
1. Keep existing PostgreSQL + Prisma system
2. Add UsersDO with dual-write pattern
3. Write to both PostgreSQL and UsersDO during transition

**Phase 2: Data Sync**
1. Create migration script to sync existing users from PostgreSQL to UsersDO

**Phase 3: Full Migration**
1. Switch all reads to UsersDO
2. Remove PostgreSQL user operations

### 4. UsersDO Interface Design

UsersDO interface should look like an Active Record object: standard methods for creating and querying from a single table.

### 5. Storage Strategy

Data is stored in the durable object internal sql database.

### 6. Integration Points to Update

1. **Authentication Callbacks** (`src/worker/index.ts`):
   - Replace `persistUser()` calls with UsersDO requests
   - Update session enrichment to use UsersDO

2. **API Endpoints** (`src/worker/index.ts`):
   - Replace `/api/users/:id` with UsersDO proxy

### 7. Configuration Changes

1. **wrangler.json**:
   ```json
   "durable_objects": {
     "bindings": [
       {"name": "ACTIVITYDO", "class_name": "ActivityDO"},
       {"name": "USERSDO", "class_name": "UsersDO"}
     ]
   },
   "migrations": [
     {"tag": "v2", "new_sqlite_classes": ["UsersDO"]}
   ]
   ```

2. **Type Definitions**:
   - Add `USERSDO: DurableObjectNamespace` to Env interface
