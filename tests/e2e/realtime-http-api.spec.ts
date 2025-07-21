import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

const BASE_HTTP_URL = 'http://localhost:5173';
const BASE_WS_URL = 'ws://localhost:5173';
const PARTY = 'activitydo';

// Helper to connect to the WebSocket endpoint
function connectWebSocket(roomId: string) {
  return new Promise<{ ws: WebSocket, nextMessage: () => Promise<any> }>((resolve, reject) => {
    const ws = new WebSocket(`${BASE_WS_URL}/parties/${PARTY}/${roomId}`);
    const messageQueue: any[] = [];
    ws.onmessage = (event) => {
      messageQueue.push(JSON.parse(event.data));
    };
    ws.onopen = () => {
      resolve({
        ws,
        nextMessage: () => new Promise(res => {
          if (messageQueue.length > 0) {
            res(messageQueue.shift());
          } else {
            const handler = (event: MessageEvent) => {
              ws.removeEventListener('message', handler);
              res(JSON.parse(event.data));
            };
            ws.addEventListener('message', handler);
          }
        })
      });
    };
    ws.onerror = (err) => reject(err);
  });
}

// Helper to wait for a message of a specific type
async function waitForMessageOfType(nextMessage: () => Promise<any>, type: string, maxTries = 5) {
  for (let i = 0; i < maxTries; ++i) {
    const msg = await nextMessage();
    if (msg.type === type) return msg;
  }
  throw new Error(`Did not receive message of type '${type}' after ${maxTries} tries`);
}

test.describe('HTTP API for Real-Time Messages', () => {
  test('POST broadcasts to WebSocket and GET returns state', async ({ request }) => {
    const roomId = randomUUID();
    const message = {
      type: 'card-create',
      card: {
        id: 'card-123',
        type: 'link',
        title: 'Example Card',
        url: 'https://example.com',
      },
    };

    // 1. Connect WebSocket client
    const { ws, nextMessage } = await connectWebSocket(roomId);

    // 2. The first message is always the activity snapshot, skip it
    await waitForMessageOfType(nextMessage, 'activity');

    // 3. POST message to HTTP endpoint
    const postResp = await request.post(`${BASE_HTTP_URL}/parties/${PARTY}/${roomId}`, {
      data: message,
      headers: { 'Content-Type': 'application/json' },
    });
    expect(postResp.ok()).toBeTruthy();

    // 4. Wait for the card-create message, ignoring any activity messages
    const received = await waitForMessageOfType(nextMessage, 'card-create', 5);
    expect(received).toMatchObject(message);

    // 5. GET activity state
    const getResp = await request.get(`${BASE_HTTP_URL}/parties/${PARTY}/${roomId}`);
    expect(getResp.ok()).toBeTruthy();
    const activity = await getResp.json();
    expect(activity.cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'card-123',
          type: 'link',
          title: 'Example Card',
          url: 'https://example.com',
        })
      ])
    );

    ws.close();
  });
}); 