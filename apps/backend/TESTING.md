# Testing Guide

This guide explains how to test the Turing Machine backend at different levels.

## Table of Contents

1. [Manual Testing with cURL/HTTPie](#manual-testing)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [Test Setup](#test-setup)

---

## Manual Testing

### Prerequisites

1. **Start PostgreSQL**:
```bash
# Using Docker
docker run --name turing-postgres \
  -e DB_PASSWORD=postgres \
  -e DB_NAME=turing_machine \
  -p 5432:5432 \
  -d postgres:15

# Or use your local PostgreSQL instance
```

2. **Set Environment Variable** (optional if using defaults):
```bash
export DB_URL="postgresql://postgres:postgres@localhost:5432/turing_machine"
```

3. **Build and Start Server**:
```bash
cd apps/backend
pnpm install
pnpm build
pnpm dev
```

Server should start on `http://localhost:8080`

### Test Scenarios

#### 1. Health Check

```bash
curl http://localhost:8080/ping
# Expected: "pong\n"
```

#### 2. Create a Tape

Create a simple tape that increments binary numbers:

```bash
curl -X POST http://localhost:8080/api/tapes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "101",
    "headPosition": 0,
    "transitions": [
      {
        "currentState": "q0",
        "readSymbol": "1",
        "writeSymbol": "0",
        "moveDirection": "R",
        "nextState": "q0"
      },
      {
        "currentState": "q0",
        "readSymbol": "0",
        "writeSymbol": "1",
        "moveDirection": "R",
        "nextState": "q1"
      },
      {
        "currentState": "q0",
        "readSymbol": " ",
        "writeSymbol": "1",
        "moveDirection": "R",
        "nextState": "q1"
      },
      {
        "currentState": "q1",
        "readSymbol": "0",
        "writeSymbol": "0",
        "moveDirection": "R",
        "nextState": "q1"
      },
      {
        "currentState": "q1",
        "readSymbol": "1",
        "writeSymbol": "1",
        "moveDirection": "R",
        "nextState": "q1"
      },
      {
        "currentState": "q1",
        "readSymbol": " ",
        "writeSymbol": " ",
        "moveDirection": "L",
        "nextState": "qf"
      }
    ],
    "initialState": "q0",
    "finalStates": ["qf"]
  }'
```

**Expected Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "content": "101",
  "headPosition": 0
}
```

**Save the ID** for next steps!

#### 3. Get Tape

```bash
# Replace {ID} with the ID from step 2
curl http://localhost:8080/api/tapes/{ID}
```

**Expected Response** (200 OK):
```json
{
  "id": "...",
  "content": "101",
  "headPosition": 0,
  "currentState": "q0",
  "transitions": [...],
  "initialState": "q0",
  "finalStates": ["qf"]
}
```

#### 4. Execute a Single Step

```bash
curl -X PUT http://localhost:8080/api/tapes/{ID}/step
```

**Expected Response** (200 OK):
```json
{
  "executed": true,
  "halted": false,
  "content": "001",
  "headPosition": 1,
  "currentState": "q0"
}
```

Execute multiple times to see the machine progress:
- Step 1: Reads "1", writes "0", moves right → `content: "001"`, `headPosition: 1`
- Step 2: Reads "0", writes "1", moves right → `content: "011"`, `headPosition: 2`
- Step 3: Reads "1", writes "0", moves right → `content: "010"`, `headPosition: 3`
- And so on...

#### 5. Run Multiple Steps

```bash
curl -X PUT http://localhost:8080/api/tapes/{ID}/run \
  -H "Content-Type: application/json" \
  -d '{
    "maxSteps": 10
  }'
```

**Expected Response** (200 OK):
```json
{
  "stepsExecuted": 6,
  "halted": true,
  "reason": "Reached final state",
  "content": "110 ",
  "headPosition": 3,
  "currentState": "qf"
}
```

#### 6. Reset Tape

```bash
curl -X PUT http://localhost:8080/api/tapes/{ID}/reset \
  -H "Content-Type: application/json" \
  -d '{
    "content": "101",
    "headPosition": 0
  }'
```

**Expected Response** (200 OK):
```json
{
  "content": "101",
  "headPosition": 0,
  "currentState": "q0"
}
```

#### 7. Delete Tape

```bash
curl -X DELETE http://localhost:8080/api/tapes/{ID}
```

**Expected Response** (204 No Content)

#### 8. Error Cases

**Get non-existent tape**:
```bash
curl http://localhost:8080/api/tapes/00000000-0000-0000-0000-000000000000
# Expected: 404 Not Found
```

**Execute step on non-existent tape**:
```bash
curl -X PUT http://localhost:8080/api/tapes/00000000-0000-0000-0000-000000000000/step
# Expected: 404 Not Found
```

---

## Unit Testing

Unit tests test individual components in isolation.

### Example: Testing Tape Domain Entity

Create `src/domain/__tests__/tape.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { Tape } from "../tape.js";

