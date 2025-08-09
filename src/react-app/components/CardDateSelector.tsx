import React from 'react';

interface CardDateSelectorProps {
  cardDate?: string;
  onDateChange: (date?: string) => void;
  disabled?: boolean;
}

export const CardDateSelector: React.FC<CardDateSelectorProps> = ({
  cardDate,
  onDateChange,
  disabled = false,
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onDateChange(value || undefined);
  };

  const clearDate = () => {
    onDateChange(undefined);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Card Date
      </label>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={cardDate || ''}
          onChange={handleDateChange}
          disabled={disabled}
          className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />
        {cardDate && (
          <button
            type="button"
            onClick={clearDate}
            disabled={disabled}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default CardDateSelector;