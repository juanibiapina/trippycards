import React from 'react';
import { CostCard as CostCardType } from '../../../shared';

interface CostCardProps {
  card: CostCardType;
  activityUsers?: { userId: string; name?: string }[];
}

export const CostCard: React.FC<CostCardProps> = ({ card, activityUsers = [] }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getUserName = (userId: string) => {
    const user = activityUsers.find(u => u.userId === userId);
    return user?.name || userId;
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {card.description}
        </h3>

        <div className="text-xl font-bold text-green-600">
          Total: {formatCurrency(card.totalAmount)}
        </div>

        {/* Payers section */}
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-700">Paid by:</h4>
          {card.payments.map((payment, idx) => (
            <div key={idx} className="text-sm text-gray-600">
              {getUserName(payment.userId)}: {formatCurrency(payment.amount)}
            </div>
          ))}
        </div>

        {/* Participants section */}
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-700">Split among:</h4>
          {card.participants.map((participant, idx) => (
            <div key={idx} className="text-sm text-gray-600">
              {getUserName(participant.userId)} owes: {formatCurrency(participant.amountOwed)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CostCard;