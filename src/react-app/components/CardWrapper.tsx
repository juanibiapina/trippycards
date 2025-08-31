interface CardWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const CardWrapper = ({ children, className = "" }: CardWrapperProps) => {
  const baseClasses = "bg-white rounded-lg shadow-lg p-8 max-w-md w-full";

  return (
    <div className={`${baseClasses} ${className}`} data-testid="card">
      {children}
    </div>
  );
};

export default CardWrapper;
