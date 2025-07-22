# Vote on Poll Card

This flow describes how users can vote on poll cards within an activity in the Trippy Cards application.

## Prerequisites

- [Authentication](authentication.md)
- [Create Activity](create-activity.md) - User must be on an activity page
- [Create Card - Poll](create-poll-card.md) - User must have poll cards available in the activity
- [User API](../api/users.md)

## Development Strategy

When requested to implement a step, follow the following process:

1. Continue the flow test implementation for the requested step in the same test, not as a separate test
2. The assistant should run `npm run test:e2e -- --project=chrome-mobile <flow test>` themselves and check if it passes or fails for the correct reason: It must fail exactly because the implementation for the current step is missing. If it fails for any other reason, the test must be changed.
3. Write minimal code that makes the flow test pass

## Steps

Given: An activity exists with a poll card

1. **Navigate to Activity Page**
   - User visits an existing activity page (`/activities/[activity-id]`)
   - The Cards section displays with existing cards including poll cards

2. **Locate Poll Cards**
   - Poll cards are displayed directly in the cards list alongside other card types
   - Each poll card shows the poll question and available options

3. **Select Poll Option**
   - User clicks on their preferred option within a poll card
   - Selected option is highlighted to indicate the user's choice

4. **Vote Submission**
   - Votes are submitted automatically upon selection
   - No separate submit button is required
   - Vote updates are reflected immediately in the interface

5. **Change Vote (Optional)**
   - User can change their selection by clicking a different option
   - Previous vote is automatically replaced with the new selection

6. **View Results**
   - Vote totals are displayed for each option in real-time
   - Individual participant selections are visible to all users
   - Results update automatically when any participant votes or changes their vote
   - User profile images are displayed on the option they voted

## Tests

[Poll Card voting flow test](../../tests/flows/vote-on-poll-card.spec.ts)
