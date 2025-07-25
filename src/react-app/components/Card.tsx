import CardContextMenu from './cards/CardContextMenu';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onDelete?: () => void;
}

const Card = ({ children, className = "", onDelete }: CardProps) => {
  const baseClasses = "bg-white rounded-lg shadow-lg p-8 max-w-md w-full";

  return (
    <div className={`${baseClasses} ${className} relative`} data-testid="card">
      {onDelete && (
        <div className="absolute top-4 right-4">
          <CardContextMenu onDelete={onDelete} />
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;