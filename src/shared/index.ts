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
  votes?: { userId: string; option: number }[];
}

export interface AILinkCard extends Card {
  type: 'ailink';
  url: string;
  title?: string;
  description?: string;
  status?: 'processing' | 'completed' | 'error';
  workflowId?: string;
}

export type Activity = {
  name?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  cards?: Card[];
}

export function createEmptyActivity(): Activity {
  return { cards: [] };
}

export type LinkCardInput = {
  type: 'link';
  url: string;
  title?: string;
  description?: string;
  imageUrl?: string;
};

export type PollCardInput = {
  type: 'poll';
  question: string;
  options: string[];
};

export type AILinkCardInput = {
  type: 'ailink';
  url: string;
};

export type Message =
  | {
      type: "activity";
      activity: Activity;
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
    };
