# Vote on Poll Card

This flow describes how users can vote on poll cards within an activity in the Travel Cards application.

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
   - Current vote tallies and participant selections are visible in real-time

3. **Select Poll Option**
   - User clicks on their preferred option within a poll card
   - Only one option can be selected per poll (single selection constraint)
   - Selected option is highlighted to indicate the user's choice

4. **Vote Submission**
   - Votes are submitted automatically upon selection
   - No separate submit button is required
   - Vote updates are reflected immediately in the interface

5. **Change Vote (Optional)**
   - User can change their selection by clicking a different option
   - Previous vote is automatically replaced with the new selection
   - Vote change is synchronized in real-time across all connected users

6. **View Results**
   - Vote totals are displayed for each option in real-time
   - Individual participant selections are visible to all users
   - Results update automatically when any participant votes or changes their vote

## Key Features

- **Single Selection**: Users can only vote for one option per poll
- **Public Votes**: All votes and results are visible to all participants
- **Vote Change**: Participants can change their selection at any time
- **Real-time Sync**: Vote updates are synchronized across all connected users via WebSocket
- **Responsive Design**: Poll cards display properly on mobile and desktop devices
- **Immediate Feedback**: Votes are registered instantly without page refresh

## Limitations

- No anonymous voting - all votes are associated with authenticated users
- Poll results are always public and visible to all participants
- Cannot abstain from voting once an option is selected (must choose a different option)
- No time-limited voting periods or poll closing functionality

## Tests

- Poll Card Voting E2E Test *(not yet implemented)*
- PollCard Component Unit Tests *(not yet implemented)*
- Vote Synchronization Tests *(not yet implemented)*
- Real-time Update Tests *(not yet implemented)*