import {
  type Connection,
  Server,
  type WSMessage,
} from "partyserver";

import type { Activity, Question, Message } from "../shared";

export class ActivityDO extends Server<Env> {
  static options = { hibernate: true };

  activity = {} as Activity;

  broadcastMessage(message: Message, exclude?: string[]) {
    this.broadcast(JSON.stringify(message), exclude);
  }

  async addQuestion(question: Question) {
    this.activity.questions[question.id] = question;
    await this.ctx.storage.put("activity", this.activity);
  }

  async submitVote(questionId: string, userId: string, vote: 'yes' | 'no') {
    if (this.activity.questions[questionId]) {
      this.activity.questions[questionId].responses[userId] = vote;
      await this.ctx.storage.put("activity", this.activity);

      // Broadcast the question update to all clients
      this.broadcastMessage({
        type: "question",
        question: this.activity.questions[questionId],
      });
    }
  }

  async onStart() {
    this.activity = await this.ctx.storage.get<Activity>("activity") || { questions: {} };
  }

  onConnect(connection: Connection) {
    connection.send(
      JSON.stringify({
        type: "activity",
        activity: this.activity,
      } satisfies Message),
    );
  }

  async onMessage(_connection: Connection, message: WSMessage) {
    const parsed = JSON.parse(message as string) as Message;

    if (parsed.type === "question") {
      await this.addQuestion(parsed.question);
      this.broadcast(message);
    } else if (parsed.type === "vote") {
      // Use authenticated user ID from the message
      const userId = parsed.userId;
      await this.submitVote(parsed.questionId, userId, parsed.vote);
    }
  }
}
