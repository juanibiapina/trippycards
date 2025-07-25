# Instructions for Claude

## Working with the application

### Documentation

Consult documentation in `docs` directory to understand user requests.

Structure:
  - docs/api: API documentation
  - docs/flows: User paths through the application, each with a corresponding integration test
  - docs/guides: Codebase specific guides, including tech choices, design choices, standards, libraries or general code guidelines
  - docs/tickets: multi-day work with several commits, feature development, planning

### Development commands

- Prefer running `bin/ci` to run full integration test suite including linter, unit tests and integration tests

### Checking server logs

`npm run dev` is always running on the current tmux session (`dev tmux session-info`), window `5:dev` (http://localhost:5173).
Read the contents of that pane to access local server logs.
