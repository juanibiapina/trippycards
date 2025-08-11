# Y-PartyServer Architecture Migration

This document outlines the migration from a custom WebSocket protocol to using y-partyserver for real-time collaboration.

## Overview

The Travel Cards application has been refactored to use [y-partyserver](https://github.com/cloudflare/partykit/tree/main/packages/y-partyserver) for real-time collaborative editing. This migration replaces the custom message protocol with Yjs CRDT (Conflict-free Replicated Data Type) technology.

## Key Changes

### Backend (ActivityDO)

**Before:**
- Extended `Server` from partyserver
- Used custom `Message` union type for WebSocket communication
- Manual state management with direct storage persistence
- Custom broadcast logic for real-time updates
- Manual message handling for all CRUD operations

**After:**
- Extends `YServer` from y-partyserver
- Uses Yjs document structure for state management
- Automatic synchronization via Yjs sync protocol
- No manual message handling or broadcasting required
- Persistence through Yjs document encoding/decoding

### Data Structure

The Yjs document is structured as follows:

```
document (Y.Doc)
├── "activity" (Y.Map)
│   ├── name: string
│   ├── startDate?: string
│   ├── endDate?: string
│   └── startTime?: string
└── "cards" (Y.Array<Y.Map>)
    └── [card objects as Y.Maps with all card properties]
```

### Frontend (useActivityRoom Hook)

**Before:**
- Used `usePartySocket` for WebSocket connection
- Manual message parsing and state updates
- Custom protocol for all mutations
- Required connection checks before sending messages

**After:**
- Uses `useYProvider` from y-partyserver/react
- Direct Yjs document transactions for mutations
- Automatic state synchronization through Yjs observers
- No manual connection management required

### Removed Components

- `Message` union type and all related custom protocol types
- Manual WebSocket message handling logic
- Custom broadcast mechanisms
- Manual state reconciliation logic

## Benefits

1. **Robust Conflict Resolution**: Yjs CRDTs automatically handle concurrent edits without conflicts
2. **Simplified Codebase**: No more custom protocol or manual synchronization logic
3. **Better Performance**: Efficient delta synchronization reduces bandwidth usage
4. **Future-Proof**: Built on proven CRDT technology used by collaborative editors
5. **Easier Maintenance**: Less custom code to maintain and debug

## API Compatibility

The public API surface remains unchanged:
- `useActivityRoom` hook maintains the same interface
- Activity and Card types remain the same
- CRUD operations have the same signatures
- React components require no changes

## Testing

- Unit tests for Yjs integration verify core functionality
- Existing component tests continue to pass
- Build and linting processes remain unchanged

## Migration Notes

- No data migration is required as this is a fresh implementation
- Real-time collaboration now works out of the box with multiple clients
- Card insertion order is naturally preserved by Y.Array
- All operations are now atomic and conflict-free

## Dependencies Added

- `y-partyserver`: Yjs backend for PartyServer
- `yjs`: Core CRDT library for collaborative editing

The migration maintains full backward compatibility while providing a more robust foundation for real-time collaboration features.