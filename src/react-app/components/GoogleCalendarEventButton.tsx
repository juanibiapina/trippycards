import React, { useState } from 'react';
import { useSession } from '@hono/auth-js/react';

interface GoogleCalendarEventButtonProps {
  activityName?: string;
  defaultDate?: string;
  className?: string;
}

const GoogleCalendarEventButton: React.FC<GoogleCalendarEventButtonProps> = ({
  activityName = '',
  defaultDate = '',
  className = ''
}) => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventName, setEventName] = useState(activityName);
  const [eventDate, setEventDate] = useState(defaultDate);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateEvent = async () => {
    if (!eventName.trim() || !eventDate) {
      setError('Please provide both activity name and date');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Get the access token from the session
      if (!session) {
        setError('Please sign in to create calendar events');
        return;
      }

      const accessToken = (session as { access_token?: string }).access_token;

      if (!accessToken) {
        setError('Please sign out and sign in again to grant calendar permissions');
        return;
      }

      // Create the calendar event
      const response = await fetch('/api/createGoogleCalendarEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityName: eventName,
          date: eventDate,
          activityUrl: window.location.href,
          accessToken: accessToken,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess('Calendar event created successfully!');
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess('');
        }, 2000);
      } else {
        setError(result.error || 'Failed to create calendar event');
      }
    } catch (err) {
      console.error('Error creating calendar event:', err);
      setError('An error occurred while creating the event');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setError('');
    setSuccess('');
    setEventName(activityName);
    setEventDate(defaultDate);
  };

  if (!session) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-sm hover:shadow-md ${className}`}
      >
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17 3h-2V1a1 1 0 0 0-2 0v2H7V1a1 1 0 0 0-2 0v2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V7h14v10z"/>
        </svg>
        Add to Calendar
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add to Google Calendar</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Name
                </label>
                <input
                  type="text"
                  id="eventName"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Enter activity name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="eventDate"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
                  {success}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-md transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleCalendarEventButton;