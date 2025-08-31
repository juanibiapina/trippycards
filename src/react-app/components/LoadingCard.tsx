import Box from "./Box";

const LoadingCard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Box>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
            <p className="text-gray-600">Please wait while we fetch your data</p>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default LoadingCard;
