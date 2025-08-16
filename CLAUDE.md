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

- Use `npm run test:e2e -- --project=chrome-mobile <filename>` to run a single integration test
- Use `bin/ci` to run full integration test suite including building, linter, unit tests and integration tests

### Checking server logs

`npm run dev` is always running on the current tmux session (`dev tmux session-info`), window `5:dev` (http://localhost:5173).
Read the contents of that pane to access local server logs.

### Testing in production

- Use `bin/deploy` to deploy the application to production
- Access production at https://trippycards.com to verify changes

### Production sign-in

Production credentials are stored in `.env.local`:
- Email: `PRODUCTION_USER_EMAIL` (juanibiapina+production@gmail.com)
- Password: `PRODUCTION_USER_PASSWORD`

To sign in to production:
1. Navigate to https://trippycards.com
2. Use the production credentials from `.env.local`
3. Complete the login flow
