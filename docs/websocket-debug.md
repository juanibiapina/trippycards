# WebSocket Connection Issue

## Problem

WebSocket connection to PartyServer returns HTTP 200 instead of WebSocket upgrade (101).

## How to test

1. Deploy Changes

```bash
bin/deploy
```

2. run Test Command

```bash
websocat -vv "wss://cf-travelcards.juanibiapina.workers.dev/parties/activitydo/e1e7f3c0-4a01-471d-88e9-6d6dd76c41df?_pk=2082fbcc-d85e-4138-9c81-d677c67e781f"
```

Expected: WebSocket connection established
Actual: `WebSocketError: Received unexpected status code (200 OK)`
