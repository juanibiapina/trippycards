# Create Card - AILink

This flow describes how users can create a new AILink card within an activity in the Trippy Cards application. This flows doesn't cover the actual async processing of AILink cards and subsequent UI updates.

## Prerequisites

- [Authentication](authentication.md)
- [Create Activity](create-activity.md) - User must be on an activity page

## Steps

1. **Navigate to Activity Page**
   - User visits an existing activity page (`/activities/[activity-id]`)
   - The Cards section displays with existing cards or "No cards yet" message

2. **Open Card Creation Modal**
   - User clicks the "Create Card" button (with plus icon)
   - A modal opens titled "Create AILink Card"

3. **Fill Card Information**
   - User enters a **URL*** (required field)
     - URL is validated in real-time for proper format
     - Invalid URLs show error message: "Please enter a valid URL"

4. **Submit or Cancel**
   - User clicks "Create AILink Card" to submit the form
   - Alternatively, user can click "Cancel" or "X" to close without saving
   - Form validates that URL field is not empty and properly formatted

5. **AILink Card Created and Processing Begins**
   - Modal closes automatically on successful creation
   - New AILink card appears immediately in the cards list showing "Processing..." state
   - Card displays:
     - Loading indicator while AI processes the URL
     - Processing status message
     - Context menu delete actions

## Processing States

- **Processing**: AI is analyzing the URL content and generating suggestions
- **Completed**: AI has finished processing and created child cards
- **Error**: Processing failed (network error, invalid content, AI service unavailable)

## Tests

- [AILink Card Creation E2E Test](../../tests/flows/card-ailink-creation.spec.ts)