import { useRef } from "react";

interface DateSelectorProps {
  startDate?: string;
  endDate?: string;
  onDateChange: (startDate: string, endDate?: string) => void;
  disabled?: boolean;
}

const DateSelector = ({ startDate, endDate, onDateChange, disabled }: DateSelectorProps) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

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

  const formatDateRange = () => {
    if (!startDate) return '';
    if (!endDate) return formatDateToLocale(startDate);
    return `${formatDateToLocale(startDate)} – ${formatDateToLocale(endDate)}`;
  };

  const handleDateChange = (value: string) => {
    onDateChange(value, endDate);
  };

  const handleButtonClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

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
      <button
        onClick={handleButtonClick}
        className="group flex items-center gap-2 text-gray-300 hover:text-blue-200 transition-colors disabled:text-gray-400"
        disabled={disabled}
        aria-label="Select activity date"
      >
        <svg
          className="w-5 h-5 group-hover:text-blue-200"
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
        <span className="text-sm group-hover:text-blue-200">
          {formatDateRange() || 'Select activity date'}
        </span>
      </button>
    </div>
  );
};

export default DateSelector;
