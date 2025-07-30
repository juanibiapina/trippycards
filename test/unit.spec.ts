import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
// Import your worker so you can unit test it
import worker from "../src/worker";

async function invokeWorker(url: string, options?: RequestInit): Promise<Response> {
  const request = new Request(url, options);
  // Create an empty context to pass to `worker.fetch()`
  const ctx = createExecutionContext();
  // Type assertion to handle the worker fetch typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await (worker as any).fetch(request, env, ctx);
  // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
  await waitOnExecutionContext(ctx);
  return response;
}

describe("Worker test", () => {
  it("responds with 404", async () => {
    const response = await invokeWorker("http://example.com/404");
    expect(response.status).toBe(404);
    expect(await response.text()).toBe("404 Not Found");
  });

  it("creates AILink card via HTTP API", async () => {
    // Generate a random room ID for testing
    const roomId = crypto.randomUUID();
    const cardId = crypto.randomUUID();

    // Create the message payload for an AILink card
    const message = {
      type: "card-create",
      card: {
        id: cardId,
        type: "ailink",
        url: "https://example.com",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    };

    // Make a POST request to create the card
    const response = await invokeWorker(`http://example.com/parties/activitydo/${roomId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    // Verify the response is successful
    expect(response.status).toBe(200);

    // Verify we can retrieve the activity and it contains our card
    const getResponse = await invokeWorker(`http://example.com/parties/activitydo/${roomId}`);

    expect(getResponse.status).toBe(200);
    const activity = await getResponse.json() as { cards: Array<{ id: string; type: string; url: string; workflowId?: string }> };

    // Verify the AILink card was created with the correct properties
    expect(activity.cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: cardId,
          type: "ailink",
          url: "https://example.com",
        })
      ])
    );

    // Verify the AILink card has a workflowId (indicating workflow was triggered)
    const createdCard = activity.cards.find((card) => card.id === cardId);
    expect(createdCard).toBeDefined();
    expect(createdCard!.workflowId).toBeDefined();
    expect(typeof createdCard!.workflowId).toBe("string");
  });
});
