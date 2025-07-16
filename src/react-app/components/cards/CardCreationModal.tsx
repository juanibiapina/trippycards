import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiMinus } from 'react-icons/fi';
import { LinkCard, PollCard, Card } from '../../../shared';
import { validateUrl } from '../../utils/url';

interface CardCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateCard?: (card: Card) => void;
  editingCard?: Card;
}

export const CardCreationModal: React.FC<CardCreationModalProps> = ({
  isOpen,
  onClose,
  onCreateCard,
  onUpdateCard,
  editingCard,
}) => {
  const [cardType, setCardType] = useState<'link' | 'poll'>('link');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  // Poll card states
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [pollQuestionError, setPollQuestionError] = useState('');
  const [pollOptionsError, setPollOptionsError] = useState('');

  const isEditing = !!editingCard;

  // Initialize form with editing card data
  useEffect(() => {
    if (editingCard) {
      setCardType(editingCard.type as 'link' | 'poll');

      if (editingCard.type === 'link') {
        const linkCard = editingCard as LinkCard;
        setUrl(linkCard.url);
        setTitle(linkCard.title || '');
        setDescription(linkCard.description || '');
        setImageUrl(linkCard.imageUrl || '');
      } else if (editingCard.type === 'poll') {
        const pollCard = editingCard as PollCard;
        setPollQuestion(pollCard.question);
        setPollOptions(pollCard.options.length > 0 ? pollCard.options : ['', '']);
      }
    }
  }, [editingCard]);

  const validateAndSetUrl = (value: string) => {
    setUrl(value);
    if (value && !validateUrl(value)) {
      setUrlError('Please enter a valid URL');
    } else {
      setUrlError('');
    }
  };

  const addPollOption = () => {
    if (pollOptions.length < 10) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const validatePollForm = () => {
    let isValid = true;

    if (!pollQuestion.trim()) {
      setPollQuestionError('Question is required');
      isValid = false;
    } else {
      setPollQuestionError('');
    }

    const validOptions = pollOptions.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      setPollOptionsError('At least 2 options are required');
      isValid = false;
    } else {
      setPollOptionsError('');
    }

    return isValid;
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
        } as LinkCard;
        onUpdateCard(updatedCard);
      } else {
        onCreateCard(cardData);
      }
    } else if (cardType === 'poll') {
      if (!validatePollForm()) {
        return;
      }

      const validOptions = pollOptions.filter(opt => opt.trim());
      const cardData = {
        type: 'poll' as const,
        question: pollQuestion.trim(),
        options: validOptions,
        votes: {},
      };

      if (isEditing && editingCard && onUpdateCard) {
        const updatedCard: PollCard = {
          ...editingCard,
          ...cardData,
          updatedAt: new Date().toISOString(),
        } as PollCard;
        onUpdateCard(updatedCard);
      } else {
        onCreateCard(cardData);
      }
    }

    handleClose();
  };

  const handleClose = () => {
    setCardType('link');
    setUrl('');
    setTitle('');
    setDescription('');
    setImageUrl('');
    setUrlError('');
    setPollQuestion('');
    setPollOptions(['', '']);
    setPollQuestionError('');
    setPollOptionsError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? `Edit ${cardType === 'link' ? 'Link' : 'Poll'} Card` : 'Create Card'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Card Type Selection (only for new cards) */}
            {!isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Type *
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCardType('link')}
                    className={`flex-1 p-3 text-center rounded-md border-2 transition-colors ${
                      cardType === 'link'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium">Link Card</div>
                    <div className="text-sm text-gray-600">Share a URL</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardType('poll')}
                    className={`flex-1 p-3 text-center rounded-md border-2 transition-colors ${
                      cardType === 'poll'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium">Poll Card</div>
                    <div className="text-sm text-gray-600">Create a poll</div>
                  </button>
                </div>
              </div>
            )}

            {/* Link Card Form */}
            {cardType === 'link' && (
              <>
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                    URL *
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => validateAndSetUrl(e.target.value)}
                    placeholder="https://example.com"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      urlError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {urlError && (
                    <p className="mt-1 text-sm text-red-600">{urlError}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Card title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the link"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {/* Poll Card Form */}
            {cardType === 'poll' && (
              <>
                <div>
                  <label htmlFor="pollQuestion" className="block text-sm font-medium text-gray-700 mb-1">
                    Question *
                  </label>
                  <input
                    type="text"
                    id="pollQuestion"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="What's your question?"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      pollQuestionError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {pollQuestionError && (
                    <p className="mt-1 text-sm text-red-600">{pollQuestionError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Options *
                  </label>
                  <div className="space-y-2">
                    {pollOptions.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updatePollOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {pollOptions.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removePollOption(index)}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <FiMinus size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {pollOptionsError && (
                    <p className="mt-1 text-sm text-red-600">{pollOptionsError}</p>
                  )}
                  {pollOptions.length < 10 && (
                    <button
                      type="button"
                      onClick={addPollOption}
                      className="mt-2 flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                    >
                      <FiPlus size={16} />
                      <span>Add Option</span>
                    </button>
                  )}
                </div>
              </>
            )}
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
              disabled={
                cardType === 'link'
                  ? (!url.trim() || !!urlError)
                  : (!pollQuestion.trim() || pollOptions.filter(opt => opt.trim()).length < 2)
              }
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isEditing ? 'Update Card' : 'Create Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardCreationModal;
