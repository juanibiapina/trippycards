import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { PollCard } from '../../../shared';

interface PollCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCard: (card: Omit<PollCard, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateCard?: (card: PollCard) => void;
  editingCard?: PollCard;
}

export const PollCreationModal: React.FC<PollCreationModalProps> = ({
  isOpen,
  onClose,
  onCreateCard,
  onUpdateCard,
  editingCard,
}) => {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [titleError, setTitleError] = useState('');
  const [optionsError, setOptionsError] = useState('');

  const isEditing = !!editingCard;

  // Initialize form with editing card data
  useEffect(() => {
    if (editingCard) {
      setTitle(editingCard.title);
      setOptions(editingCard.options.length > 0 ? editingCard.options : ['', '']);
    }
  }, [editingCard]);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const validateForm = () => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    } else {
      setTitleError('');
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      setOptionsError('At least 2 options are required');
      isValid = false;
    } else {
      setOptionsError('');
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    const cardData = {
      type: 'poll' as const,
      title: title.trim(),
      options: validOptions,
      votes: {},
    };

    if (isEditing && editingCard && onUpdateCard) {
      const updatedCard: PollCard = {
        ...editingCard,
        ...cardData,
        updatedAt: new Date().toISOString(),
      };
      onUpdateCard(updatedCard);
    } else {
      onCreateCard(cardData);
    }

    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setOptions(['', '']);
    setTitleError('');
    setOptionsError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Poll Card' : 'Create Poll Card'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Poll Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your question?"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  titleError ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {titleError && (
                <p className="mt-1 text-sm text-red-600">{titleError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options *
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label="Remove option"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {optionsError && (
                <p className="mt-1 text-sm text-red-600">{optionsError}</p>
              )}
              <button
                type="button"
                onClick={addOption}
                className="mt-2 flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <FiPlus size={16} />
                <span>Add Option</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              {isEditing ? 'Update Poll' : 'Create Poll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PollCreationModal;