import React from 'react';
import { FiX } from 'react-icons/fi';
import { LinkCard, LinkCardInput, PollCardInput } from '../../shared';
import LinkCardForm from './LinkCardForm';
import PollCardForm from './PollCardForm';

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
  const isEditing = !!editingCard;

  const handleLinkCardSubmit = (cardData: LinkCardInput) => {
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
    onClose();
  };

  const handlePollCardSubmit = (cardData: PollCardInput) => {
    onCreateCard(cardData);
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
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6">
          {cardType === 'link' && (
            <LinkCardForm
              onSubmit={handleLinkCardSubmit}
              onCancel={onClose}
              editingCard={editingCard}
            />
          )}
          {cardType === 'poll' && (
            <PollCardForm
              onSubmit={handlePollCardSubmit}
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CardCreationModal;
