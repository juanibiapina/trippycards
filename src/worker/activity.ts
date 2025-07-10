import { DurableObject } from "cloudflare:workers";

export interface Question {
  id: string;
  text: string;
  createdBy: string;
  createdAt: Date;
  responses: Record<string, 'yes' | 'no'>;
}

export interface Activity {
  questions: Record<string, Question>;
}

export class ActivityDO extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  async get(): Promise<Activity> {
    const questions = await this.ctx.storage.get<Record<string, Question>>('questions') || {};
    return { questions };
  }

  async createQuestion(text: string, createdBy: string): Promise<Question> {
    const questionId = crypto.randomUUID();
    const question: Question = {
      id: questionId,
      text,
      createdBy,
      createdAt: new Date(),
      responses: {}
    };

    const activity = await this.get();
    activity.questions[questionId] = question;
    await this.ctx.storage.put('questions', activity.questions);

    return question;
  }

  async submitResponse(questionId: string, userId: string, response: 'yes' | 'no'): Promise<void> {
    const activity = await this.get();

    if (!activity.questions[questionId]) {
      throw new Error('Question not found');
    }

    activity.questions[questionId].responses[userId] = response;
    await this.ctx.storage.put('questions', activity.questions);
  }

  async getQuestion(questionId: string): Promise<Question | null> {
    const activity = await this.get();
    return activity.questions[questionId] || null;
  }
}