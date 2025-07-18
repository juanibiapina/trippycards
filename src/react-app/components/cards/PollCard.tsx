import React from 'react';
import { PollCard as PollCardType } from '../../../shared';

interface PollCardProps {
  card: PollCardType;
  onVote: (cardId: string, option: string) => void;
  currentUserId?: string;
}

export const PollCard: React.FC<PollCardProps> = ({ card, onVote, currentUserId }) => {
  const handleVote = (option: string) => {
    if (currentUserId) {
      onVote(card.id, option);
    }
  };

  const getVoteCount = (option: string) => {
    return Object.values(card.votes || {}).filter(vote => vote === option).length;
  };

  const getTotalVotes = () => {
    return Object.keys(card.votes || {}).length;
  };

  const getUserVote = () => {
    if (!currentUserId || !card.votes) return null;
    return card.votes[currentUserId];
  };

  const getVotePercentage = (option: string) => {
    const totalVotes = getTotalVotes();
    if (totalVotes === 0) return 0;
    return (getVoteCount(option) / totalVotes) * 100;
  };

  const userVote = getUserVote();
  const totalVotes = getTotalVotes();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {card.title}
        </h3>
        <p className="text-sm text-gray-500">
          {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-3">
        {card.options.map((option, index) => {
          const voteCount = getVoteCount(option);
          const percentage = getVotePercentage(option);
          const isUserVote = userVote === option;

          return (
            <div key={index} className="relative">
              <button
                onClick={() => handleVote(option)}
                disabled={!currentUserId}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                  isUserVote
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${
                  !currentUserId ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  <span className="text-sm text-gray-500">
                    {voteCount} ({percentage.toFixed(0)}%)
                  </span>
                </div>

                {totalVotes > 0 && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isUserVote ? 'bg-blue-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {!currentUserId && (
        <p className="text-sm text-gray-500 text-center">
          Sign in to vote
        </p>
      )}
    </div>
  );
};

export default PollCard;