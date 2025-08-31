import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { LinkCard, LinkCardInput, PollCardInput } from '../../shared';
import { validateUrl } from '../utils/url';

interface CardCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCard: (
    card: LinkCardInput | PollCardInput
  ) => void;
  onUpdateCard?: (card: LinkCard) => void;
  editingCard?: LinkCard;
  cardType: 'link' | 'poll';
}

export const CardCreationModal: React.FC<CardCreationModalProps> = ({
  isOpen,
  onClose,
  onCreateCard,
  onUpdateCard,
  editingCard,
  cardType,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollError, setPollError] = useState('');

  const isEditing = !!editingCard;

  // Initialize form with editing card data
  useEffect(() => {
    if (editingCard) {
      setUrl(editingCard.url);
      setTitle(editingCard.title || '');
      setDescription(editingCard.description || '');
      setImageUrl(editingCard.imageUrl || '');
    }
    setPollQuestion('');
    setPollOptions(['', '']);
    setPollError('');
  }, [editingCard, isOpen]);

  const validateAndSetUrl = (value: string) => {
    setUrl(value);
    if (value && !validateUrl(value)) {
      setUrlError('Please enter a valid URL');
    } else {
      setUrlError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cardType === 'link') {
      if (!url.trim()) {
        setUrlError('URL is required');
        return;
      }

      if (!validateUrl(url)) {
        setUrlError('Please enter a valid URL');
        return;
      }

      const cardData = {
        type: 'link' as const,
        url: url.trim(),
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
      };

      if (isEditing && editingCard && onUpdateCard) {
        const updatedCard: LinkCard = {
          ...editingCard,
          ...cardData,
          updatedAt: new Date().toISOString(),
        };
        onUpdateCard(updatedCard);
      } else {
        onCreateCard(cardData);
      }
    } else if (cardType === 'poll') {
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
      onCreateCard({
        type: 'poll',
        question: pollQuestion.trim(),
        options: trimmedOptions,
      });
    }

    handleClose();
  };

  const handleClose = () => {
    setUrl('');
    setTitle('');
    setDescription('');
    setImageUrl('');
    setUrlError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Link Card' : `Create ${cardType === 'link' ? 'Link' : 'Poll'} Card`}
          </h2>
          <button onClick={handleClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6">
          {cardType === 'link' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">URL<span className="text-red-500">*</span></label>
                <input
                  id="url"
                  type="text"
                  value={url}
                  onChange={e => validateAndSetUrl(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                  required
                />
                {urlError && <p className="text-red-500 text-xs mt-1">{urlError}</p>}
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  id="imageUrl"
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{isEditing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          )}
          {cardType === 'poll' && (
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
                    onChange={e => {
                      const newOptions = [...pollOptions];
                      newOptions[idx] = e.target.value;
                      setPollOptions(newOptions);
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                    required
                  />
                  {pollOptions.length > 2 && (
                    <button type="button" aria-label="Remove option" onClick={() => {
                      setPollOptions(pollOptions.filter((_, i) => i !== idx));
                    }} className="text-red-500 hover:text-red-700">&times;</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setPollOptions([...pollOptions, ''])} className="text-blue-600 hover:underline text-sm">Add option</button>
              {pollError && <p className="text-red-500 text-xs mt-1">{pollError}</p>}
              <div className="flex justify-end space-x-2 mt-6">
                <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardCreationModal;
