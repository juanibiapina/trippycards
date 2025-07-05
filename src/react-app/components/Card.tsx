interface CardProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

const Card = ({ children, className = "", centered = false }: CardProps) => {
  const baseClasses = "bg-white rounded-lg shadow-lg p-8 max-w-md w-full";
  const centeredClasses = centered ? "min-h-screen flex items-center justify-center p-4" : "";

  if (centered) {
    return (
      <div className={centeredClasses}>
        <div className={`${baseClasses} ${className}`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;