describe("Tape", () => {
  it("should initialize with content and head position", () => {
    const tape = new Tape("ABC", 1);
    expect(tape.getContent()).toBe("ABC");
    expect(tape.getHeadPosition()).toBe(1);
  });

  it("should read symbol at head position", () => {
    const tape = new Tape("ABC", 0);
    expect(tape.read()).toBe("A");
    
    tape.moveRight();
    expect(tape.read()).toBe("B");
  });

  it("should write symbol at head position", () => {
    const tape = new Tape("ABC", 1);
    tape.write("X");
    expect(tape.getContent()).toBe("AXC");
  });

  it("should expand tape when writing beyond bounds", () => {
    const tape = new Tape("ABC", 0);
    tape.moveRight();
    tape.moveRight();
    tape.moveRight(); // Head at position 3
    tape.write("D");
    expect(tape.getContent()).toBe("ABCD");
  });

  it("should move head left and right", () => {
    const tape = new Tape("ABC", 1);
    tape.moveLeft();
    expect(tape.getHeadPosition()).toBe(0);
    
    tape.moveRight();
    expect(tape.getHeadPosition()).toBe(1);
  });

  it("should prevent negative head position", () => {
    const tape = new Tape("ABC", 0);
    tape.moveLeft();
    expect(tape.getHeadPosition()).toBe(0); // Clamped to 0
  });

  it("should reset to initial state", () => {
    const tape = new Tape("ABC", 1);
    tape.write("X");
    tape.moveRight();
    
    tape.reset("XYZ", 0);
    expect(tape.getContent()).toBe("XYZ");
    expect(tape.getHeadPosition()).toBe(0);
  });
});
```

### Example: Testing Turing Machine

Create `src/domain/__tests__/turing-machine.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { Tape } from "../tape.js";
import { TuringMachine, Transition } from "../turing-machine.js";

describe("TuringMachine", () => {
  it("should execute a transition step", () => {
    const tape = new Tape("1", 0);
    const transitions: Transition[] = [
      {
        currentState: "q0",
        readSymbol: "1",
        writeSymbol: "0",
        moveDirection: "R",
        nextState: "q1",
      },
    ];
    const machine = new TuringMachine(tape, transitions, "q0");

    const result = machine.executeStep();

    expect(result.executed).toBe(true);
    expect(result.halted).toBe(false);
    expect(tape.getContent()).toBe("0");
    expect(tape.getHeadPosition()).toBe(1);
    expect(machine.getCurrentState()).toBe("q1");
  });

  it("should halt when no transition found", () => {
    const tape = new Tape("X", 0);
    const transitions: Transition[] = [
      {
        currentState: "q0",
        readSymbol: "1",
        writeSymbol: "0",
        moveDirection: "R",
        nextState: "q1",
      },
    ];
    const machine = new TuringMachine(tape, transitions, "q0");

    const result = machine.executeStep();

    expect(result.executed).toBe(false);
    expect(result.halted).toBe(true);
    expect(result.reason).toBe("No transition found");
  });

  it("should halt when in final state", () => {
    const tape = new Tape("1", 0);
    const transitions: Transition[] = [];
    const machine = new TuringMachine(tape, transitions, "q0", ["q0"]);

    const result = machine.executeStep();

    expect(result.executed).toBe(false);
    expect(result.halted).toBe(true);
    expect(result.reason).toBe("Reached final state");
  });

  it("should execute multiple steps", () => {
    const tape = new Tape("11", 0);
    const transitions: Transition[] = [
      {
        currentState: "q0",
        readSymbol: "1",
        writeSymbol: "0",
        moveDirection: "R",
        nextState: "q0",
      },
      {
        currentState: "q0",
        readSymbol: " ",
        writeSymbol: " ",
        moveDirection: "L",
        nextState: "qf",
      },
    ];
    const machine = new TuringMachine(tape, transitions, "q0", ["qf"]);

    const result = machine.executeSteps(10);

    expect(result.stepsExecuted).toBeGreaterThan(0);
    expect(result.halted).toBe(true);
  });
});
```

---

## Integration Testing

Integration tests test multiple components working together.

### Example: Testing Use Cases with Mock Repository

Create `src/application/__tests__/execute-step.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { ExecuteStepUseCase } from "../use-cases/execute-step.js";
import { TapeRepository, TapeRecord } from "../../infrastructure/database/repository.js";
import { PostgresDb } from "@fastify/postgres";

// Mock repository
class MockRepository extends TapeRepository {
  private tapes: Map<string, TapeRecord> = new Map();

