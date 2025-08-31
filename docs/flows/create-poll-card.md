# Create Card - Poll

This flow describes how users can create a new Poll card within an activity in the Trippy Cards application.

## Prerequisites

- [Authentication](authentication.md)
- [Create Activity](create-activity.md) - User must be on an activity page

## Steps

1. **Navigate to Activity Page**
   - User visits an existing activity page (`/activities/[activity-id]`)
   - The Cards section displays with existing cards or "No cards yet" message

2. **Select Poll Card Type**
   - User clicks the "Create Card" button (with plus icon)
   - A dropdown menu appears showing card type options
   - User clicks "Poll Card" from the menu
   - A modal opens specifically for poll card creation

3. **Fill Poll Information**
   - User enters a **Poll Question*** (required field)
   - User adds **Poll Options*** (at least two required)
     - Each option is entered in a separate input field
     - User can add or remove options (minimum two)

4. **Submit or Cancel**
   - User clicks "Create Card" to submit the form
   - Alternatively, user can click "Cancel" or "X" to close without saving
   - Form validates that the question is not empty and at least two options are provided

5. **Card Created and Displayed**
   - Modal closes automatically on successful creation
   - New Poll card appears immediately in the cards list
   - Card displays:
     - Poll question
     - List of options (ready for voting)
     - Context menu for edit/delete actions (if supported)

## Limitations

- No update or delete functionality
- No support for multiple-choice or ranked voting (single option per user)
- No support for poll closing or expiration

## Tests

- Poll Card Creation E2E Test *(not yet implemented)*