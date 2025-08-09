export interface Card {
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  date?: string;
  children?: Card[];
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

export interface PromptCard extends Card {
  type: 'prompt';
  text: string;
}

export type Activity = {
  name?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  cards?: Card[];
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

export type PromptCardInput = {
  type: 'prompt';
  text: string;
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
