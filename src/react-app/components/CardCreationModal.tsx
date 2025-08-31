import React from 'react';
import { FiX } from 'react-icons/fi';
import { LinkCard, LinkCardInput, PollCardInput } from '../../shared';
import { getCardDefinition, getCardDisplayName } from './cards/registry';

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
            {isEditing ? 'Edit Link Card' : `Create ${getCardDisplayName(cardType)} Card`}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6">
          {(() => {
            const cardDefinition = getCardDefinition(cardType);
            if (cardDefinition) {
              const { FormComponent } = cardDefinition;

              if (cardType === 'link') {
                return (
                  <FormComponent
                    onSubmit={handleLinkCardSubmit}
                    onCancel={onClose}
                    editingCard={editingCard}
                  />
                );
              } else if (cardType === 'poll') {
                return (
                  <FormComponent
                    onSubmit={handlePollCardSubmit}
                    onCancel={onClose}
                  />
                );
              }
            }

            return (
              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-gray-600">Unknown card type: {cardType}</p>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default CardCreationModal;
