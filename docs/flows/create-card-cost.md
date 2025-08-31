# Create Card - Cost Split

This flow describes how users can create a new Cost card within an activity in the Trippy Cards application, enabling participants to split expenses. This is useful for tracking shared costs where one or more people pay and others owe their share.

## Prerequisites

- [Authentication](authentication.md)
- [Create Activity](create-activity.md) - User must be on an activity page

## Development Strategy

When requested to implement a step, follow the following process:

1. Continue the flow test implementation for the requested step in the same test, not as a separate test
2. The assistant should run `npm run test:e2e -- --project=chrome-mobile <flow test>` themselves and check if it passes or fails for the correct reason: It must fail exactly because the implementation for the **next step** is missing.
3. Write minimal code that makes the flow test pass

## Technical Notes

**User Management**: Users should be added as part of the activity when they interact with any card. Keep a record of user IDs at the activity level. This record serves as the base from where to select users to do the split or to be payers.

## Steps

1. **Navigate to Activity Page**
   - User visits an existing activity page (`/activities/[activity-id]`)
   - The Cards section displays with existing cards or "No cards yet" message

2. **Select Cost Card Type**
   - User clicks the "Create Card" button (with plus icon)
   - A dropdown menu appears showing card type options
   - User clicks "Cost Card" from the menu
   - A modal opens specifically for cost card creation

3. **Fill Cost Information**
   - User enters a **Description*** of the cost (required field)
   - User enters the **Total Amount*** (required, must be positive)
   - User selects one or more **Payers*** from the list of users in the activity (at least one required)
     - Each payer has an associated amount; starting implementation should assume one payer pays the total amount, but store as an array of payments for future multiple payers (e.g. `[{ userId, amount }]`)
   - User selects one or more **Participants*** who will split the cost (at least one required, cannot be empty)
     - The system displays the calculated split for each participant (e.g. equally divided, but can be extended for custom splits in the future)

4. **Submit or Cancel**
   - User clicks "Create Card" to submit the form
   - Form validates:
     - Description is not empty
     - Total amount is positive
     - At least one payer is selected, and payment amounts sum to the total amount
     - At least one participant is selected
   - On validation error, display error messages accordingly

5. **Card Created and Displayed**
   - Modal closes automatically on successful creation
   - New Cost card appears immediately in the cards list
   - Card displays:
     - Description
     - Total amount
     - List of payers and their amounts
     - List of participants and how much each owes
     - Context menu for edit/delete actions

## Limitations

- No update or delete functionality
- Only equal split among participants for now (no custom splits yet)
- No support for currency selection (assume default currency)
- No payment settlement or marking debts as paid (future feature)

## Tests

- [Cost Card Creation Flow Test](../../tests/flows/card-cost-creation.spec.ts)