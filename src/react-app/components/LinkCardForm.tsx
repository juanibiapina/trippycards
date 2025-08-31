import React, { useState, useEffect } from 'react';
import { LinkCard, LinkCardInput } from '../../shared';
import { validateUrl } from '../utils/url';

interface LinkCardFormProps {
  onSubmit: (cardData: LinkCardInput) => void;
  onCancel: () => void;
  editingCard?: LinkCard;
}

export const LinkCardForm: React.FC<LinkCardFormProps> = ({
  onSubmit,
  onCancel,
  editingCard,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const isEditing = !!editingCard;

  useEffect(() => {
    if (editingCard) {
      setUrl(editingCard.url);
      setTitle(editingCard.title || '');
      setDescription(editingCard.description || '');
      setImageUrl(editingCard.imageUrl || '');
    } else {
      setUrl('');
      setTitle('');
      setDescription('');
      setImageUrl('');
    }
    setUrlError('');
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

    const cardData: LinkCardInput = {
      type: 'link',
      url: url.trim(),
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
    };

    onSubmit(cardData);
  };

  return (
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
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{isEditing ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
};

export default LinkCardForm;