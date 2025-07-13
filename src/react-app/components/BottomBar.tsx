import { FiHome } from "react-icons/fi";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  isActive?: boolean;
}

interface BottomBarProps {
  className?: string;
}

const BottomBar = ({ className = "" }: BottomBarProps) => {
  const handleOverviewClick = () => {
    // For now, this is a no-op since we're already on the Activity page
    // showing the questions list. In the future, this could scroll to top
    // or refresh the view.
  };

  // Navigation items structure - ready for future expansion
  const navigationItems: NavigationItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: FiHome,
      action: handleOverviewClick,
      isActive: true, // Currently the only item, so always active
    },
    // Future items can be added here
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg ${className}`}>
      <div className="flex justify-center items-center h-16 px-4">
        <div className="flex space-x-8">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] p-2 rounded-lg transition-colors ${
                  item.isActive
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