import { describe, it, expect, vi } from 'vitest';
import { createGoogleCalendarEvent, getRequiredScopes } from '../lib/googleCalendar';

// Mock the googleapis library
vi.mock('googleapis', () => ({
  google: {
    calendar: vi.fn(() => ({
      events: {
        insert: vi.fn()
      }
    }))
  }
}));

vi.mock('google-auth-library', () => ({
  OAuth2Client: vi.fn(() => ({
    setCredentials: vi.fn()
  }))
}));

describe('Google Calendar Helper', () => {
  describe('getRequiredScopes', () => {
    it('returns the correct scopes for calendar events', () => {
      const scopes = getRequiredScopes();
      expect(scopes).toEqual(['https://www.googleapis.com/auth/calendar.events']);
    });
  });

  describe('createGoogleCalendarEvent', () => {
    it('creates a calendar event successfully', async () => {
      // Mock googleapis
      const mockInsert = vi.fn().mockResolvedValue({
        data: {
          id: 'test-event-id',
          htmlLink: 'https://calendar.google.com/calendar/event?eid=test-event-id'
        }
      });

      const { google } = await import('googleapis');
      const mockCalendar = google.calendar as vi.MockedFunction<typeof google.calendar>;
      mockCalendar.mockReturnValue({
        events: {
          insert: mockInsert
        }
      } as unknown as ReturnType<typeof google.calendar>);

      const result = await createGoogleCalendarEvent('mock-access-token', {
        activityName: 'Test Activity',
        date: '2024-01-01',
        activityUrl: 'https://example.com/activity'
      });

      expect(result).toEqual({
        success: true,
        eventId: 'test-event-id',
        eventUrl: 'https://calendar.google.com/calendar/event?eid=test-event-id'
      });

      expect(mockInsert).toHaveBeenCalledWith({
        calendarId: 'primary',
        requestBody: {
          summary: 'Test Activity',
          description: 'Activity details: https://example.com/activity',
          start: {
            dateTime: '2024-01-01T09:00:00.000Z',
            timeZone: 'UTC'
          },
          end: {
            dateTime: '2024-01-01T10:00:00.000Z',
            timeZone: 'UTC'
          }
        }
      });
    });

    it('handles errors gracefully', async () => {
      const mockInsert = vi.fn().mockRejectedValue(new Error('API Error'));

      const { google } = await import('googleapis');
      const mockCalendar = google.calendar as vi.MockedFunction<typeof google.calendar>;
      mockCalendar.mockReturnValue({
        events: {
          insert: mockInsert
        }
      } as unknown as ReturnType<typeof google.calendar>);

      const result = await createGoogleCalendarEvent('mock-access-token', {
        activityName: 'Test Activity',
        date: '2024-01-01',
        activityUrl: 'https://example.com/activity'
      });

      expect(result).toEqual({
        success: false,
        error: 'API Error'
      });
    });
  });
});