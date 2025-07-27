# Ticket: Add Weekday to Event Date Display

## Metadata
- **Start Date**: 2025-07-28
- **End Date**: 2025-07-28
- **Status**: Completed
- **Commit**: b2b47e3

## Current State

The event start and end dates are currently displayed using the `formatDateToLocale` function in `src/react-app/utils/dates.ts`, which formats dates as:
- Format: "Jul 15, 2025" (month short, day numeric, year numeric)
- Uses browser's locale via `navigator.language`

The display appears in the `DateSelector` component (`src/react-app/components/DateSelector.tsx`) at lines 187-233, showing:
- Start date: clickable button with formatted date
- Optional start time: "at HH:MM" format  
- Optional end date: "– Jul 16, 2025" format

## Desired Change

Modify the date display to include the weekday, so dates appear as:
- Current: "Jul 15, 2025"
- New: "Mon, Jul 15, 2025"

## Implementation Plan

### 1. Update Date Formatting Function

Modify `formatDateToLocale` in `src/react-app/utils/dates.ts`:

```typescript
export const formatDateToLocale = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(navigator.language, {
      weekday: 'short',  // Add this line
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
};
```

### 4. Testing Areas

- Update any tests that depends on dates
- No new tests required

## Completion Notes

Implementation completed as planned. The `formatDateToLocale` function was updated to include weekday formatting, and all date displays now show the format "Mon, Jul 15, 2025" instead of just "Jul 15, 2025". 