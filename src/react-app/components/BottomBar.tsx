import { MdList } from 'react-icons/md';

interface Question {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
  responses: Record<string, 'yes' | 'no'>;
}

interface BottomBarProps {
  questions: Question[];
  onOverviewClick: () => void;
}

const BottomBar = ({ questions, onOverviewClick }: BottomBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-center items-center h-16">
        <button
          onClick={onOverviewClick}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors min-w-[60px]"
          aria-label="Overview"
        >
          <MdList className="text-gray-600 text-2xl mb-1" />
          <span className="text-xs text-gray-600 font-medium">Overview</span>
          {questions.length > 0 && (
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {questions.length}
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default BottomBar;