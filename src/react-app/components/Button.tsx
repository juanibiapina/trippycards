const Button = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button
    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors shadow-md hover:shadow-lg"
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
