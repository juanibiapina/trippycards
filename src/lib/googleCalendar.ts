import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface CalendarEvent {
  activityName: string;
  date: string;
  activityUrl: string;
}

export interface CreateCalendarEventResult {
  success: boolean;
  eventId?: string;
  eventUrl?: string;
  error?: string;
}

/**
 * Creates a Google Calendar event using OAuth2 authentication
 */
export async function createGoogleCalendarEvent(
  accessToken: string,
  event: CalendarEvent
): Promise<CreateCalendarEventResult> {
  try {
    // Create OAuth2 client with the access token
    const oauth2Client = new OAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });

    // Create Google Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Parse the date and create start/end times
    const eventDate = new Date(event.date);
    const startTime = new Date(eventDate);
    startTime.setHours(9, 0, 0, 0); // Default to 9 AM

    const endTime = new Date(eventDate);
    endTime.setHours(10, 0, 0, 0); // Default to 10 AM (1 hour event)

    // Create the calendar event
    const calendarEvent = {
      summary: event.activityName,
      description: `Activity details: ${event.activityUrl}`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'UTC',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: calendarEvent,
    });

    return {
      success: true,
      eventId: response.data.id || undefined,
      eventUrl: response.data.htmlLink || undefined,
    };
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get the required OAuth2 scopes for Google Calendar
 */
export function getRequiredScopes(): string[] {
  return ['https://www.googleapis.com/auth/calendar.events'];
}