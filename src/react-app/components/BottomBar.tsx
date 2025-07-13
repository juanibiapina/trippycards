import { FiHome, FiHelpCircle } from "react-icons/fi";
import { useNavigate, useParams, useLocation } from "react-router";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

interface BottomBarProps {
  className?: string;
}

const BottomBar = ({ className = "" }: BottomBarProps) => {
  const navigate = useNavigate();
  const params = useParams<{ activityId: string }>();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    if (params.activityId) {
      navigate(`/activities/${params.activityId}/${path}`);
    }
  };

  // Navigation items structure
  const navigationItems: NavigationItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: FiHome,
      path: 'overview',
    },
    {
      id: 'questions',
      label: 'Questions',
      icon: FiHelpCircle,
      path: 'questions',
    },
  ];

  const getCurrentPath = () => {
    const pathSegments = location.pathname.split('/');
    return pathSegments[pathSegments.length - 1];
  };

  const currentPath = getCurrentPath();

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg ${className}`}>
      <div className="flex justify-center items-center h-16 px-4">
        <div className="flex space-x-8">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-gray-800 bg-gray-100'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                aria-label={item.label}
              >
                <IconComponent className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomBar;