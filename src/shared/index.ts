export type Activity = {
  questions: Record<string, Question>;
}

export interface Question {
  id: string;
  text: string;
  createdBy: string;
  createdAt: string;
  responses: Record<string, 'yes' | 'no'>;
}

export type Message =
  | {
      type: "question";
      question: Question;
    }
  | {
      type: "activity";
      activity: Activity;
    }
  | {
      type: "vote";
      questionId: string;
      vote: 'yes' | 'no';
      userId: string;
    };
