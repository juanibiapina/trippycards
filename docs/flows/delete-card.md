# Delete Card

This flow describes how users can delete cards from an activity in the Trippy Cards application.

## Prerequisites

- [Authentication](authentication.md)
- [Create Activity](create-activity.md) - User must be on an activity page
- User must have existing cards to delete

## Development Strategy

When requested to implement a step, follow the following process:

1. Continue the flow test implementation for the requested step in the same test, not as a separate test
2. The assistant should run `npm run test:e2e -- --project=chrome-mobile <flow test>` themselves and check if it passes or fails for the correct reason: It must fail exactly because the implementation for the current step is missing. If it fails for any other reason, the test must be changed.
3. Write minimal code that makes the flow test pass

## Steps

Given: An activity exists with one or more cards

1. **Navigate to Activity Page**
   - User visits an existing activity page (`/activities/[activity-id]`)
   - The Cards section displays with existing cards

2. **Access Card Actions**
   - User locates the card they want to delete
   - User clicks on the card context menu (three dots on top right)
   - Context menu appears with available card actions

3. **Select Delete Option**
   - User clicks on the "Delete" option from the context menu
   - Delete confirmation dialog appears

4. **Confirm Deletion**
   - Delete confirmation dialog displays warning message about permanent removal
   - User clicks "Delete" button to confirm the action
   - Alternative: User clicks "Cancel" to abort the deletion

5. **Process Deletion**
   - Card is removed from the activity immediately upon confirmation
   - Real-time updates notify other users of the card removal
   - UI updates to reflect the card's removal from the cards list

## Refactoring

- [x] ~~Check usage of Card `centered` attribute~~ - Completed: Removed redundant `centered` prop from Card component
- [x] ~~Remove Edit item from context menu, since it doesn't do anything currently~~ - Completed: Removed Edit functionality from CardContextMenu component
- [x] ~~Check if TODO can be fixed in Card~~ - Completed: Fixed by only showing CardContextMenu when onDelete prop is provided
- [ ] Position of context menu overlaps the link image

## Tests

[Delete card flow test](../../tests/flows/delete-card.spec.ts) 