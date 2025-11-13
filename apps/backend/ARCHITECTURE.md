# Backend Architecture Explanation

## Overview

This backend implements a **Clean Architecture** (also known as Hexagonal Architecture) for a Turing Machine simulator. The architecture separates concerns into distinct layers, making the code maintainable, testable, and independent of external frameworks.

## Architecture Layers

### 1. Domain Layer (`src/domain/`)

**Purpose**: Contains the core business logic and entities. This layer has **zero dependencies** on external frameworks or infrastructure.

#### `tape.ts` - The Tape Entity

The `Tape` class represents the infinite tape of a Turing machine:

- **State**: 
  - `cells: string[]` - Array of symbols on the tape
  - `headPosition: number` - Current position of the read/write head

- **Key Behaviors**:
  - `read()`: Returns the symbol currently under the head (returns blank " " if out of bounds)
  - `write(symbol)`: Writes a symbol at the current head position (expands tape if needed)
  - `moveLeft()` / `moveRight()`: Moves the head (prevents negative positions)
  - `reset()`: Resets tape to initial state

**Design Decisions**:
- Tape automatically expands when writing beyond current bounds
- Head position is clamped to prevent negative values
- Blank symbol is represented as space " " character
- Methods return defensive copies to prevent external mutation

#### `turing-machine.ts` - The Turing Machine Logic

The `TuringMachine` class implements the execution rules:

- **State**:
  - `tape: Tape` - The tape being operated on
  - `currentState: string` - Current state (e.g., "q0", "q1")
  - `transitions: Transition[]` - Array of transition rules
  - `initialState: string` - Starting state
  - `finalStates: Set<string>` - Accepting/halting states

- **Transition Interface**:
```typescript
{
  currentState: string;    // State we're in
  readSymbol: string;      // Symbol we read from tape
  writeSymbol: string;     // Symbol we write to tape
  moveDirection: "L" | "R"; // Direction to move head
  nextState: string;       // State to transition to
}
```

- **Key Behaviors**:
  - `executeStep()`: Executes one transition rule
    1. Check if in final state → halt
    2. Read current symbol from tape
    3. Find matching transition rule
    4. Write symbol, move head, change state
    5. Return execution result
  
  - `executeSteps(maxSteps)`: Runs multiple steps until halt or limit reached

**Design Decisions**:
- Returns structured results with `executed`, `halted`, and `reason` fields
- Prevents infinite loops with max steps limit
- Separates concerns: machine logic vs. tape operations

---

### 2. Infrastructure Layer (`src/infrastructure/`)

**Purpose**: Handles external concerns like database access. This layer depends on the domain but domain doesn't depend on it (dependency inversion).

#### `database/repository.ts` - PostgreSQL Repository

The `TapeRepository` class implements the Repository pattern:

- **Responsibilities**:
  - Database schema initialization
  - CRUD operations (Create, Read, Update, Delete)
  - Mapping between database rows and domain objects

