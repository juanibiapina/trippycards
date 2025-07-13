import { useRef, useState, useEffect } from "react";

interface DateSelectorProps {
  startDate?: string;
  endDate?: string;
  onDateChange: (startDate: string, endDate?: string) => void;
  disabled?: boolean;
}

const DateSelector = ({ startDate, endDate, onDateChange, disabled }: DateSelectorProps) => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const formatDateToLocale = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(navigator.language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch {
      // Fallback to original string if parsing fails
      return dateString;
    }
  };


  const handleDateChange = (value: string) => {
    onDateChange(value, endDate);
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

  const handleEndDateChange = (value: string) => {
    // Validate that end date is not before start date
    if (value && startDate && new Date(value) < new Date(startDate)) {
      return; // Don't update if end date is before start date
    }
    onDateChange(startDate || '', value);
  };

  const handleEndDatePicker = () => {
    if (endDateInputRef.current) {
      endDateInputRef.current.showPicker();
    }
    setShowDropdown(false);
  };

  const handleRemoveEndDate = () => {
    onDateChange(startDate || '', '');
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
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

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

        {!startDate && !endDate ? (
          <button
            onClick={handleStartDateClick}
            className="text-sm hover:text-blue-200 transition-colors disabled:text-gray-400"
            disabled={disabled}
            aria-label="Select activity date"
          >
            Select activity date
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

    </div>
  );
};

export default DateSelector;
