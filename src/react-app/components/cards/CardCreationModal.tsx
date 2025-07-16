import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { LinkCard } from '../../../shared';
import { validateUrl } from '../../utils/url';

interface CardCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCard: (card: Omit<LinkCard, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateCard?: (card: LinkCard) => void;
  editingCard?: LinkCard;
}

export const CardCreationModal: React.FC<CardCreationModalProps> = ({
  isOpen,
  onClose,
  onCreateCard,
  onUpdateCard,
  editingCard,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const isEditing = !!editingCard;

  // Initialize form with editing card data
  useEffect(() => {
    if (editingCard) {
      setUrl(editingCard.url);
      setTitle(editingCard.title || '');
      setDescription(editingCard.description || '');
      setImageUrl(editingCard.imageUrl || '');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Link Card' : 'Create Link Card'}
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
              disabled={!url.trim() || !!urlError}
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
