import { useEffect, useReducer, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSession } from '@hono/auth-js/react';
import { FiAlertTriangle } from "react-icons/fi";
import LoadingCard from "../components/LoadingCard";
import Card from "../components/Card";
import QuestionCard from "../components/QuestionCard";
import ActivityHeader from "../components/ActivityHeader";
import BottomBar from "../components/BottomBar";
import OverviewModal from "../components/OverviewModal";
import { useActivityRoom } from "../hooks/useActivityRoom";

interface QuestionFormState {
  text: string;
  isSubmitting: boolean;
}

type QuestionFormAction =
  | { type: 'SET_TEXT'; payload: string }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET' };

const questionFormReducer = (state: QuestionFormState, action: QuestionFormAction): QuestionFormState => {
  switch (action.type) {
    case 'SET_TEXT':
      return { ...state, text: action.payload };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'RESET':
      return { text: '', isSubmitting: false };
    default:
      return state;
  }
};

const ActivityPage = () => {
  const { data: session, status } = useSession();
  const navigate = useNavigate();
  const params = useParams<{ activityId: string }>();
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);

  const [questionForm, dispatchQuestionForm] = useReducer(questionFormReducer, {
    text: '',
    isSubmitting: false
  });

  const { activity, loading, createQuestion, submitVote, updateName, updateDates, isConnected } = useActivityRoom(params.activityId || '');

  const handleSubmitResponse = useCallback((questionId: string, response: 'yes' | 'no') => {
    if (!session || !isConnected) return;
    const userEmail = session.user?.email || 'anonymous';
    submitVote(questionId, response, userEmail);
  }, [session, isConnected, submitVote]);

  const handleNameUpdate = useCallback((name: string) => {
    if (isConnected) {
      updateName(name);
    }
  }, [isConnected, updateName]);

  const handleDateChange = useCallback((startDate: string, endDate?: string, startTime?: string) => {
    if (!isConnected) return;
    updateDates(startDate, endDate, startTime);
  }, [isConnected, updateDates]);

  const handleCreateQuestion = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionForm.text.trim() || questionForm.isSubmitting || !session || !isConnected) return;

    dispatchQuestionForm({ type: 'SET_SUBMITTING', payload: true });
    try {
      const userEmail = session.user?.email || 'anonymous';
      createQuestion(questionForm.text, userEmail);
      dispatchQuestionForm({ type: 'RESET' });
    } catch (error) {
      console.error('Error creating question:', error);
    } finally {
      dispatchQuestionForm({ type: 'SET_SUBMITTING', payload: false });
    }
  }, [questionForm.text, questionForm.isSubmitting, session, isConnected, createQuestion]);

  const handleOverviewClick = useCallback(() => {
    setIsOverviewOpen(true);
  }, []);

  const handleOverviewClose = useCallback(() => {
    setIsOverviewOpen(false);
  }, []);

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

  const questions = Object.values(activity.questions).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20"> {/* Added pb-20 for bottom bar space */}
      <ActivityHeader
        activityName={activity?.name}
        startDate={activity?.startDate}
        endDate={activity?.endDate}
        startTime={activity?.startTime}
        onNameUpdate={handleNameUpdate}
        onDateChange={handleDateChange}
        disabled={!isConnected}
      />

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Create Question Form */}
        <Card>
          <form onSubmit={handleCreateQuestion} className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                Create a new question
              </label>
              <input
                type="text"
                id="question"
                value={questionForm.text}
                onChange={(e) => dispatchQuestionForm({ type: 'SET_TEXT', payload: e.target.value })}
                placeholder="e.g., Can you lead climb?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                disabled={questionForm.isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={!questionForm.text.trim() || questionForm.isSubmitting || !isConnected}
              className="w-full bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-md transition-colors shadow-md hover:shadow-lg"
            >
{questionForm.isSubmitting ? 'Creating...' : isConnected ? 'Create Question' : 'Connecting...'}
            </button>
          </form>
        </Card>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.length === 0 ? (
            <Card>
              <div className="text-center text-gray-500">
                <p>No questions yet. Create the first one above!</p>
              </div>
            </Card>
          ) : (
            questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onResponse={handleSubmitResponse}
              />
            ))
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <BottomBar
        questions={questions}
        onOverviewClick={handleOverviewClick}
      />

      {/* Overview Modal */}
      <OverviewModal
        questions={questions}
        isOpen={isOverviewOpen}
        onClose={handleOverviewClose}
      />
    </div>
  );
};

export default ActivityPage;
