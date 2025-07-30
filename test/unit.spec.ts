import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
// Import your worker so you can unit test it
import worker from "../src/worker";

async function invokeWorker(url: string): Promise<Response> {
  const request = new Request(url);
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
});
