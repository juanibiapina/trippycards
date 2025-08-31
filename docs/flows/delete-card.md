# Delete Card

**Note: Delete functionality has been removed from the application.**

This flow previously described how users could delete cards from an activity, but the delete functionality has been removed as of the latest update.

## Previous Implementation (Removed)

The following components and functionality have been removed:
- `CardContextMenu` - Context menu with delete option
- `DeleteConfirmationDialog` - Confirmation dialog for deletion
- Delete card integration test
- Card delete functionality from the UI

## Current State

Cards in activities are now read-only from the user interface perspective. Once created, cards cannot be deleted through the UI.

## Refactoring History

- [x] ~~Check usage of Card `centered` attribute~~ - Completed: Removed redundant `centered` prop from Card component
- [x] ~~Remove Edit item from context menu, since it doesn't do anything currently~~ - Completed: Removed Edit functionality from CardContextMenu component
- [x] ~~Check if TODO can be fixed in Card~~ - Completed: Fixed by only showing CardContextMenu when onDelete prop is provided
- [x] ~~Move context menu to the bottom right corner~~ - Completed: Moved CardContextMenu from top-right to bottom-right corner of cards
- [x] ~~Improve Card context menu icon~~ - Completed: Changed from vertical three dots (FiMoreVertical) to horizontal three dots (FiMoreHorizontal)
- [x] **Remove delete card functionality entirely** - Completed: Removed CardContextMenu, DeleteConfirmationDialog, and all delete-related UI components 