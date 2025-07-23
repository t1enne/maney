# AGENTS.md

## Build/Test/Lint Commands
- `bun run dev`: Start development server
- `bun test`: Run all tests (Jest)
- `bun test <filename>`: Run a single test file
- `bun run migrate:up`: Run database migrations
- `bun run seed`: Seed the database

## Code Style Guidelines
- **Imports**: Group imports by source (external, internal) and alphabetize.
- **Types**: Use TypeScript interfaces/types for all models and props.
- **Naming**: Use PascalCase for components/types, camelCase for functions/variables.
- **Error Handling**: Use `neverthrow` or `invariant` for explicit error handling.
- **Formatting**: Prefer arrow functions for components, explicit return types for functions.
- **Database**: Use Kysely for type-safe SQL queries.

## Conventions
- Components are in `/src/components`.
- Services handle business logic in `/src/services`.
- Database models are in `/src/types/models`.
- Use `zod` for runtime validation.

🤖 Generated with [opencode](https://opencode.ai)