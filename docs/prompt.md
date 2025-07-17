# Milestone 4 - Cards Feature

This document describe changes required to complete Miletone 4, with the goal to be able to schedule events.
An `Activity` is an event.

## Current Implementation

- Activity model exists in `src/shared/index.ts:1`
- Overview page exists at `src/react-app/pages/OverviewPage.tsx:11` with placeholder content at line 82-84
- Real-time collaboration works for card management
- WebSocket-based activity synchronization

## Planned Implementation

- `cards` field in `Activity` model
- Card creation UI in Overview page
- Link and Poll card types
- Card CRUD operations
- Card-specific collaboration messages

## Cards

Users will be able to create `Cards` in the overview page. Cards will have different types and will be saved in the `Activity` model.

**Required Changes:**
- Extend Activity type in `src/shared/index.ts:1` to include `cards` field
- Replace placeholder content in `src/react-app/pages/OverviewPage.tsx:82-84`

### Link Card

A link card will render an embedded version of the target website, similar to Slack embeds.

```json
{
  type: "link",
  url: "https://example.com"
}
```

### Poll Card (Planned)

This will be a single question poll card that allows users to vote on options.

```json
{
  type: "poll-single-answer",
  title: "Are you going?",
  options: ["Yes", "Maybe", "No"]
}
```

The card will also display how many users have replied to each option, leveraging the existing real-time collaboration system.

## Card Operations

### Create Card

Introduce a new button in the Overview page to create cards. Users can then select the type and a form specific for each type allows them to fill in the fields.

**Implementation Notes:**

- Currently `src/react-app/pages/OverviewPage.tsx:82-84` shows placeholder content
- Will need card creation UI components
- Should integrate with existing real-time WebSocket system

### Update Card

Add a context menu (maybe top right of Card) for extended actions, like updating the card.

**Implementation Notes:**

- Can reuse existing Card component pattern from `src/react-app/components/Card.tsx`
- Should provide easy editing interface for card properties

### Delete Card

Add option to delete card from card context menu (with confirmation).

**Implementation Notes:**
- Use a simple alert for confirming
- Should broadcast deletion via WebSocket to all connected users

## Collaboration

### Current Collaboration Features

The app already has robust real-time collaboration via WebSocket (`src/worker/activity.ts:9`):

- **Message Types**: `activity`, `name`, `dates` (defined in `src/shared/index.ts:17`)
- **Real-time Updates**: All connected users see changes instantly
- **State Persistence**: Uses Cloudflare Durable Objects for state storage
- **User Authentication**: Integrated with Google OAuth

### Planned Card Collaboration

All collaboration features will work with Cards. New message types must be created to handle:

**Required New Message Types:**
```typescript
// Add to src/shared/index.ts message types
{ type: "card-create", card: Card }
{ type: "card-update", cardId: string, card: Card }
{ type: "card-delete", cardId: string }
{ type: "card-vote", cardId: string, vote: string, userId: string } // for poll cards
```

**Implementation Notes:**
- Extend existing WebSocket message handling in `src/worker/activity.ts:61`
- Update client-side hook `src/react-app/hooks/useActivityRoom.ts:15`
- Follow existing patterns for activity collaboration
