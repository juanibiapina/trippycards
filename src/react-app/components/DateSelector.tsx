import { useRef, useState, useEffect } from "react";
import { formatDateToLocale, formatTimeToLocale, validateEndDate } from "../utils/dates";

interface DateSelectorProps {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  onDateChange: (startDate: string, endDate?: string, startTime?: string) => void;
  disabled?: boolean;
}

const DateSelector = ({ startDate, endDate, startTime, onDateChange, disabled }: DateSelectorProps) => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState('');

  const handleDateChange = (value: string) => {
    onDateChange(value, endDate, startTime);
  };

  const handleTimeChange = (value: string) => {
    onDateChange(startDate || '', endDate, value);
  };

  const handleStartDateClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
    setShowDropdown(false);
  };

  const handleEndDateClick = () => {
    if (endDateInputRef.current) {
      endDateInputRef.current.showPicker();
    }
    setShowDropdown(false);
  };

  const handleStartTimeClick = () => {
    setTempTime(startTime || '');
    setShowDropdown(false);
    setShowTimePicker(true);
  };

  const handleRemoveStartTime = () => {
    onDateChange(startDate || '', endDate, '');
    setShowDropdown(false);
  };

  const handleEndDateChange = (value: string) => {
    // Validate that end date is not before start date
    if (!validateEndDate(value, startDate)) {
      return; // Don't update if end date is before start date
    }
    onDateChange(startDate || '', value, startTime);
  };

  const handleEndDatePicker = () => {
    if (endDateInputRef.current) {
      endDateInputRef.current.showPicker();
    }
    setShowDropdown(false);
  };

  const handleRemoveEndDate = () => {
    onDateChange(startDate || '', '', startTime);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
    };

    if (showDropdown || showTimePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showTimePicker]);

  return (
    <div className="relative flex items-center gap-2">
      <input
        ref={dateInputRef}
        type="date"
        value={startDate || ''}
        onChange={(e) => handleDateChange(e.target.value)}
        disabled={disabled}
        className="absolute opacity-0 pointer-events-none"
      />
      <input
        ref={endDateInputRef}
        type="date"
        value={endDate || ''}
        onChange={(e) => handleEndDateChange(e.target.value)}
        disabled={disabled}
        className="absolute opacity-0 pointer-events-none"
        min={startDate || ''}
      />
      <div className="group flex items-center gap-2 text-gray-300">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center justify-center w-5 h-5 hover:text-blue-200 transition-colors disabled:text-gray-400"
            disabled={disabled}
            aria-label="Date options"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute left-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-32">
              <div className="py-1">
                <button
                  onClick={handleStartDateClick}
                  className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  {startDate ? 'Change start date' : 'Set start date'}
                </button>
                {!startTime ? (
                  <button
                    onClick={handleStartTimeClick}
                    className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Set start time
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleStartTimeClick}
                      className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Change start time
                    </button>
                    <button
                      onClick={handleRemoveStartTime}
                      className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Remove start time
                    </button>
                  </>
                )}
                {!endDate ? (
                  <button
                    onClick={handleEndDatePicker}
                    className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Set end date
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleEndDateClick}
                      className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Change end date
                    </button>
                    <button
                      onClick={handleRemoveEndDate}
                      className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Remove end date
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {!startDate && !endDate && !startTime ? (
          <button
            onClick={handleStartDateClick}
            className="text-sm hover:text-blue-200 transition-colors disabled:text-gray-400"
            disabled={disabled}
            aria-label="Select date"
          >
            Select date
          </button>
        ) : (
          <div className="flex items-center gap-1 text-sm">
            <button
              onClick={handleStartDateClick}
              className="hover:text-blue-200 transition-colors disabled:text-gray-400"
              disabled={disabled}
              aria-label="Change start date"
            >
              {formatDateToLocale(startDate || '')}
            </button>
            {startTime && (
              <>
                <span className="text-gray-400">at</span>
                <button
                  onClick={handleStartTimeClick}
                  className="hover:text-blue-200 transition-colors disabled:text-gray-400"
                  disabled={disabled}
                  aria-label="Change start time"
                >
                  {formatTimeToLocale(startTime)}
                </button>
              </>
            )}
            {endDate && (
              <>
                <span className="text-gray-400">–</span>
                <button
                  onClick={handleEndDateClick}
                  className="hover:text-blue-200 transition-colors disabled:text-gray-400"
                  disabled={disabled}
                  aria-label="Change end date"
                >
                  {formatDateToLocale(endDate)}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Time Picker Popup */}
      {showTimePicker && (
        <div className="absolute left-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-48">
          <div
            ref={timePickerRef}
            className="p-4"
          >
            <h3 className="text-sm font-medium text-gray-700 mb-3">Set Start Time</h3>
            <div className="mb-4">
              <input
                ref={timeInputRef}
                type="time"
                value={tempTime}
                onChange={(e) => setTempTime(e.target.value)}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                autoFocus
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowTimePicker(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                disabled={disabled}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleTimeChange(tempTime);
                  setShowTimePicker(false);
                }}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                disabled={disabled}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DateSelector;
