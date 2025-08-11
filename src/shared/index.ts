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

export interface NoteCard extends Card {
  type: 'note';
  text: string;
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

export type NoteCardInput = {
  type: 'note';
  text: string;
};

export type AILinkCardInput = {
  type: 'ailink';
  url: string;
};
