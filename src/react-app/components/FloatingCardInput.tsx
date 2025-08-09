import React, { useState, useRef, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';

interface FloatingCardInputProps {
  onCreateCard: (text: string) => void;
  onOpenModal: () => void;
}

export const FloatingCardInput: React.FC<FloatingCardInputProps> = ({ onCreateCard, onOpenModal }) => {
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLongPress, setIsLongPress] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle clicking outside to close input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsInputOpen(false);
        setInputText('');
      }
    };

    if (isInputOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isInputOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isInputOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputOpen]);

  const handleButtonPress = () => {
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPress(true);
      onOpenModal();
    }, 500); // 500ms for long press
  };

  const handleButtonRelease = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    if (!isLongPress) {
      setIsInputOpen(true);
    }
    setIsLongPress(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onCreateCard(inputText.trim());
      setInputText('');
      setIsInputOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsInputOpen(false);
      setInputText('');
    }
  };

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50">
      {isInputOpen ? (
        <div
          ref={inputRef}
          className="bg-white rounded-full shadow-lg p-2 flex items-center w-full max-w-2xl mx-auto transition-all duration-300 ease-out transform origin-center"
        >
          <form onSubmit={handleSubmit} className="flex-1 flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a quick note..."
              className="flex-1 px-4 py-2 border-none outline-none text-gray-800 bg-transparent rounded-l-full"
            />
            <button
              type="submit"
              className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
              disabled={!inputText.trim()}
            >
              <FiPlus size={20} />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            onMouseDown={handleButtonPress}
            onMouseUp={handleButtonRelease}
            onMouseLeave={handleButtonRelease}
            onTouchStart={handleButtonPress}
            onTouchEnd={handleButtonRelease}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 ease-out hover:scale-110 active:scale-95"
            aria-label="Add card"
          >
            <FiPlus size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingCardInput;