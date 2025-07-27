# Activity Page Title

- start: 2025-07-27
- end: ongoing

## Goal

Make the browser page title dynamically reflect the activity name when viewing an activity page.

## Current State

- **Base title**: Static "Trippy" in [`index.html`](../../index.html) (line 7)
- **Activity data**: Available in [`OverviewPage`](../../src/react-app/pages/OverviewPage.tsx) via `useActivityRoom` hook (line 19)
- **Route structure**: `/activities/:activityId` → [`ActivityPage`](../../src/react-app/pages/ActivityPage.tsx) → [`OverviewPage`](../../src/react-app/pages/OverviewPage.tsx) (configured in [`main.tsx`](../../src/react-app/main.tsx) lines 19-25)
- **No title management library**: Currently using vanilla document title approach

## Implementation Strategy

### Simple useEffect Approach

Implement title management directly in [`OverviewPage.tsx`](../../src/react-app/pages/OverviewPage.tsx) using `useEffect` and `document.title`:

```typescript
useEffect(() => {
  if (activity?.name) {
    document.title = `${activity.name}`;
  } else if (!loading && activity) {
    document.title = 'Untitled Activity';
  } else {
    document.title = 'Activity';
  }
  
  // Cleanup: reset title when component unmounts
  return () => {
    document.title = 'Trippy';
  };
}, [activity?.name, loading, activity]);
```

### Title Precedence Logic

Handle different states gracefully:
- **Loading**: "Loading activity"
- **Activity with name**: "{activity.name}"
- **Activity without name**: "Untitled Activity" 
- **Component unmount**: Reset to "Trippy"

## Implementation Tasks

- [ ] Add useEffect hook in OverviewPage to update document.title when activity data changes
- [ ] Handle loading states and fallback titles when activity name is not available
- [ ] Test title functionality across different scenarios (loading, no name, with name) using unit tests
- [ ] Ensure title resets when navigating away from activity pages

## Unit Testing Scenarios

- [ ] Test title updates when activity name changes
- [ ] Verify loading state handling  
- [ ] Ensure title resets when navigating away
- [ ] Test scenarios with and without activity names

## Integration test changes

Changes to [`create-activity.md`](../flows/create-activity.md) flow:
- Add an assertion for the initial name and title
- Rename activity
- Assert new name and title

## Implementation Location

**Target**: [`src/react-app/pages/OverviewPage.tsx`](../../src/react-app/pages/OverviewPage.tsx)

**Rationale**: 
- Has access to activity data via [`useActivityRoom`](../../src/react-app/hooks/useActivityRoom.ts)
- Is the main content component for activity pages
- Already handles loading states 