import { AILinkCard as AILinkCardType } from '../../../shared';

interface AILinkCardProps {
  card: AILinkCardType;
}

export const AILinkCard: React.FC<AILinkCardProps> = ({ card }) => {
  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(card.url, '_blank', 'noopener,noreferrer');
  };

  const getStatusText = () => {
    switch (card.status) {
      case 'processing':
        return 'Processing...';
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Error processing URL';
      default:
        return 'Processing...';
    }
  };

  const getStatusColor = () => {
    switch (card.status) {
      case 'processing':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          AI Link Card
        </h3>

        <div className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>

        <div className="flex items-center space-x-2">
          <a
            href={card.url}
            onClick={handleLinkClick}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium truncate"
          >
            {card.url}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AILinkCard;