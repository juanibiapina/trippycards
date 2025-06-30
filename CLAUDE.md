# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack React + Cloudflare Workers application. See @README.md for project description and @CONTRIBUTING.md for development setup.

## Claude-Specific Guidance

### Code Validation Commands
Always run after making changes:
- `npm run lint` - ESLint validation
- `npm run check` - Full validation (TypeScript + build + dry-run deploy)

### Architecture Context

**Frontend (`src/react-app/`)**
- Entry point: `src/react-app/main.tsx`
- React 19 with TypeScript, Vite build system

**Backend (`src/worker/`)**  
- Entry point: `src/worker/index.ts`
- Hono framework on Cloudflare Workers
- API routes at `/api/*`

**TypeScript Configuration**
Multi-environment setup with strict typing:
- `tsconfig.app.json` - React frontend
- `tsconfig.worker.json` - Cloudflare Worker
- `tsconfig.node.json` - Build tools

### Key Development Patterns

**Edge-First Architecture**: Both frontend and backend run on Cloudflare's edge network from single Workers deployment.

**API Integration**: Frontend communicates with Hono backend through `/api/*` routes.

### Testing Status
No testing framework configured.
