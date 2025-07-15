# Cards Feature Implementation Plan

This document outlines a step-by-step implementation plan for the Cards feature (Milestone 4). Each step represents a small, testable, and deployable slice of functionality.

## Step 1: Extend Activity Model with Cards Field

**Goal**: Add `cards` field to Activity model to support card storage

**Changes**:
- Update `Activity` type in `src/shared/index.ts:1` to include `cards: Card[]` field
- Define base `Card` type with common properties (`id`, `type`, `createdAt`, `updatedAt`)

**Testing**: Verify model changes don't break existing functionality

**Deployment**: Safe to deploy - no UI changes, backward compatible

## Step 2: Create Link Card Type Definition

**Goal**: Define LinkCard type and basic rendering component

**Changes**:
- Extend `Card` type with `LinkCard` variant in `src/shared/index.ts`
- Create `LinkCard` component in `src/react-app/components/cards/LinkCard.tsx`
- Add basic URL validation and embed preview functionality

**Testing**: Unit tests for LinkCard component and URL validation

**Deployment**: Safe to deploy - new components not yet used in UI

## Step 3: Add Card Creation UI to Overview Page

**Goal**: Replace placeholder content with card creation interface

**Changes**:
- Replace placeholder in `src/react-app/pages/OverviewPage.tsx:82-84`
- Add "Create Card" button and card type selection modal
- Implement LinkCard creation form with URL input
- Add cards list display area

**Testing**: E2E tests for card creation flow

**Deployment**: Users can create and view link cards (no persistence yet)

## Step 4: Implement Card CRUD Backend Operations

**Goal**: Add server-side card management functionality

**Changes**:
- Extend WebSocket message types with `card-create`, `card-update`, `card-delete`
- Update `src/worker/activity.ts:61` to handle new message types
- Add card CRUD operations to Durable Object state management
- Update activity persistence to include cards

**Testing**: Unit tests for card operations

**Deployment**: Full card persistence and basic collaboration works

## Step 5: Add Real-time Card Collaboration

**Goal**: Ensure all users see card changes in real-time

**Changes**:
- Update `src/react-app/hooks/useActivityRoom.ts:15` to handle card message types
- Add card state management to React components
- Implement real-time card updates, creation, and deletion
- Add optimistic UI updates

**Deployment**: Real-time card collaboration fully functional

## Step 6: Add Card Context Menu and Update/Delete Actions

**Goal**: Allow users to modify and delete existing cards

**Changes**:
- Add context menu component to card display
- Implement card update modal (reuse creation form)
- Add delete confirmation dialog
- Update WebSocket handlers for card modifications

**Testing**: E2E tests for card update and delete operations

**Deployment**: Complete card management functionality

## Step 7: Define Poll Card Type (Foundation)

**Goal**: Add poll card type definition and basic structure

**Changes**:
- Define `PollCard` type in `src/shared/index.ts`
- Create `PollCard` component with options display
- Add poll card to creation form type selection
- Implement basic poll rendering (no voting yet)

**Testing**: Unit tests for PollCard component

**Deployment**: Users can create poll cards (display only)

## Step 8: Implement Poll Card Voting System

**Goal**: Add voting functionality to poll cards

**Changes**:
- Add `card-vote` message type to WebSocket handlers
- Implement vote state management in Durable Objects
- Add voting UI to PollCard component
- Update real-time collaboration for poll votes

**Testing**: E2E tests for poll voting and real-time vote updates

**Deployment**: Full poll card functionality with real-time voting

## Step 9: Add Vote Count Display and User Feedback

**Goal**: Show vote counts and user participation in polls

**Changes**:
- Display vote counts for each poll option
- Show user's current vote selection
- Add vote change functionality
- Implement user list for each option (optional)

**Testing**: E2E tests for vote display and user feedback

**Deployment**: Complete poll card experience

## Step 10: Polish and Error Handling

**Goal**: Improve user experience and handle edge cases

**Changes**:
- Add loading states for card operations
- Implement error handling for failed operations
- Add input validation and user feedback
- Improve card layout and responsive design

**Testing**: E2E tests for error scenarios and edge cases

**Deployment**: Production-ready cards feature

## Notes

- Each step builds on the previous one
- Steps 1-6 complete the Link Card functionality
- Steps 7-9 add Poll Card functionality
- Step 10 provides final polish
- All steps maintain backward compatibility
- Real-time collaboration is integrated throughout
