import { useState, useEffect } from "react";

interface DateSelectorProps {
  startDate?: string;
  endDate?: string;
  onDateChange: (startDate: string, endDate?: string) => void;
  disabled?: boolean;
}

const DateSelector = ({ startDate, endDate, onDateChange, disabled }: DateSelectorProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate || '');
  const [tempEndDate, setTempEndDate] = useState(endDate || '');
  const [error, setError] = useState('');

  useEffect(() => {
    setTempStartDate(startDate || '');
    setTempEndDate(endDate || '');
  }, [startDate, endDate]);

  const formatDateRange = () => {
    if (!startDate) return '';
    if (!endDate) return startDate;
    return `${startDate} – ${endDate}`;
  };

  const handleDateSubmit = () => {
    setError('');

    if (!tempStartDate) {
      setError('Please select an activity date.');
      return;
    }

    if (tempEndDate && tempEndDate < tempStartDate) {
      setError('End date cannot be before the activity date.');
      return;
    }

    onDateChange(tempStartDate, tempEndDate || undefined);
    setShowPicker(false);
  };

  const handleStartDateChange = (value: string) => {
    setTempStartDate(value);
  };

  const handleEndDateChange = (value: string) => {
    setTempEndDate(value);
  };

  const handleCancel = () => {
    setTempStartDate(startDate || '');
    setTempEndDate(endDate || '');
    setError('');
    setShowPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDateSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (showPicker) {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                Activity Date *
              </label>
              <input
                type="date"
                id="start-date"
                value={tempStartDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                onInput={(e) => handleStartDateChange((e.target as HTMLInputElement).value)}
                onBlur={(e) => handleStartDateChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                disabled={disabled}
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                End Date (Optional)
              </label>
              <input
                type="date"
                id="end-date"
                value={tempEndDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                onInput={(e) => handleEndDateChange((e.target as HTMLInputElement).value)}
                onBlur={(e) => handleEndDateChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                disabled={disabled}
              />
            </div>
          </div>
          {error && (
            <div className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              disabled={disabled}
            >
              Cancel
            </button>
            <button
              onClick={handleDateSubmit}
              className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-800 text-white rounded-md transition-colors disabled:bg-gray-400"
              disabled={disabled}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowPicker(true)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors disabled:text-gray-400"
        disabled={disabled}
        aria-label="Select activity date"
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
        <span className="text-sm">
          {formatDateRange() || 'Select activity date'}
        </span>
      </button>
      {!startDate && (
        <div className="text-sm text-red-600" role="alert">
          Please select an activity date.
        </div>
      )}
    </div>
  );
};

export default DateSelector;