# Tests Directory

This directory contains all unit tests for the backend application.

## Structure

```
tests/
├── domain/              # Domain layer tests (pure business logic)
│   ├── tape.test.ts
│   └── turing-machine.test.ts
├── application/         # Application layer tests
│   ├── use-cases/      # Use case tests (mock repositories)
│   │   ├── create-tape.test.ts
│   │   ├── get-tape.test.ts
│   │   ├── delete-tape.test.ts
│   │   ├── reset-tape.test.ts
│   │   ├── execute-steps.test.ts
│   │   └── run-machine.test.ts
│   └── controllers/    # Controller tests (mock use cases)
│       └── tape-controllers.test.ts
├── infrastructure/      # Infrastructure layer tests
│   └── database/
│       ├── repository.test.ts
│       └── client.test.ts
├── helpers/            # Test utilities and helpers
│   └── test-helpers.ts
└── mocks/              # Mock factories and implementations
    └── repository-mocks.ts
```

## Quick Start

1. Read the [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed instructions
2. Create test files following the naming convention: `*.test.ts`
3. Use Chai for assertions, Sinon for spies/stubs/mocks
4. Run tests with `pnpm test`

## Test Naming Convention

- Test files: `*.test.ts` (e.g., `tape.test.ts`)
- Test suites: `describe('ClassName', () => { ... })`
- Test cases: `it('should do something', () => { ... })`

## Example Test File Structure

```typescript
import { expect } from 'chai';
import * as sinon from 'sinon';
// Import what you're testing
import { ClassToTest } from '../../path/to/class.js';

describe('ClassToTest', () => {
  // Setup before each test
  beforeEach(() => {
    // Initialize test data, mocks, etc.
  });

  // Cleanup after each test
  afterEach(() => {
    sinon.restore();
  });

  describe('methodName()', () => {
    it('should do something specific', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

