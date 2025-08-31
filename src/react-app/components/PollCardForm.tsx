import React, { useState, useEffect } from 'react';
import { PollCardInput } from '../../shared';

interface PollCardFormProps {
  onSubmit: (cardData: PollCardInput) => void;
  onCancel: () => void;
}

export const PollCardForm: React.FC<PollCardFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollError, setPollError] = useState('');

  useEffect(() => {
    setPollQuestion('');
    setPollOptions(['', '']);
    setPollError('');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pollQuestion.trim()) {
      setPollError('Poll question is required');
      return;
    }

    const trimmedOptions = pollOptions.map(opt => opt.trim()).filter(Boolean);
    if (trimmedOptions.length < 2) {
      setPollError('At least two options are required');
      return;
    }

    setPollError('');
    const cardData: PollCardInput = {
      type: 'poll',
      question: pollQuestion.trim(),
      options: trimmedOptions,
    };

    onSubmit(cardData);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const addOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const removeOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="poll-question" className="block text-sm font-medium text-gray-700">Poll Question<span className="text-red-500">*</span></label>
        <input
          id="poll-question"
          type="text"
          value={pollQuestion}
          onChange={e => setPollQuestion(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
          required
        />
      </div>
      {pollOptions.map((option, idx) => (
        <div key={idx} className="flex items-center space-x-2">
          <label htmlFor={`option-${idx+1}`} className="block text-sm font-medium text-gray-700">Option {idx+1}<span className="text-red-500">*</span></label>
          <input
            id={`option-${idx+1}`}
            type="text"
            value={option}
            onChange={e => handleOptionChange(idx, e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
            required
          />
          {pollOptions.length > 2 && (
            <button
              type="button"
              aria-label="Remove option"
              onClick={() => removeOption(idx)}
              className="text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addOption} className="text-blue-600 hover:underline text-sm">Add option</button>
      {pollError && <p className="text-red-500 text-xs mt-1">{pollError}</p>}
      <div className="flex justify-end space-x-2 mt-6">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
      </div>
    </form>
  );
};

export default PollCardForm;