import React, { useState, useRef, useEffect } from 'react';
import { FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

interface CardContextMenuProps {
  onDelete: () => void;
}

export const CardContextMenu: React.FC<CardContextMenuProps> = ({ onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

  const handleDelete = () => {
    setShowDeleteDialog(true);
    setIsOpen(false);
  };

  const handleDeleteConfirm = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Card options"
        data-testid="card-context-menu"
      >
        <FiMoreHorizontal size={16} className="text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-8 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[120px]">
          <button
            onClick={handleDelete}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            role="menuitem"
          >
            <FiTrash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      )}

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default CardContextMenu;