# Turing Machine Backend - Unary Addition Machine

A clean architecture implementation of a unary addition Turing Machine backend using Fastify, PostgreSQL, and Drizzle ORM.

This backend implements a simple unary addition machine that transforms unary symbols (`_` = 1) according to specific transition rules.

## Subject Requirements

This backend implements the unary addition machine as specified:

- **Initial Tape**: `["_", "_", "_", "_", "_", "_", "1"]` (represented as `"______1"`)
- **Initial State**: `"A"`
- **Head Position**: `0`
- **Transition Rules**:
  - `A + _ → write 1, move right (→), stay in A`
  - `A + 1 → write 1, no move, go to HALT`
- **Final State**: `["HALT"]`

**Unary Notation**: The symbol `_` represents 1 in unary notation.

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed explanation of the architecture, design decisions, and data flow
- **[TESTING.md](./TESTING.md)** - Comprehensive testing guide with examples
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference for testing the API

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+ (or Docker)
- pnpm (or npm/yarn)

### Setup

1. **Install dependencies**:
```bash
pnpm install
```

2. **Start PostgreSQL** (using Docker):
```bash
docker run --name turing-postgres \
  -e DB_PASSWORD=postgres \
  -e DB_NAME=turing_machine \
  -p 5432:5432 \
  -d postgres:15
```

3. **Configure environment**:
Create a `.env.dev` file at the root of the monorepo with:
```bash
DB_URL=postgresql://postgres:postgres@localhost:5432/turing_machine
BACKEND_PORT=8080
BACKEND_HOST=0.0.0.0
```

4. **Initialize database schema**:
```bash
# Push schema to database (creates tables)
pnpm db:push

# Or generate and run migrations
pnpm db:generate
pnpm db:migrate
```

5. **Build and run**:
```bash
pnpm build
pnpm dev
```

Server will start on `http://localhost:8080`

## Testing

### Automated API Tests

Run the test script (requires server to be running):

```bash
pnpm test:api
```

Or manually:
```bash
node test-api.js
```

### Manual Testing

See [QUICK_START.md](./QUICK_START.md) for cURL examples.

### Health Check

```bash
curl http://localhost:8080/ping
# Expected: "pong\n"
```

## Project Structure

```
src/
├── modules/              # Feature modules (modular architecture)
│   ├── tape/            # Tape module
│   │   ├── domains/     # Domain layer (business logic)
│   │   │   ├── tape.ts
│   │   │   └── turing-machine.ts
│   │   ├── shemas/      # Drizzle ORM schemas
│   │   │   └── tape.ts
│   │   ├── infrastructure/ # Infrastructure layer
│   │   │   ├── interface.ts
│   │   │   └── repositories/
│   │   │       └── postgresql.ts
│   │   └── application/ # Application layer
│   │       └── controller.ts
│   └── index.schemas.ts # Schema exports
│
├── domain/              # Core domain logic (shared)
│   ├── tape.ts         # Tape entity
│   └── turing-machine.ts # Turing machine logic
│
├── infrastructure/      # External concerns
│   └── database/
│       └── index.ts     # Database client and exports
│
├── application/         # Application layer (use cases and controllers)
│   ├── controllers/    # HTTP controllers
│   │   ├── tape-controllers.ts
│   │   └── tapes-controller.ts
│   └── use-cases/      # Business workflows
│       ├── create-tape.ts
│       ├── get-tape.ts
│       ├── execute-step.ts
│       ├── run-machine.ts
│       ├── reset-tape.ts
│       └── delete-tape.ts
│
├── utils/              # Utility functions
│   ├── db/            # Database utilities
│   │   └── postgresql.ts
│   └── routes.ts      # Route utilities
│
├── tests/              # Test files
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   ├── helpers/
│   └── mocks/
│
├── server.ts          # Server assembly and configuration
└── index.ts           # Entry point
```

docker run --name turing-postgres \
  -e DB_PASSWORD=postgres \
  -e DB_NAME=turing_machine \
  -p 5432:5432 \
  -d postgres:15 `POST` | `/api/tapes` | Create a new tape |
| `GET` | `/api/tapes/:id` | Get tape by ID |
| `PUT` | `/api/tapes/:id/step` | Execute a single step |
| `PUT` | `/api/tapes/:id/run` | Execute multiple steps |
| `PUT` | `/api/tapes/:id/reset` | Reset tape to initial state |
| `DELETE` | `/api/tapes/:id` | Delete tape |

See [QUICK_START.md](./QUICK_START.md) for detailed examples.

## Architecture

This project follows **Clean Architecture** (Hexagonal Architecture) principles with a modular structure:

- **Domain Layer**: Pure business logic, no external dependencies
- **Infrastructure Layer**: Database access, external services, repository implementations
- **Application Layer**: Use cases and HTTP controllers
- **Server Layer**: Wiring everything together

Dependencies flow **inward**: Domain has no dependencies, Infrastructure depends on Domain, Application depends on both.

The codebase is organized by **modules** (feature-based) with each module containing its own domain, infrastructure, and application layers.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed explanation.

## Configuration

### Environment Variables

The backend reads environment variables from `.env.dev` at the root of the monorepo:

