# Create Activity

This flow describes how users can create a new activity in the Trippy Cards application.

## Prerequisites

- flow: Authentication

## Steps

1. **Navigate to Home Page**
   - User visits the application home page (`/`)

2. **Create New Activity**
   - User clicks the "New Activity" button

3. **Activity Created and Redirected**
   - System automatically creates a new activity
   - User is redirected to the newly created activity page (`/activities/[activity-id]`)

4. **Activity Ready for Setup**
   - The activity page displays with placeholder text "Click to name this activity"
   - User can now customize the activity name and begin adding content

## Limitations

There's no way to return to an activity unless the user has saved its link.

## Tests

- [Create Activity Flow E2E Test](../../tests/flows/create-activity.spec.ts)