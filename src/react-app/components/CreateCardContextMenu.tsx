import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiPlus } from 'react-icons/fi';

interface CreateCardContextMenuProps {
  onCreateCard: () => void;
}

export const CreateCardContextMenu: React.FC<CreateCardContextMenuProps> = ({ onCreateCard }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCreateCard = () => {
    onCreateCard();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Create Card"
      >
        <FiMoreVertical size={16} className="text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[120px]">
          <button
            onClick={handleCreateCard}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FiPlus size={14} />
            <span>Create Card</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateCardContextMenu;