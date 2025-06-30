# Contributing to Travel Cards

## Development Setup

### Prerequisites
- Node.js (latest LTS version)
- npm package manager

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   
   Your application will be available at [http://localhost:5173](http://localhost:5173).

## Development Commands

### Core Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

### Cloudflare Workers
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run check` - Full validation (TypeScript + build + dry-run deploy)
- `npm run cf-typegen` - Generate Cloudflare Workers type definitions

## Code Quality

### Linting
Before submitting changes, run:
```bash
npm run lint
```

### TypeScript
This project uses strict TypeScript configuration across all environments:
- Frontend: `tsconfig.app.json`
- Backend: `tsconfig.worker.json`
- Build tools: `tsconfig.node.json`

## Testing

No testing framework is currently configured in this project. Consider adding tests before making significant changes.

## Deployment

### Local Testing
1. Build the project: `npm run build`
2. Preview locally: `npm run preview`
3. Validate deployment: `npm run check`

### Production Deployment
Deploy to Cloudflare Workers:
```bash
npm run deploy
```

## Project Structure

- `src/react-app/` - Frontend React application
- `src/worker/` - Backend Cloudflare Worker with Hono framework
- `public/` - Static assets
- Configuration files in project root