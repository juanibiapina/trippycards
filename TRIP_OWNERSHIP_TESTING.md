# Testing Trip Ownership Feature

## Overview
The trip ownership feature has been implemented to track when a user first accesses a trip and to store ownership information.

## Key Changes

### Backend (Durable Object)
- `Trip` type now includes `fresh?: boolean` and `owner?: string` fields
- `TripDO.get()` returns `fresh: true` on first access, `fresh: false` afterwards
- `TripDO.updateName()` accepts an optional owner email parameter
- API endpoint `/api/trips/v2/:tripId` (PUT) now passes authenticated user email to store as owner

### Frontend
- `TripPage` component handles the new `fresh` and `owner` fields
- When `fresh: true` and no name, shows the trip creation form
- When trip has a name, shows the trip details page

## Testing Locally

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the flow:**
   - Navigate to a new trip URL (e.g., `/trip/123`)
   - First visit should show the trip creation form (because `fresh: true`)
   - Enter a trip name and submit
   - The user's email should be stored as the trip owner
   - Subsequent visits should show the trip details page (because `fresh: false`)

## API Behavior

### GET `/api/trips/v2/:tripId`
**First access:**
```json
{
  "fresh": true,
  "name": undefined,
  "owner": undefined
}
```

**Subsequent access (after trip creation):**
```json
{
  "fresh": false,
  "name": "My Trip Name",
  "owner": "user@example.com"
}
```

### PUT `/api/trips/v2/:tripId`
**Request:**
```json
{
  "name": "My Trip Name"
}
```

**Behavior:**
- Stores the trip name
- Stores the authenticated user's email as the owner (if not already set)
- Returns `{"success": true}`

## Test Cases Covered
- First access returns `fresh: true`
- Subsequent access returns `fresh: false`
- Trip creation stores the owner
- Owner is not overwritten on subsequent updates
- Frontend shows appropriate UI based on trip state