  async findById(id: string): Promise<TapeRecord | null> {
    return this.tapes.get(id) || null;
  }

  async update(id: string, data: any): Promise<TapeRecord | null> {
    const tape = this.tapes.get(id);
    if (!tape) return null;

    const updated = {
      ...tape,
      ...data,
      updated_at: new Date(),
    };
    this.tapes.set(id, updated);
    return updated;
  }

  // Helper to add test data
  addTape(tape: TapeRecord): void {
    this.tapes.set(tape.id, tape);
  }
}

describe("ExecuteStepUseCase", () => {
  let useCase: ExecuteStepUseCase;
  let mockRepo: MockRepository;

  beforeEach(() => {
    // Create mock with fake PostgresDb (won't be used)
    mockRepo = new MockRepository({} as PostgresDb);
    useCase = new ExecuteStepUseCase(mockRepo);
  });

  it("should execute a step and update database", async () => {
    const tapeRecord: TapeRecord = {
      id: "test-id",
      content: "1",
      head_position: 0,
      current_state: "q0",
      transitions: [
        {
          currentState: "q0",
          readSymbol: "1",
          writeSymbol: "0",
          moveDirection: "R",
          nextState: "q1",
        },
      ],
      initial_state: "q0",
      final_states: [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockRepo.addTape(tapeRecord);

    const result = await useCase.execute("test-id");

    expect(result.executed).toBe(true);
    expect(result.content).toBe("0");
    expect(result.headPosition).toBe(1);
    expect(result.currentState).toBe("q1");

    // Verify database was updated
    const updated = await mockRepo.findById("test-id");
    expect(updated?.content).toBe("0");
    expect(updated?.head_position).toBe(1);
    expect(updated?.current_state).toBe("q1");
  });

  it("should throw error if tape not found", async () => {
    await expect(useCase.execute("non-existent")).rejects.toThrow("not found");
  });
});
```

### Example: Testing API Endpoints

Create `src/__tests__/api.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createServer } from "../server.js";
import { FastifyInstance } from "fastify";

describe("API Endpoints", () => {
  let server: FastifyInstance;
  let tapeId: string;

  beforeAll(async () => {
    server = await createServer();
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it("should create a tape", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/tapes",
      payload: {
        content: "101",
        headPosition: 0,
        transitions: [
          {
            currentState: "q0",
            readSymbol: "1",
            writeSymbol: "0",
            moveDirection: "R",
            nextState: "q1",
          },
        ],
        initialState: "q0",
        finalStates: [],
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty("id");
    expect(body.content).toBe("101");
    tapeId = body.id;
  });

  it("should get a tape", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/api/tapes/${tapeId}`,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.id).toBe(tapeId);
    expect(body.content).toBe("101");
  });

  it("should execute a step", async () => {
    const response = await server.inject({
      method: "PUT",
      url: `/api/tapes/${tapeId}/step`,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty("executed");
    expect(body).toHaveProperty("content");
    expect(body).toHaveProperty("headPosition");
  });

  it("should return 404 for non-existent tape", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/api/tapes/00000000-0000-0000-0000-000000000000",
    });

    expect(response.statusCode).toBe(404);
  });
});
```

---

## Test Setup

### Install Testing Dependencies

```bash
cd apps/backend
pnpm add -D vitest @vitest/ui
```

### Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
```

### Update `package.json` scripts:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

---

## Test Database Setup

For integration tests, use a test database:

```typescript
// tests/setup.ts
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function setupTestDatabase() {
  process.env.DB_URL = "postgresql://postgres:postgres@localhost:5432/turing_machine_test";
  // Optionally run migrations or seed data
}

export async function teardownTestDatabase() {
  // Clean up test data
}
```

---

## Best Practices

1. **Unit Tests**: Test domain logic in isolation (no database, no HTTP)
2. **Integration Tests**: Test use cases with mock repositories
3. **E2E Tests**: Test full API with real database (use test DB)
4. **Test Data**: Use factories or builders for test data
5. **Cleanup**: Always clean up test data after tests
6. **Isolation**: Each test should be independent

---

## Example Test Scenarios

### Scenario 1: Binary Increment Machine

Test a machine that increments a binary number:

```typescript
// Test that "101" (5) becomes "110" (6)
const tape = new Tape("101", 2); // Start at rightmost bit
// ... transitions for binary increment ...
// Assert final content is "110"
```

### Scenario 2: Palindrome Checker

Test a machine that checks if input is a palindrome:

```typescript
const tape = new Tape("aba", 0);
// ... transitions for palindrome checking ...
// Assert machine halts in accepting state for "aba"
```

### Scenario 3: Edge Cases

- Empty tape
- Head at boundary
- No matching transitions
- Infinite loop detection (max steps)
