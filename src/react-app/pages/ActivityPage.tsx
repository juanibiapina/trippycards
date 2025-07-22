import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router";
import { useSession } from '@hono/auth-js/react';
import LoadingCard from "../components/LoadingCard";

const ActivityPage = () => {
  const { data: session, status } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if authentication is complete and user is not authenticated
    if (status !== "loading" && !session) {
      // Store the current URL as a redirect parameter
      const redirectUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`/?redirect=${redirectUrl}`);
      return;
    }
  }, [session, status, navigate, location]);

  // Show loading while authentication status is being determined
  if (status === "loading") {
    return <LoadingCard />;
  }

  // Don't render anything if not authenticated (after loading is complete)
  if (!session) {
    return null;
  }

  return <Outlet />;
};

export default ActivityPage;
