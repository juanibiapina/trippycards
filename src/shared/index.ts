export interface Card {
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface LinkCard extends Card {
  type: 'link';
  url: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

export interface PollCard extends Card {
  type: 'poll';
  question: string;
  options: string[];
  votes: Record<string, Record<string, string>>; // optionIndex -> userId -> userName
}

export type Activity = {
  name?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  questions: Record<string, Question>;
  cards?: Card[];
}

export function createEmptyActivity(): Activity {
  return { questions: {}, cards: [] };
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
    }
  | {
      type: "name";
      name: string;
    }
  | {
      type: "dates";
      startDate: string;
      endDate?: string;
      startTime?: string;
    }
  | {
      type: "card-create";
      card: Card;
    }
  | {
      type: "card-update";
      card: Card;
    }
  | {
      type: "card-delete";
      cardId: string;
    }
  | {
      type: "card-vote";
      cardId: string;
      optionIndex: number;
      userId: string;
      userName: string;
    };