- **Database Schema**:
```sql
tapes (
  id UUID PRIMARY KEY,
  content TEXT,              -- Tape content as string
  head_position INTEGER,      -- Current head position
  current_state TEXT,        -- Current machine state
  transitions JSONB,         -- Array of transition rules
  initial_state TEXT,        -- Starting state
  final_states TEXT[],       -- Array of final states
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

- **Key Methods**:
  - `initialize()`: Creates table if it doesn't exist
  - `create(data)`: Inserts new tape record
  - `findById(id)`: Retrieves tape by UUID
  - `update(id, data)`: Updates specific fields
  - `delete(id)`: Removes tape record

**Design Decisions**:
- Uses parameterized queries to prevent SQL injection
- Always releases database connections in `finally` blocks
- Handles JSONB serialization/deserialization for transitions
- Maps database snake_case to TypeScript camelCase

---

### 3. Application Layer (`src/application/`)

**Purpose**: Contains use cases (business workflows) and controllers (HTTP handling). This layer orchestrates domain and infrastructure.

#### Use Cases (`use-cases/`)

Each use case represents a single business operation:

1. **CreateTapeUseCase**: Creates a new tape in the database
2. **GetTapeUseCase**: Retrieves tape by ID
3. **ExecuteStepUseCase**: 
   - Loads tape from database
   - Reconstructs domain objects (Tape + TuringMachine)
   - Executes one step
   - Saves updated state back to database
4. **RunMachineUseCase**: Same as ExecuteStep but runs multiple steps
5. **ResetTapeUseCase**: Resets tape to initial state
6. **DeleteTapeUseCase**: Removes tape from database

**Pattern**: Each use case follows this flow:
1. Load data from repository
2. Reconstruct domain objects
3. Execute domain logic
4. Persist changes back to repository

#### Controllers (`controllers/`)

The `TapesController` handles HTTP requests:

- **Responsibilities**:
  - Parse HTTP requests (body, params)
  - Call appropriate use case
  - Format HTTP responses
  - Handle errors and return proper status codes

- **Route Registration**:
  - `POST /api/tapes` → CreateTapeUseCase
  - `GET /api/tapes/:id` → GetTapeUseCase
  - `PUT /api/tapes/:id/step` → ExecuteStepUseCase
  - `PUT /api/tapes/:id/run` → RunMachineUseCase
  - `PUT /api/tapes/:id/reset` → ResetTapeUseCase
  - `DELETE /api/tapes/:id` → DeleteTapeUseCase

**Design Decisions**:
- Controllers are thin - they just delegate to use cases
- Error handling with proper HTTP status codes (404, 500, etc.)
- Type-safe request/response handling with TypeScript

---

### 4. Server Layer (`src/server.ts` & `src/index.ts`)

**Purpose**: Wires everything together and starts the server.

#### `server.ts` - Server Assembly

The `createServer()` function:

1. **Creates Fastify instance** with logging enabled
2. **Registers PostgreSQL plugin** with connection string
3. **Initializes repository** and creates database schema
4. **Creates use cases** (injecting repository dependency)
5. **Creates controller** (injecting all use cases)
6. **Registers routes** via controller
7. **Returns configured server**

#### `index.ts` - Entry Point

- Reads environment variables (PORT, HOST, DB_URL)
- Calls `createServer()`
- Starts listening on specified port
- Handles startup errors gracefully

---

## Dependency Flow

```
┌─────────────────────────────────────────┐
│         HTTP Request (Fastify)          │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Controllers (Application)          │
│  - Parse requests                        │
│  - Call use cases                        │
│  - Format responses                      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Use Cases (Application)            │
│  - Orchestrate business logic           │
│  - Coordinate domain + infrastructure    │
└───────┬───────────────────┬─────────────┘
        │                   │
        ▼                   ▼
┌──────────────┐   ┌──────────────────────┐
│   Domain     │   │   Infrastructure     │
│              │   │                      │
│ - Tape       │   │ - Repository         │
│ - Turing     │   │ - Database           │
│   Machine    │   │ - PostgreSQL         │
└──────────────┘   └──────────────────────┘
        │                   │
        └─────────┬─────────┘
                  │
                  ▼
            PostgreSQL Database
```

**Key Principle**: Dependencies point **inward**. Domain has no dependencies. Infrastructure depends on domain. Application depends on both. Server depends on everything.

---

## Data Flow Example: Executing a Step

1. **HTTP Request**: `PUT /api/tapes/123/step`
2. **Controller** (`tapes-controller.ts`):
   - Extracts `id` from URL params
   - Calls `executeStepUseCase.execute("123")`
3. **Use Case** (`execute-step.ts`):
   - Calls `repository.findById("123")` → Gets `TapeRecord`
   - Creates `Tape` domain object from record
   - Creates `TuringMachine` domain object
   - Calls `machine.executeStep()` → Domain logic executes
   - Calls `repository.update()` → Saves new state
4. **Repository** (`repository.ts`):
   - Executes SQL UPDATE query
   - Returns updated `TapeRecord`
5. **Use Case** returns result to Controller
6. **Controller** formats JSON response
7. **HTTP Response**: `200 OK` with tape state

---

## Benefits of This Architecture

1. **Testability**: Domain logic can be tested without database or HTTP
2. **Maintainability**: Clear separation of concerns
3. **Flexibility**: Can swap PostgreSQL for MongoDB without changing domain
4. **Independence**: Domain logic is framework-agnostic
5. **Scalability**: Easy to add new use cases or endpoints

---

## Key Design Patterns Used

1. **Repository Pattern**: Abstracts database access
2. **Use Case Pattern**: Encapsulates business workflows
3. **Dependency Injection**: Use cases receive repository, controller receives use cases
4. **Dependency Inversion**: Domain defines interfaces, infrastructure implements them

---

## Environment Variables

- `DB_URL`: PostgreSQL connection string (default: `postgresql://postgres:postgres@localhost:5432/turing_machine`)
- `PORT`: Server port (default: `8080`)
- `HOST`: Server host (default: `0.0.0.0`)
