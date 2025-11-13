# Quick Start Guide

## Setup (One-Time)

1. **Install Dependencies**:
```bash
cd apps/backend
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

3. **Build and Start Server**:
```bash
pnpm build
pnpm dev
```

Server runs on `http://localhost:8080`

---

## Quick Test Commands

### 1. Health Check
```bash
curl http://localhost:8080/ping
```

### 2. Create a Tape (Unary Addition Machine)

**Simple way - uses defaults:**

```bash
# Create with default unary addition machine configuration
curl -X POST http://localhost:8080/api/tapes \
  -H "Content-Type: application/json"
```

**Or specify explicitly:**

```bash
curl -X POST http://localhost:8080/api/tapes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "______1",
    "headPosition": 0,
    "transitions": [
      {"currentState": "A", "readSymbol": "_", "writeSymbol": "1", "moveDirection": "R", "nextState": "A"},
      {"currentState": "A", "readSymbol": "1", "writeSymbol": "1", "moveDirection": "R", "nextState": "HALT"}
    ],
    "initialState": "A",
    "finalStates": ["HALT"]
  }'
```

**Default values:**
- Tape: `"______1"` (6 underscores + "1")
- Head: `0`
- State: `"A"`
- Transitions: A+_→1 (move right, stay A), A+1→1 (no move, HALT)
- Final state: `["HALT"]`

**Save the returned `id`!**

### 3. Get Tape (Replace {ID})
```bash
curl http://localhost:8080/api/tapes/{ID}
```

### 4. Execute One Step (Replace {ID})
```bash
curl -X PUT http://localhost:8080/api/tapes/{ID}/step
```

### 5. Run Multiple Steps (Replace {ID})
```bash
curl -X PUT http://localhost:8080/api/tapes/{ID}/run \
  -H "Content-Type: application/json" \
  -d '{"maxSteps": 10}'
```

### 6. Reset Tape (Replace {ID})
```bash
# Reset to default unary addition machine state
curl -X PUT http://localhost:8080/api/tapes/{ID}/reset \
  -H "Content-Type: application/json"

# Or specify custom values
curl -X PUT http://localhost:8080/api/tapes/{ID}/reset \
  -H "Content-Type: application/json" \
  -d '{"content": "______1", "headPosition": 0}'
```

### 7. Delete Tape (Replace {ID})
```bash
curl -X DELETE http://localhost:8080/api/tapes/{ID}
```

---

## Using HTTPie (Alternative to cURL)

If you prefer HTTPie:

```bash
# Install: pip install httpie

# Create tape (with defaults - empty body)
http POST localhost:8080/api/tapes

# Or with explicit values
http POST localhost:8080/api/tapes \
  content="______1" \
  headPosition:=0 \
  initialState="A" \
  finalStates:='["HALT"]'

# Get tape
http GET localhost:8080/api/tapes/{ID}

# Execute step
http PUT localhost:8080/api/tapes/{ID}/step

# Run multiple steps
http PUT localhost:8080/api/tapes/{ID}/run maxSteps:=10

# Delete tape
http DELETE localhost:8080/api/tapes/{ID}
```

---

## Example: Complete Workflow (Unary Addition Machine)

```bash
# 1. Create tape with defaults (unary addition machine)
RESPONSE=$(curl -s -X POST http://localhost:8080/api/tapes \
  -H "Content-Type: application/json")

# 2. Extract ID (requires jq)
TAPE_ID=$(echo $RESPONSE | jq -r '.id')
echo "Created tape: $TAPE_ID"
echo "Initial tape: ______1"
echo "Head position: 0"
echo "State: A"

# 3. Execute one step at a time to see the progression
echo "Step 1:"
curl -X PUT http://localhost:8080/api/tapes/$TAPE_ID/step

echo "Step 2:"
curl -X PUT http://localhost:8080/api/tapes/$TAPE_ID/step

# Continue until HALT...

# Or execute multiple steps at once
curl -X PUT http://localhost:8080/api/tapes/$TAPE_ID/run \
  -H "Content-Type: application/json" \
  -d '{"maxSteps": 10}'

# 4. Get final state
curl http://localhost:8080/api/tapes/$TAPE_ID

# 5. Reset to initial state
curl -X PUT http://localhost:8080/api/tapes/$TAPE_ID/reset

# 6. Clean up
curl -X DELETE http://localhost:8080/api/tapes/$TAPE_ID
```

**Expected behavior:**
- Each `_` at the head position becomes `1` and head moves right
- When head reaches the final `1`, machine writes `1`, doesn't move, and goes to HALT
- Final tape should be: `1111111` (all `_` converted to `1`)

---

## Troubleshooting

**Connection refused?**
- Check if server is running: `curl http://localhost:8080/ping`
- Check if port 8080 is available

**Database connection error?**
- Check PostgreSQL is running: `docker ps | grep postgres`
- Check connection string: `echo $DB_URL`
- Test connection: `psql $DB_URL -c "SELECT 1"`

**404 Not Found?**
- Verify the tape ID exists: `curl http://localhost:8080/api/tapes/{ID}`
- Check URL path is correct (should be `/api/tapes/...`)

**500 Internal Server Error?**
- Check server logs for error messages
- Verify database schema was created (check PostgreSQL logs)
