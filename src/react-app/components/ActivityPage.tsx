import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useSession } from '@hono/auth-js/react';
import LoadingCard from "./LoadingCard";
import Card from "./Card";
import QuestionCard from "./QuestionCard";

interface Question {
  id: string;
  text: string;
  createdBy: string;
  createdAt: string;
  responses: Record<string, 'yes' | 'no'>;
}

interface Activity {
  questions: Record<string, Question>;
}

const ActivityPage = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const params = useParams<{ activityId: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [questionText, setQuestionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchActivity = useCallback(() => {
    if (!session) return;

    fetch(`/api/activities/${params.activityId}`)
      .then((res) => res.json() as Promise<Activity>)
      .then((data) => {
        setActivity(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching activity:", error);
        setLoading(false);
      });
  }, [params.activityId, session]);

  useEffect(() => {
    if (!session) {
      navigate('/');
      return;
    }
    fetchActivity();
  }, [session, navigate, fetchActivity]);

  // Don't render anything if not authenticated
  if (!session) {
    return null;
  }

  const createQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || isSubmitting || !session) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/activities/${params.activityId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: questionText }),
      });

      if (!response.ok) {
        throw new Error('Failed to create question');
      }

      setQuestionText("");
      fetchActivity(); // Refresh the activity data
    } catch (error) {
      console.error('Error creating question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitResponse = async (questionId: string, response: 'yes' | 'no') => {
    if (!session) return;

    try {
      const res = await fetch(`/api/activities/${params.activityId}/questions/${questionId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit response');
      }

      fetchActivity(); // Refresh the activity data
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  if (loading) {
    return <LoadingCard />;
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card centered>
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-teal-700 text-white px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Activity Questions</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Create Question Form */}
        <Card>
          <form onSubmit={createQuestion} className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                Create a new question
              </label>
              <input
                type="text"
                id="question"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="e.g., Can you lead climb?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={!questionText.trim() || isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-md transition-colors shadow-md hover:shadow-lg"
            >
              {isSubmitting ? 'Creating...' : 'Create Question'}
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
                onResponse={submitResponse}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;