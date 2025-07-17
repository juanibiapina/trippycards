# Cleanup: Removing Bottom Bar and Questions Page

## Goal

Remove the bottom navigation bar and questions page functionality from the Travel Cards application to simplify the user interface and focus on the core card management features.

## Steps

### Step 1. Remove Bottom Navigation Component and Questions Page ✅

**Goal:** Remove bottom navigation bar and questions page functionality to simplify UI

**Main changes:**
- Deleted BottomBar component (`src/react-app/components/BottomBar.tsx`) and its tests
- Removed QuestionsPage component (`src/react-app/pages/QuestionsPage.tsx`)
- Updated routing in main.tsx to remove questions route
- Removed bottom bar from OverviewPage
- Deleted related e2e tests (activity-questions.spec.ts, bottom-navigation.spec.ts)
- Updated remaining e2e tests to remove bottom bar interactions

**Commit:** [856cb7d](https://github.com/juanibiapina/cf-travelcards/commit/856cb7d) - feat: Remove questions and bottom bar from UI

### Step 2. Remove Backend Questions Infrastructure and Data Models

**Goal:** Complete the cleanup by removing all remaining questions-related code from the backend, data models, and frontend hooks to fully focus on card management features.

**Main changes:**
- Remove `questions` field from Activity interface in `src/shared/index.ts`
- Remove `Question` interface definition and related message types
- Remove question methods (`addQuestion`, `submitVote`) from `src/worker/activity.ts`
- Remove question and vote message handling from worker
- Remove question handling code from `src/react-app/hooks/useActivityRoom.ts`
- Update `createEmptyActivity()` to not initialize questions

**Commit:** [e00ca29](https://github.com/juanibiapina/cf-travelcards/commit/e00ca29) - feat: Remove questions backend infrastructure

### Step 3. Clean Up Documentation References ✅

**Goal:** Remove outdated questions/QuestionCard references from project documentation to complete the cleanup process.

**Main changes:**
- Updated `docs/COLOR_GUIDE.md` to remove QuestionCard component section and voting-specific color references
- Updated `docs/prompt.md` to remove questions field references from Activity model and QuestionCard functionality descriptions
- Generalized color usage guidelines to focus on success/error states rather than voting-specific functionality

**Commit:** [7d3bbe7](https://github.com/juanibiapina/cf-travelcards/commit/7d3bbe7) - docs: Clean up questions references in documentation
