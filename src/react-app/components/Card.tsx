interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = ({ children, className = "", onClick }: CardProps) => {
  const baseClasses = "bg-white rounded-lg shadow-lg p-8 max-w-md w-full";

  return (
    <div
      className={`${baseClasses} ${className} ${onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''}`}
      data-testid="card"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;