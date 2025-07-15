import {
  type Connection,
  Server,
  type WSMessage,
} from "partyserver";

import type { Activity, Question, Message } from "../shared";
import { createEmptyActivity } from "../shared";

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

  async updateName(name: string) {
    this.activity.name = name;
    await this.ctx.storage.put("activity", this.activity);
  }

  async updateDates(startDate: string, endDate?: string, startTime?: string) {
    this.activity.startDate = startDate;
    this.activity.endDate = endDate;
    this.activity.startTime = startTime;
    await this.ctx.storage.put("activity", this.activity);
  }

  async onStart() {
    this.activity = await this.ctx.storage.get<Activity>("activity") || createEmptyActivity();
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
    } else if (parsed.type === "name") {
      await this.updateName(parsed.name);
      this.broadcastMessage({
        type: "name",
        name: parsed.name,
      });
    } else if (parsed.type === "dates") {
      await this.updateDates(parsed.startDate, parsed.endDate, parsed.startTime);
      this.broadcastMessage({
        type: "dates",
        startDate: parsed.startDate,
        endDate: parsed.endDate,
        startTime: parsed.startTime,
      });
    }
  }
}
