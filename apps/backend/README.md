# Turing Machine Backend - Machine d'Addition Unaire

A clean architecture implementation of a unary addition Turing Machine backend using Fastify, PostgreSQL, and Drizzle ORM.

This backend implements a simple unary addition machine that transforms unary symbols (`_` = 1) according to specific transition rules.

## 🎯 Subject Requirements

This backend implements the unary addition machine as specified:

- **Initial Tape**: `["_", "_", "_", "_", "_", "_", "1"]` (represented as `"______1"`)
- **Initial State**: `"A"`
- **Head Position**: `0`
- **Transition Rules**:
  - `A + _ → write 1, move right (→), stay in A`
  - `A + 1 → write 1, no move, go to HALT`
- **Final State**: `["HALT"]`

**Notation unaire**: Le symbole `_` représente 1 en notation unaire.

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed explanation of the architecture, design decisions, and data flow
- **[TESTING.md](./TESTING.md)** - Comprehensive testing guide with examples
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference for testing the API

## 🚀 Quick Start

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

3. **Configure environment** (optional):
```bash
export DB_URL="postgresql://postgres:postgres@localhost:5432/turing_machine"
export PORT=8080
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

## 🧪 Testing

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

## 📁 Project Structure

```
src/
├── domain/              # Core business logic (no dependencies)
│   ├── tape.ts         # Tape entity
│   └── turing-machine.ts # Turing machine logic
│
├── infrastructure/      # External concerns
│   └── database/
│       ├── schema.ts      # Drizzle ORM schema
│       ├── client.ts      # Database client setup
│       ├── repository.ts  # Repository implementation
│       └── index.ts       # Database exports
│
├── application/         # Use cases and controllers
│   ├── use-cases/      # Business workflows
│   │   ├── create-tape.ts
│   │   ├── get-tape.ts
│   │   ├── execute-step.ts
│   │   ├── run-machine.ts
│   │   ├── reset-tape.ts
│   │   └── delete-tape.ts
│   └── controllers/
│       └── tapes-controller.ts  # HTTP handlers
│
├── server.ts           # Server assembly
└── index.ts            # Entry point
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/ping` | Health check |
| `POST` | `/api/tapes` | Create a new tape |
| `GET` | `/api/tapes/:id` | Get tape by ID |
| `PUT` | `/api/tapes/:id/step` | Execute a single step |
| `PUT` | `/api/tapes/:id/run` | Execute multiple steps |
| `PUT` | `/api/tapes/:id/reset` | Reset tape to initial state |
| `DELETE` | `/api/tapes/:id` | Delete tape |

See [QUICK_START.md](./QUICK_START.md) for detailed examples.

## 🏗️ Architecture

This project follows **Clean Architecture** (Hexagonal Architecture) principles:

- **Domain Layer**: Pure business logic, no external dependencies
- **Infrastructure Layer**: Database access, external services
- **Application Layer**: Use cases and HTTP controllers
- **Server Layer**: Wiring everything together

Dependencies flow **inward**: Domain has no dependencies, Infrastructure depends on Domain, Application depends on both.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed explanation.

## 🔧 Configuration

### Environment Variables

- `DB_URL`: PostgreSQL connection string
  - Default: `postgresql://postgres:postgres@localhost:5432/turing_machine`
- `PORT`: Server port
  - Default: `8080`
- `HOST`: Server host
  - Default: `0.0.0.0`

## 📝 Example: Creating and Running the Unary Addition Machine

### Create a Tape (Uses Defaults)

The backend provides defaults matching the unary addition machine subject:

```bash
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
# - finalStates: ["HALT"]
```

### Custom Tape (Optional)

You can also create a custom tape:

```bash
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
  }'
```

### Execute Steps

```bash
# Save the returned ID, then execute one step
curl -X PUT http://localhost:8080/api/tapes/{ID}/step

# Or execute multiple steps
curl -X PUT http://localhost:8080/api/tapes/{ID}/run \
  -H "Content-Type: application/json" \
  -d '{"maxSteps": 10}'
```

## 🧩 Key Concepts

### Unary Addition Machine Rules

This backend implements a specific unary addition machine with these transition rules:

| État | Symbole lu | Écrire | Déplacer | Nouvel état |
|------|------------|--------|----------|-------------|
| A    | _          | 1      | → (droite) | A           |
| A    | 1          | 1      | (pas de déplacement) | HALT (fin) |

**Notation unaire**: Le symbole `_` représente 1 en notation unaire.

### Transition Rule Format

A transition rule defines what happens when the machine is in a certain state and reads a certain symbol:

```typescript
{
  currentState: "A",       // Current state ("A" for this machine)
  readSymbol: "_",        // Symbol read from tape ("_" or "1")
  writeSymbol: "1",       // Symbol to write
  moveDirection: "R",      // Move head Left ("L") or Right ("R")
  nextState: "A"           // State to transition to ("A" or "HALT")
}
```

### Tape

The tape is an array of cells. For the unary addition machine:
- Default tape: `["_", "_", "_", "_", "_", "_", "1"]` (represented as string `"______1"`)
- Symbols: `_` (unary 1) and `1` (marker)
- Head starts at position 0

### States

- **Initial State**: `"A"` - The machine starts in state A
- **Current State**: The machine's current state during execution (`"A"` or `"HALT"`)
- **Final States**: `["HALT"]` - When the machine reads `1` in state A, it halts without moving

## 🐛 Troubleshooting

**Server won't start?**
- Check PostgreSQL is running: `docker ps | grep postgres`
- Verify DB_URL is correct
- Check port 8080 is available

**Database connection errors?**
- Ensure PostgreSQL is accessible
- Check connection string format
- Verify database `turing_machine` exists
- Run `pnpm db:push` to create tables if schema is missing

**404 errors?**
- Verify tape ID exists
- Check URL path is correct (`/api/tapes/...`)

**500 errors?**
- Check server logs for details
- Verify database schema was created
- Check request body format

## 📚 Learn More

- [Clean Architecture Explained](./ARCHITECTURE.md)
- [Testing Guide](./TESTING.md)
- [API Quick Reference](./QUICK_START.md)

## 🎓 Educational Value

This project demonstrates:

- Clean Architecture / Hexagonal Architecture
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
