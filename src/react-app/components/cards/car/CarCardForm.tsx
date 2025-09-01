import React, { useState } from 'react';
import type { CarCard } from './types';

interface CarCardFormProps {
  onSubmit: (cardData: CarCard) => void;
  onCancel: () => void;
}

export const CarCardForm: React.FC<CarCardFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [seats, setSeats] = useState(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || seats < 1) {
      return;
    }

    onSubmit({
      id: crypto.randomUUID(),
      type: 'car',
      title: title.trim(),
      seats,
      occupants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="car-title" className="block text-sm font-medium text-gray-700 mb-2">
          Car Title
        </label>
        <input
          id="car-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter car title..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="car-seats" className="block text-sm font-medium text-gray-700 mb-2">
          Number of Seats
        </label>
        <input
          id="car-seats"
          type="number"
          value={seats}
          onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
          min="1"
          max="20"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim() || seats < 1}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Create Car
        </button>
      </div>
    </form>
  );
};

export default CarCardForm;