# Home Finances Application

A personal finance management application built with modern web technologies.

## Tech Stack

### Core Technologies

- **Runtime**: [Bun](https://bun.sh) (v1.x)
- **Database**: SQLite with [Kysely](https://kysely.dev) ORM
- **FE/BE**: Hono JSX with TypeScript
- **Styling**: Tailwind + DaisyUI
- **Testing**: Jest + Bun Test Runner
- **Deployment**: Dockerized deployment to [Fly.io](https://fly.io)

### Key Libraries

- **Database**: Kysely (type-safe SQL query builder)
- **State Management**: Alpine.js + HTMX
- **Authentication**: Session-based authentication with JWT tokens. Sessions are stored in cookies, and JWT tokens are used for stateless verification of user identity.

## Project Structure

```
.
├── src/
│   ├── components/      # Reusable React components
│   ├── client/          # Client-side code compiled separetely
│   ├── consts/          # Application constants
│   ├── db/              # Database configuration and migrations
│   ├── middleware/      # Server middleware
│   ├── pages/           # Page components
│   ├── routes/          # Route handlers
│   ├── services/        # Business logic services
│   ├── styles/          # Global CSS styles
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── tests/               # Test suites
├── static/              # Static assets
└── scripts/             # Development scripts
```

## Development Setup

For local development:

1. Install dependencies:

```bash
bun install
```

2. Run database migrations:

```bash
bun run migrate:up
```

3. Start development server:

```bash
bun run dev
```

4. Run tests:

```bash
bun test
```

## Deployment

1. Build Docker image:

```bash
docker build -t maney .
```

2. Deploy to Fly.io:

```bash
fly deploy
```

## License

MIT
