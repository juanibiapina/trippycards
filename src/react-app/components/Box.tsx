import CardContextMenu from './CardContextMenu';

interface BoxProps {
  children: React.ReactNode;
  className?: string;
  onDelete?: () => void;
}

const Box = ({ children, className = "", onDelete }: BoxProps) => {
  const baseClasses = "bg-white rounded-lg shadow-lg p-8 max-w-md w-full";

  return (
    <div className={`${baseClasses} ${className} relative`} data-testid="card">
      {onDelete && (
        <div className="absolute bottom-1 right-1">
          <CardContextMenu onDelete={onDelete} />
        </div>
      )}
      {children}
    </div>
  );
};

export default Box;
