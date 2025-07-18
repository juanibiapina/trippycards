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
  title: string;
  options: string[];
  votes: Record<string, string>; // userId -> selectedOption
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
    }
  | {
      type: "vote";
      cardId: string;
      userId: string;
      option: string;
    };
