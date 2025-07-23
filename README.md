# Home Finances Application

A personal finance management application built with modern web technologies.

## Tech Stack

### Core Technologies

- **Runtime**: [Bun](https://bun.sh) (v1.x)
- **Database**: SQLite with [Kysely](https://kysely.dev) ORM
- **FE/BE**: Hono JSX with TypeScript
- **Styling**: Vanilla CSS + CSS Modules
- **Testing**: Jest + Bun Test Runner
- **Deployment**: Dockerized deployment to [Fly.io](https://fly.io)

### Authentication Flow

1. **Login**: Users submit credentials, which are verified against the database.
2. **Session Creation**: A session is created and stored in the database, and a JWT token is generated.
3. **Cookie Storage**: The JWT token is stored in an HTTP-only cookie for secure client-side access.
4. **Verification**: Subsequent requests include the cookie, and the JWT is verified to authenticate the user.
5. **Logout**: Sessions are invalidated, and the cookie is cleared.

### Key Libraries

- **Database**: Kysely (type-safe SQL query builder)
- **State Management**: Alpine.js + HTMX
- **Routing**: File-based routing system
- **Authentication**: Session-based authentication with JWT tokens. Sessions are stored in cookies, and JWT tokens are used for stateless verification of user identity.
- **UI Components**: DaisyUI

## Project Structure

```
.
├── src/
│   ├── components/      # Reusable React components
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
docker build -t home-finances .
```

2. Deploy to Fly.io:

```bash
fly deploy
```

## License

MIT
