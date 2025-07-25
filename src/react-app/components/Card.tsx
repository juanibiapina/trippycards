import CardContextMenu from './cards/CardContextMenu';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const Card = ({ children, className = "", centered = false, onEdit, onDelete }: CardProps) => {
  const baseClasses = "bg-white rounded-lg shadow-lg p-8 max-w-md w-full";
  const centeredClasses = centered ? "min-h-screen flex items-center justify-center p-4" : "";

  if (centered) {
    return (
      <div className={centeredClasses}>
        <div className={`${baseClasses} ${className} relative`} data-testid="card">
          <div className="absolute top-4 right-4">
            <CardContextMenu
              onEdit={onEdit || (() => {/* TODO: implement edit */})}
              onDelete={onDelete || (() => {/* TODO: implement delete */})}
            />
          </div>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${className} relative`} data-testid="card">
      <div className="absolute top-4 right-4">
        <CardContextMenu
          onEdit={onEdit || (() => {/* TODO: implement edit */})}
          onDelete={onDelete || (() => {/* TODO: implement delete */})}
        />
      </div>
      {children}
    </div>
  );
};

export default Card;