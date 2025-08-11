# Copilot Instructions for Travel Cards Project

## Project Overview

Travel Cards is a full-stack real-time web application for managing activities, built with:

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Cloudflare Workers + Hono API framework
- **Real-time**: PartyKit WebSocket integration
- **Styling**: TailwindCSS v4 with strict gray-centric color palette
- **Routing**: React Router v7 in data router mode
- **Auth**: Clerk authentication
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Monitoring**: Sentry error tracking

## Development Workflow

Before committing any changes, you **MUST** complete the following steps in order:

1. **Run tests** - Execute `npm test` and ensure all tests pass
2. **Run linter** - Execute `npm run lint` and fix all linting issues
3. **Ensure build passes** - Execute `npm run build` and verify successful build
4. **Run E2E tests** - Execute `npm run test:e2e` and ensure all end-to-end tests pass

## Code Organization

```
src/
├── react-app/           # React frontend code
│   ├── components/      # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Route components
│   └── utils/          # Utility functions
├── shared/             # Shared types and utilities
├── test/               # Test utilities and helpers
└── worker/             # Cloudflare Workers backend code
```

## Style Guidelines

### TailwindCSS Color Palette

**STRICTLY FOLLOW** the gray-centric color scheme defined in `docs/guides/colors.md`:

- **Primary colors**: Gray palette (gray-50 to gray-900)
- **Backgrounds**: `bg-white` for cards, `bg-gray-50`/`bg-gray-100` for pages
- **Buttons**: `bg-gray-700` primary, `bg-gray-200` secondary
- **Text**: `text-gray-900` primary, `text-gray-600` muted
- **Limited usage**: Green/red only for success/error states
- **PROHIBITED**: Blue, teal, indigo, gradients, and other color families

### Component Patterns

- **Cards**: Always use `bg-white` with `shadow-lg`
- **Buttons**: Follow the Button component pattern with consistent hover states
- **Interactive elements**: Use `focus:ring-gray-500` for accessibility

## React Router v7 Guidelines

- **Version**: React Router v7 in **data router mode**
- **Import**: Use `react-router` (not `react-router-dom`)
- **Pattern**: Use `createBrowserRouter` with nested routes
- **Layouts**: Use `<Outlet />` for nested route rendering

## Real-time Messaging

- **WebSocket endpoint**: `/parties/activitydo/:roomId`
- **HTTP API**: POST to send messages, GET to fetch state
- **Message format**: Include `type` field in all messages
- **Patterns**: Follow examples in `docs/guides/http.md`

## Testing Strategy

- **Unit tests**: Use Vitest with React Testing Library
- **E2E tests**: Playwright across multiple browsers (Chrome, Firefox, Safari, Mobile)
- **Test files**: Co-locate with components (`.test.tsx` suffix)
- **Mocking**: Use Clerk testing utilities for auth-related tests

> **Note**: Playwright tests may currently fail on CI due to Clerk-related timeouts. This is a known issue with authentication flows in the CI environment.

## ESLint Configuration

- **No trailing spaces**: Enforced via `no-trailing-spaces` rule
- **React hooks**: Follow React hooks linting rules
- **TypeScript**: Use recommended TypeScript ESLint rules

## Best Practices

1. **Minimal changes**: Make surgical, focused modifications
2. **Type safety**: Leverage TypeScript throughout
3. **Accessibility**: Include proper ARIA labels and focus management
4. **Performance**: Use React.memo and useMemo where appropriate
5. **Error handling**: Implement proper error boundaries and Sentry integration

## File Naming Conventions

- **Components**: PascalCase (e.g., `UserAvatar.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useLongPress.ts`)
- **Utils**: camelCase (e.g., `dateUtils.ts`)
- **Types**: PascalCase interfaces/types in shared folder

## Documentation

Update relevant documentation in `docs/` when making significant changes:
- `docs/guides/colors.md` - Color usage
- `docs/guides/react-router.md` - Routing patterns
- `docs/guides/http.md` - API patterns
