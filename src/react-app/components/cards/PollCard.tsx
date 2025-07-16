import React from 'react';
import { PollCard as PollCardType } from '../../../shared';

interface PollCardProps {
  card: PollCardType;
  onVote?: (cardId: string, optionIndex: number, userId: string, userName: string) => void;
  currentUserId?: string;
  currentUserName?: string;
}

export const PollCard: React.FC<PollCardProps> = ({
  card,
  onVote,
  currentUserId,
  currentUserName
}) => {
  const handleVote = (optionIndex: number) => {
    if (onVote && currentUserId && currentUserName) {
      onVote(card.id, optionIndex, currentUserId, currentUserName);
    }
  };

  const getUserVoteIndex = () => {
    if (!currentUserId) return -1;

    for (let i = 0; i < card.options.length; i++) {
      const optionVotes = card.votes[i.toString()] || {};
      if (optionVotes[currentUserId]) {
        return i;
      }
    }
    return -1;
  };

  const getVoteCount = (optionIndex: number) => {
    const optionVotes = card.votes[optionIndex.toString()] || {};
    return Object.keys(optionVotes).length;
  };

  const getTotalVotes = () => {
    return Object.values(card.votes).reduce((total, optionVotes) => {
      return total + Object.keys(optionVotes).length;
    }, 0);
  };

  const getVotePercentage = (optionIndex: number) => {
    const totalVotes = getTotalVotes();
    if (totalVotes === 0) return 0;
    return (getVoteCount(optionIndex) / totalVotes) * 100;
  };

  const userVoteIndex = getUserVoteIndex();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {card.question}
        </h3>
        <p className="text-sm text-gray-500">
          {getTotalVotes()} vote{getTotalVotes() !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-3">
        {card.options.map((option, index) => {
          const voteCount = getVoteCount(index);
          const percentage = getVotePercentage(index);
          const isSelected = userVoteIndex === index;

          return (
            <div key={index} className="relative">
              <button
                onClick={() => handleVote(index)}
                disabled={!onVote || !currentUserId}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 relative overflow-hidden ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                } ${!onVote || !currentUserId ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                {/* Vote percentage background */}
                <div
                  className={`absolute inset-0 transition-all duration-300 ${
                    isSelected ? 'bg-blue-100' : 'bg-gray-100'
                  }`}
                  style={{ width: `${percentage}%` }}
                />

                <div className="relative flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  <div className="flex items-center space-x-2">
                    {isSelected && (
                      <span className="text-blue-600 text-sm font-semibold">
                        ✓ Your vote
                      </span>
                    )}
                    <span className="text-sm text-gray-600">
                      {voteCount} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Poll Card • Created {new Date(card.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default PollCard;