- `DB_URL`: PostgreSQL connection string
  - Default: `postgresql://postgres:postgres@localhost:5432/turing_machine`
- `BACKEND_PORT`: Server port
  - Default: `8080`
- `BACKEND_HOST`: Server host
  - Default: `0.0.0.0`

### Available Scripts

- `pnpm build` - Compile TypeScript and build the project
- `pnpm dev` - Start development server with hot reload (nodemon)
- `pnpm start` - Build and run the production server
- `pnpm check-types` - Type check without emitting files
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes directly to database
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

## Example: Creating and Running the Unary Addition Machine

### Create a Tape (Uses Defaults)

The backend provides defaults matching the unary addition machine subject:
ash
# Create a tape with default values (no body needed)
curl -X POST http://localhost:8080/api/tapes \
  -H "Content-Type: application/json"

# Default values:
# - content: "______1" (6 underscores + "1")
# - headPosition: 0
# - state: "A"
# - transitions: [
#     {currentState: "A", readSymbol: "_", writeSymbol: "1", moveDirection: "R", nextState: "A"},
#     {currentState: "A", readSymbol: "1", writeSymbol: "1", moveDirection: "R", nextState: "HALT"}
#   ]
# - finalStates: ["HALT"]### Custom Tape (Optional)

You can also create a custom tape:

curl -X POST http://localhost:8080/api/tapes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "______1",
    "headPosition": 0,
    "transitions": [
      {
        "currentState": "A",
        "readSymbol": "_",
        "writeSymbol": "1",
        "moveDirection": "R",
        "nextState": "A"
      },
      {
        "currentState": "A",
        "readSymbol": "1",
        "writeSymbol": "1",
        "moveDirection": "R",
        "nextState": "HALT"
      }
    ],
    "initialState": "A",
    "finalStates": ["HALT"]
  }'### Execute Steps

# Save the returned ID, then execute one step
curl -X PUT http://localhost:8080/api/tapes/{ID}/step

# Or execute multiple steps
curl -X PUT http://localhost:8080/api/tapes/{ID}/run \
  -H "Content-Type: application/json" \
  -d '{"maxSteps": 10}'## Key Concepts

### Unary Addition Machine Rules

This backend implements a specific unary addition machine with these transition rules:

| State | Read Symbol | Write | Move | New State |
|-------|-------------|-------|------|-----------|
| A     | _           | 1     | → (right) | A         |
| A     | 1           | 1     | (no move) | HALT (end) |

**Unary Notation**: The symbol `_` represents 1 in unary notation.

### Transition Rule Format

A transition rule defines what happens when the machine is in a certain state and reads a certain symbol:

{
  currentState: "A",       // Current state ("A" for this machine)
  readSymbol: "_",         // Symbol read from tape ("_" or "1")
  writeSymbol: "1",        // Symbol to write
  moveDirection: "R",      // Move head Left ("L") or Right ("R")
  nextState: "A"           // State to transition to ("A" or "HALT")
}### Tape

The tape is an array of cells. For the unary addition machine:
- Default tape: `["_", "_", "_", "_", "_", "_", "1"]` (represented as string `"______1"`)
- Symbols: `_` (unary 1) and `1` (marker)
- Head starts at position 0

### States

- **Initial State**: `"A"` - The machine starts in state A
- **Current State**: The machine's current state during execution (`"A"` or `"HALT"`)
- **Final States**: `["HALT"]` - When the machine reads `1` in state A, it halts without moving

## Troubleshooting

**Server won't start?**
- Check PostgreSQL is running: `docker ps | grep postgres`
- Verify DB_URL is correct in `.env.dev`
- Check port 8080 is available
- Check server logs for error messages

**Database connection errors?**
- Ensure PostgreSQL is accessible
- Check connection string format: `postgresql://user:password@host:port/database`
- Verify database `turing_machine` exists
- Run `pnpm db:push` to create tables if schema is missing

**404 errors?**
- Verify tape ID exists in the database
- Check URL path is correct (`/api/tapes/...`)
- Ensure the server is running

**500 errors?**
- Check server logs for detailed error messages
- Verify database schema was created (`pnpm db:push`)
- Check request body format matches API expectations
- Verify all required fields are provided

**Type errors during build?**
- Run `pnpm check-types` to see all TypeScript errors
- Ensure all dependencies are installed: `pnpm install`
- Check that path aliases are correctly configured in `tsconfig.json`

**Environment variables not loading?**
- Ensure `.env.dev` exists at the root of the monorepo
- Check that the file path in `src/index.ts` is correct
- Verify variable names match (`BACKEND_PORT`, `BACKEND_HOST`, `DB_URL`)

## Learn More

- [Clean Architecture Explained](./ARCHITECTURE.md)
- [Testing Guide](./TESTING.md)
- [API Quick Reference](./QUICK_START.md)

## Educational Value

This project demonstrates:

- Clean Architecture / Hexagonal Architecture
- Modular architecture with feature-based organization
- Repository Pattern
- Use Case Pattern
- Dependency Injection
- Domain-Driven Design principles
- TypeScript best practices
- Fastify framework usage
- Drizzle ORM integration
- PostgreSQL database management
- RESTful API design

Perfect for learning how to structure a maintainable, testable backend application!