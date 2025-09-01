import React, { useMemo } from 'react';
import type { CarCard as CarCardType } from './types';
import { BaseCardProps } from '../types';
import { useUsers } from '../../../hooks/useUsers';
import UserAvatar from '../../UserAvatar';
import { carCardDefinition } from './index';

const CarCard: React.FC<BaseCardProps<CarCardType>> = ({ card, userId, onUpdateCard }) => {
  const actions = carCardDefinition.createActions(card, onUpdateCard);

  const handleSeatClick = (seatIndex: number) => {
    if (!userId) return;

    const occupant = card.occupants?.find(o => o.seatIndex === seatIndex);

    if (occupant) {
      if (occupant.userId === userId) {
        actions.leaveSeat(userId);
      }
    } else {
      actions.joinSeat(userId, seatIndex);
    }
  };

  const allOccupantIds = useMemo(() => {
    return card.occupants?.map(o => o.userId) || [];
  }, [card.occupants]);

  const { users: userMap, loading: usersLoading } = useUsers(allOccupantIds);

  const seats = Array.from({ length: card.seats }, (_, index) => {
    const occupant = card.occupants?.find(o => o.seatIndex === index);
    const user = occupant ? userMap[occupant.userId] : null;

    return (
      <div
        key={index}
        className="flex-shrink-0 cursor-pointer"
        onClick={() => handleSeatClick(index)}
        title={occupant ? (user ? `${user.name} (click to leave if this is you)` : 'Occupied') : 'Click to join'}
      >
        {occupant && user ? (
          <UserAvatar user={user} size={40} />
        ) : (
          <div className="w-10 h-10 rounded-full border-2 border-gray-300 bg-gray-100 hover:bg-gray-200 transition-colors" />
        )}
      </div>
    );
  });

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
        {card.title}
      </h3>
      <div className="flex gap-2 items-center">
        {usersLoading ? (
          <span className="text-sm text-gray-400">Loading...</span>
        ) : (
          seats
        )}
      </div>
    </div>
  );
};

export default CarCard;