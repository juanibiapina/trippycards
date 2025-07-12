const Button = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button
    className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-md transition-colors shadow-md hover:shadow-lg"
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
