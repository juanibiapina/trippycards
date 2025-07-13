import { MdClose } from 'react-icons/md';

interface Question {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
  responses: Record<string, 'yes' | 'no'>;
}

interface OverviewModalProps {
  questions: Question[];
  isOpen: boolean;
  onClose: () => void;
}

const OverviewModal = ({ questions, isOpen, onClose }: OverviewModalProps) => {
  if (!isOpen) return null;

  const getVoteCounts = (question: Question) => {
    const responses = Object.values(question.responses);
    const yesCount = responses.filter(r => r === 'yes').length;
    const noCount = responses.filter(r => r === 'no').length;
    return { yesCount, noCount, total: responses.length };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-2xl max-h-[80vh] sm:max-h-[60vh] sm:rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close overview"
          >
            <MdClose className="text-gray-600 text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto">
          {questions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No questions yet</p>
              <p className="text-gray-400 text-sm mt-2">Create your first question to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => {
                const { yesCount, noCount, total } = getVoteCounts(question);
                return (
                  <div
                    key={question.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <h3 className="font-medium text-gray-800 mb-2">
                      {question.text}
                    </h3>
                    <div className="text-sm text-gray-600 mb-3">
                      by {question.createdBy} • {new Date(question.createdAt).toLocaleDateString()}
                    </div>
                    {total > 0 ? (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-green-600">
                            Yes: {yesCount}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm font-medium text-red-600">
                            No: {noCount}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Total: {total}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        No responses yet
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewModal;