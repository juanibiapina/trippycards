import React, { useState } from 'react';
import type { NoteCard } from './types';

interface NoteCardFormProps {
  onSubmit: (cardData: NoteCard) => void;
  onCancel: () => void;
}

export const NoteCardForm: React.FC<NoteCardFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    onSubmit({
      id: crypto.randomUUID(),
      type: 'note',
      text: text.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="note-text" className="block text-sm font-medium text-gray-700 mb-2">
          Note
        </label>
        <textarea
          id="note-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your note..."
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-y"
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
          disabled={!text.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Create Note
        </button>
      </div>
    </form>
  );
};

export default NoteCardForm;