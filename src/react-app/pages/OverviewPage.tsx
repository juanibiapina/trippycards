import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useSession } from '@hono/auth-js/react';
import { FiAlertTriangle } from "react-icons/fi";
import LoadingCard from "../components/LoadingCard";
import Card from "../components/Card";
import ActivityHeader from "../components/ActivityHeader";
import BottomBar from "../components/BottomBar";
import { useActivityRoom } from "../hooks/useActivityRoom";

const OverviewPage = () => {
  const { data: session, status } = useSession();
  const navigate = useNavigate();
  const params = useParams<{ activityId: string }>();

  const { activity, loading, updateName, updateDates, isConnected } = useActivityRoom(params.activityId || '');

  const handleNameUpdate = (name: string) => {
    if (isConnected) {
      updateName(name);
    }
  };

  const handleDateChange = (startDate: string, endDate?: string, startTime?: string) => {
    if (!isConnected) return;
    updateDates(startDate, endDate, startTime);
  };

  useEffect(() => {
    // Only redirect if authentication is complete and user is not authenticated
    if (status !== "loading" && !session) {
      navigate('/');
      return;
    }
  }, [session, status, navigate]);

  // Show loading while authentication status is being determined
  if (status === "loading") {
    return <LoadingCard />;
  }

  // Don't render anything if not authenticated (after loading is complete)
  if (!session) {
    return null;
  }

  if (loading) {
    return <LoadingCard />;
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card centered>
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <FiAlertTriangle className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600">We couldn't load your activity. Please try again.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ActivityHeader
        activityName={activity?.name}
        startDate={activity?.startDate}
        endDate={activity?.endDate}
        startTime={activity?.startTime}
        onNameUpdate={handleNameUpdate}
        onDateChange={handleDateChange}
        disabled={!isConnected}
      />

      {/* Content with bottom padding to account for fixed bottom bar */}
      <div className="max-w-2xl mx-auto p-4 space-y-6 pb-20">
        <Card>
          <div className="text-center text-gray-600 py-8">
            <p className="text-lg">Overview is coming soon!</p>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomBar />
    </div>
  );
};

export default OverviewPage;