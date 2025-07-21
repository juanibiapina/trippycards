# HTTP API for Real-Time Messages

This guide explains how to interact with the Travel Cards application's real-time messaging system using HTTP requests, compatible with the PartyKit backend.

## Endpoint Structure

Messages can be sent to and fetched from a room using the following endpoint:

```
/parties/activitydo/:roomId
```

- `:roomId` is the unique identifier for the activity room you want to interact with.
- The protocol and host depend on your environment (see below).

## Sending a Message (POST)

Send a message to all connected clients in a room by making a POST request with a JSON body. The payload should match the message format used by the WebSocket interface.

### Example Payload

```
{
  "type": "card-create",
  "card": {
    "id": "card-123",
    "type": "link",
    "title": "Example Card",
    "url": "https://example.com"
  }
}
```

### Example with curl

```
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"type":"card-create","card":{"id":"card-123","type":"link","title":"Example Card","url":"https://example.com"}}' \
  http://localhost:5173/parties/activitydo/ROOM_ID
```

Replace `ROOM_ID` with your actual room ID. Use `http://localhost:5173` for local development, or your deployed host in production.

### Example with fetch (JavaScript)

```js
const response = await fetch(`http://localhost:5173/parties/activitydo/${roomId}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "card-create",
    card: {
      id: "card-123",
      type: "link",
      title: "Example Card",
      url: "https://example.com"
    }
  })
});
```

## Fetching Activity State (GET)

You can fetch the current state of the activity (including all cards and metadata) with a GET request:

### Example with curl

```
curl http://localhost:5173/parties/activitydo/ROOM_ID
```

### Example with fetch (JavaScript)

```js
const response = await fetch(`http://localhost:5173/parties/activitydo/${roomId}`);
const activity = await response.json();
```

## WebSocket Real-Time Updates

To receive real-time updates, connect a WebSocket client to the same endpoint:

```
ws://localhost:5173/parties/activitydo/ROOM_ID
```

- The first message received will be the full activity state (type: "activity").
- Subsequent messages will be broadcast as they are sent via HTTP POST or by other clients.

## Notes
- The POST payload must include a `type` field and match the message structure expected by the backend.
- All messages sent via HTTP POST are broadcast to connected WebSocket clients in real time.
- The GET endpoint returns the full activity state as JSON.
- For production, use the appropriate host and protocol (likely `https`). 