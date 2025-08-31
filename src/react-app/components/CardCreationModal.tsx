import React from 'react';
import { FiX } from 'react-icons/fi';
import { Card } from '../../shared';
import { getCardDefinition, getCardDisplayName } from './cards/registry';

interface CardCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCard: (card: Card) => void;
  cardType: string;
}

export const CardCreationModal: React.FC<CardCreationModalProps> = ({
  isOpen,
  onClose,
  onCreateCard,
  cardType,
}) => {
  const handleCardSubmit = (cardData: Card) => {
    onCreateCard(cardData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Create {getCardDisplayName(cardType)} Card
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

              return (
                <FormComponent
                  onSubmit={handleCardSubmit}
                  onCancel={onClose}
                />
              );
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
