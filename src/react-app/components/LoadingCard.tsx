import Card from "./Card";

const LoadingCard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card centered>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
            <p className="text-gray-600">Please wait while we fetch your data</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoadingCard;