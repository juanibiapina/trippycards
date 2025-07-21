# Vote on Poll Card

This flow describes how users can vote on poll cards within an activity in the Trippy Cards application.

## Prerequisites

- [Authentication](authentication.md)
- [Create Activity](create-activity.md) - User must be on an activity page
- Create Poll Card - User must have poll cards available in the activity

## Steps

1. **Navigate to Activity Page**
   - User visits an existing activity page (`/activities/[activity-id]`)
   - The Cards section displays with existing cards including poll cards

2. **Locate Poll Cards**
   - Poll cards are displayed directly in the cards list alongside other card types
   - Each poll card shows the poll question and available options

3. **Select Poll Option**
   - User clicks on their preferred option within a poll card
   - Only one option can be selected per poll
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

## Tests

- Poll Card Voting E2E Test *(not yet implemented)*
