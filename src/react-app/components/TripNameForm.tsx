import Card from "./Card";

const TripNameForm = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card centered>
        <div className="text-center mb-6">
          <div className="text-blue-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Name Your Trip</h2>
          <p className="text-gray-600">Give your trip a memorable name</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="tripName" className="block text-sm font-medium text-gray-700 mb-2">
              Trip Name
            </label>
            <input
              type="text"
              id="tripName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter trip name..."
            />
          </div>

          <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
            Save Trip Name
          </button>
        </div>
      </Card>
    </div>
  );
};

export default TripNameForm;