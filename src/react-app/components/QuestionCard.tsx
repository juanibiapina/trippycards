import { useSession } from '@hono/auth-js/react';
import Card from "./Card";

interface Question {
  id: string;
  text: string;
  createdBy: string;
  createdAt: string;
  responses: Record<string, 'yes' | 'no'>;
}

interface QuestionCardProps {
  question: Question;
  onResponse: (questionId: string, response: 'yes' | 'no') => void;
}

const QuestionCard = ({ question, onResponse }: QuestionCardProps) => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || 'anonymous';

  const userResponse = question.responses[userEmail];
  const yesCount = Object.values(question.responses).filter(r => r === 'yes').length;
  const noCount = Object.values(question.responses).filter(r => r === 'no').length;
  const totalResponses = yesCount + noCount;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card>
      <div className="space-y-4">
        {/* Question */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{question.text}</h3>
          <p className="text-sm text-gray-500">
            Asked by {question.createdBy} on {formatDate(question.createdAt)}
          </p>
        </div>

        {/* Response Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onResponse(question.id, 'yes')}
            className={`flex-1 font-bold py-3 px-6 rounded-md transition-colors shadow-md hover:shadow-lg ${
              userResponse === 'yes'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => onResponse(question.id, 'no')}
            className={`flex-1 font-bold py-3 px-6 rounded-md transition-colors shadow-md hover:shadow-lg ${
              userResponse === 'no'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            No
          </button>
        </div>

        {/* Results */}
        {totalResponses > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Results:</span>
              <div className="flex gap-4">
                <span className="text-green-600 font-medium">
                  Yes: {yesCount} ({totalResponses > 0 ? Math.round((yesCount / totalResponses) * 100) : 0}%)
                </span>
                <span className="text-red-600 font-medium">
                  No: {noCount} ({totalResponses > 0 ? Math.round((noCount / totalResponses) * 100) : 0}%)
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="h-full flex">
                <div
                  className="bg-green-500 transition-all duration-300"
                  style={{ width: `${totalResponses > 0 ? (yesCount / totalResponses) * 100 : 0}%` }}
                />
                <div
                  className="bg-red-500 transition-all duration-300"
                  style={{ width: `${totalResponses > 0 ? (noCount / totalResponses) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* User's current response indicator */}
        {userResponse && (
          <div className="text-sm text-gray-600">
            Your answer: <span className={`font-medium ${userResponse === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
              {userResponse === 'yes' ? 'Yes' : 'No'}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuestionCard;