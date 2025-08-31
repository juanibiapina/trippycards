# Create Card - Link

This flow describes how users can create a new Link card within an activity in the Trippy Cards application.

## Prerequisites

- [Authentication](authentication.md)
- [Create Activity](create-activity.md) - User must be on an activity page

## Steps

1. **Navigate to Activity Page**
   - User visits an existing activity page (`/activities/[activity-id]`)
   - The Cards section displays with existing cards or "No cards yet" message

2. **Select Link Card Type**
   - User clicks the "Create Card" button (with plus icon)
   - A dropdown menu appears showing card type options
   - User clicks "Link Card" from the menu
   - A modal opens titled "Create Link Card"

3. **Fill Card Information**
   - User enters a **URL*** (required field)
     - URL is validated in real-time for proper format
     - Invalid URLs show error message: "Please enter a valid URL"
   - User optionally fills in:
     - **Title** - Display name for the card
     - **Description** - Brief description of the link content
     - **Image URL** - Preview image for the card

4. **Submit or Cancel**
   - User clicks "Create Card" to submit the form
   - Alternatively, user can click "Cancel" or "X" to close without saving
   - Form validates that URL field is not empty and properly formatted

5. **Card Created and Displayed**
   - Modal closes automatically on successful creation
   - New Link card appears immediately in the cards list
   - Card displays:
     - Image preview (if image URL provided)
     - Title (if provided)
     - Description (if provided)
     - Clickable URL that opens in new tab
     - Context menu for edit/delete actions

## Card Features

- **URL Validation**: Only valid URLs are accepted (https://, http://, etc.)
- **Real-time Sync**: Card creation is synchronized across all connected users via WebSocket
- **Safe Link Opening**: Links open in new tab with security attributes (`noopener,noreferrer`)
- **Edit/Delete**: Cards can be edited or deleted via context menu (three dots)
- **Responsive Design**: Cards display properly on mobile and desktop

## Limitations

- All fields except URL are optional, which may result in cards with minimal information
- No URL preview or metadata fetching from provided URLs
- Image URLs are not validated for actual image content

## Tests

- [Card Creation E2E Test](../../tests/e2e/card-creation.spec.ts)
- [LinkCard Component Unit Tests](../../src/react-app/components/cards/LinkCard.test.tsx)
- [CardCreationModal Unit Tests](../../src/react-app/components/cards/CardCreationModal.test.tsx)
- [CardsList Component Unit Tests](../../src/react-app/components/cards/CardsList.test.tsx)
