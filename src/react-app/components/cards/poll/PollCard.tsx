import React, { useMemo } from 'react';
import { PollCard as PollCardType } from '../../../../shared';
import { useUsers } from '../../../hooks/useUsers';
import UserAvatar from '../../UserAvatar';

interface PollCardProps {
  card: PollCardType;
  userId: string;
  onVote: (optionIdx: number) => void;
}

const PollCard: React.FC<PollCardProps> = ({ card, userId, onVote }) => {
  // Find the user's selected option
  const selectedIdx = useMemo(() => {
    return card.votes?.find(v => v.userId === userId)?.option ?? null;
  }, [card.votes, userId]);

  // Count votes for each option
  const voteCounts = useMemo(() => {
    const counts = Array(card.options.length).fill(0);
    card.votes?.forEach(v => {
      if (typeof v.option === 'number' && v.option >= 0 && v.option < counts.length) {
        counts[v.option]++;
      }
    });
    return counts;
  }, [card.votes, card.options.length]);

  // Collect all unique voter IDs
  const allVoterIds = useMemo(() => {
    if (!card.votes) return [];
    const set = new Set<string>();
    card.votes.forEach(v => set.add(v.userId));
    return Array.from(set);
  }, [card.votes]);

  // Fetch user data for all voter IDs
  const { users: userMap, loading: usersLoading } = useUsers(allVoterIds);

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
        {card.question}
      </h3>
      <ul className="space-y-2">
        {card.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          // Find userIds who voted for this option
          const voters = card.votes?.filter(v => v.option === idx).map(v => v.userId) || [];
          return (
            <li
              key={idx}
              className={
                `flex flex-col gap-1 items-start justify-between px-4 py-3 rounded-lg border transition-colors duration-150 cursor-pointer select-none ` +
                (isSelected
                  ? 'bg-gray-700 text-white border-gray-700 shadow-md font-semibold'
                  : 'bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200 hover:border-gray-400 focus:bg-gray-200 focus:border-gray-400')
              }
              onClick={() => onVote(idx)}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { onVote(idx); } }}
              aria-pressed={isSelected}
              aria-label={`Vote for option: ${option}`}
              data-testid={`poll-option-${idx}`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="truncate text-base md:text-lg">{option}</span>
                <span className={
                  `ml-4 px-2 py-1 rounded text-xs font-medium ` +
                  (isSelected
                    ? 'bg-white text-gray-900'
                    : 'bg-gray-200 text-gray-700')
                }>
                  {voteCounts[idx]} vote{voteCounts[idx] === 1 ? '' : 's'}
                </span>
              </div>
              {/* Avatars for voters of this option */}
              <div className="flex flex-row flex-wrap gap-1 mt-1">
                {usersLoading && voters.length > 0 ? (
                  <span className="text-xs text-gray-400">Loading...</span>
                ) : (
                  voters.map(uid => {
                    const user = userMap[uid];
                    return user ? (
                      <UserAvatar key={uid} user={user} size={24} />
                    ) : null;
                  })
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default PollCard;