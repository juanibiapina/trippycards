import React from 'react';
import { Card } from '../../shared';

interface TimelineIndicatorProps {
  cards: Card[];
}

export const TimelineIndicator: React.FC<TimelineIndicatorProps> = ({ cards }) => {
  // Check if any cards have dates
  const hasCardsWithDates = cards.some(card => card.date);

  if (!hasCardsWithDates) {
    return null;
  }

  // Get unique dates and sort them
  const uniqueDates = Array.from(new Set(
    cards
      .filter(card => card.date)
      .map(card => card.date!)
  )).sort();

  const today = new Date().toISOString().split('T')[0];
  const todayIndex = uniqueDates.indexOf(today);

  return (
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200">
      {/* Timeline line */}
      <div className="relative h-full">
        {uniqueDates.map((date, index) => {
          const isToday = date === today;
          const cardsForDate = cards.filter(card => card.date === date);

          return (
            <div
              key={date}
              className="absolute left-0"
              style={{
                top: `${(index / uniqueDates.length) * 100}%`,
              }}
            >
              {/* Date marker */}
              <div
                className={`w-3 h-3 rounded-full -ml-1 ${
                  isToday
                    ? 'bg-blue-600 ring-2 ring-blue-200'
                    : 'bg-gray-400'
                }`}
              />

              {/* Date label */}
              <div className="absolute left-4 top-0 text-xs text-gray-600 whitespace-nowrap">
                {isToday ? 'Today' : new Date(date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
                {cardsForDate.length > 1 && (
                  <span className="ml-1 text-gray-400">({cardsForDate.length})</span>
                )}
              </div>
            </div>
          );
        })}

        {/* Today indicator line if today has no cards */}
        {todayIndex === -1 && (
          <div
            className="absolute left-0 w-6 h-0.5 bg-blue-600 -ml-2"
            style={{
              top: '50%',
            }}
          >
            <div className="absolute left-6 top-0 text-xs text-blue-600 whitespace-nowrap -mt-2">
              Today
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineIndicator;