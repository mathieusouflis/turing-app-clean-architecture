#!/usr/bin/env node

/**
 * Simple API Test Script
 * Tests all endpoints of the Unary Addition Turing Machine API
 * 
 * Usage: node test-api.js [baseUrl]
 * Default baseUrl: http://localhost:8080
 * 
 * Tests the unary addition machine with default values:
 * - Tape: "______1" (6 underscores + "1")
 * - State: "A"
 * - Transitions: A+_→1 (move right, stay A), A+1→1 (no move, HALT)
 * - Final state: "HALT"
 */

const baseUrl = process.argv[2] || "http://localhost:8080";

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function request(method, url, body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const text = await response.text();
    let data = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error.message,
    };
  }
}

async function testHealthCheck() {
  log("\n[1] Testing Health Check...", "blue");
  const result = await request("GET", `${baseUrl}/ping`);
  
  if (result.ok && result.data === "pong\n") {
    log("✓ Health check passed", "green");
    return true;
  } else {
    log(`✗ Health check failed: ${JSON.stringify(result)}`, "red");
    return false;
  }
}

async function testCreateTape() {
  log("\n[2] Testing Create Tape (with defaults)...", "blue");
  
  // Test creating tape with defaults (no body - uses unary addition machine defaults)
  const result = await request("POST", `${baseUrl}/api/tapes`, null);

  if (result.ok && result.status === 201 && result.data.id) {
    log("✓ Create tape with defaults passed", "green");
    log(`  Created tape ID: ${result.data.id}`, "yellow");
    log(`  Expected default content: "______1"`, "yellow");
    return result.data.id;
  } else {
    log(`✗ Create tape failed: ${JSON.stringify(result)}`, "red");
    return null;
  }
}

async function testCreateTapeExplicit() {
  log("\n[2b] Testing Create Tape (explicit values)...", "blue");
  
  // Test creating tape with explicit unary addition machine values
  const tapeData = {
    content: "______1",
    headPosition: 0,
    transitions: [
      {
        currentState: "A",
        readSymbol: "_",
        writeSymbol: "1",
        moveDirection: "R",
        nextState: "A",
      },
      {
        currentState: "A",
        readSymbol: "1",
        writeSymbol: "1",
        moveDirection: "R",
        nextState: "HALT",
      },
    ],
    initialState: "A",
    finalStates: ["HALT"],
  };

  const result = await request("POST", `${baseUrl}/api/tapes`, tapeData);

  if (result.ok && result.status === 201 && result.data.id) {
    log("✓ Create tape with explicit values passed", "green");
    log(`  Created tape ID: ${result.data.id}`, "yellow");
    return result.data.id;
  } else {
    log(`✗ Create tape failed: ${JSON.stringify(result)}`, "red");
    return null;
  }
}

async function testGetTape(tapeId) {
  log("\n[3] Testing Get Tape...", "blue");
  
  if (!tapeId) {
    log("✗ Skipped (no tape ID)", "yellow");
    return false;
  }

  const result = await request("GET", `${baseUrl}/api/tapes/${tapeId}`);

  if (result.ok && result.data.id === tapeId) {
    log("✓ Get tape passed", "green");
    log(`  Content: "${result.data.content}"`, "yellow");
    log(`  Head Position: ${result.data.headPosition}`, "yellow");
    log(`  Current State: ${result.data.currentState}`, "yellow");
    // Verify it's the unary addition machine
    if (result.data.content === "______1" && result.data.currentState === "A") {
      log(`  ✓ Verified: Unary addition machine defaults`, "green");
    }
    return true;
  } else {
    log(`✗ Get tape failed: ${JSON.stringify(result)}`, "red");
    return false;
  }
}

async function testExecuteStep(tapeId) {
  log("\n[4] Testing Execute Step...", "blue");
  
  if (!tapeId) {
    log("✗ Skipped (no tape ID)", "yellow");
    return false;
  }

  const result = await request("PUT", `${baseUrl}/api/tapes/${tapeId}/step`);

  if (result.ok && result.data.executed !== undefined) {
    log("✓ Execute step passed", "green");
    log(`  Executed: ${result.data.executed}`, "yellow");
    log(`  Content: "${result.data.content}"`, "yellow");
    log(`  Head Position: ${result.data.headPosition}`, "yellow");
    log(`  Current State: ${result.data.currentState}`, "yellow");
    
    // Verify unary addition machine behavior
    // First step should convert first _ to 1 and move right
    if (result.data.content.startsWith("1") && result.data.headPosition === 1 && result.data.currentState === "A") {
      log(`  ✓ Verified: First _ converted to 1, head moved right, state A`, "green");
    }
    
    return true;
  } else {
    log(`✗ Execute step failed: ${JSON.stringify(result)}`, "red");
    return false;
  }
}

async function testRunMachine(tapeId) {
  log("\n[5] Testing Run Machine...", "blue");
  
  if (!tapeId) {
    log("✗ Skipped (no tape ID)", "yellow");
    return false;
  }

  const result = await request("PUT", `${baseUrl}/api/tapes/${tapeId}/run`, {
    maxSteps: 5,
  });

  if (result.ok && result.data.stepsExecuted !== undefined) {
    log("✓ Run machine passed", "green");
    log(`  Steps Executed: ${result.data.stepsExecuted}`, "yellow");
    log(`  Halted: ${result.data.halted}`, "yellow");
    log(`  Content: "${result.data.content}"`, "yellow");
    log(`  Current State: ${result.data.currentState}`, "yellow");
    
    // Verify unary addition machine halts correctly
    if (result.data.halted && result.data.currentState === "HALT") {
      log(`  ✓ Verified: Machine halted in HALT state`, "green");
    }
    
    return true;
  } else {
    log(`✗ Run machine failed: ${JSON.stringify(result)}`, "red");
    return false;
  }
}

async function testResetTape(tapeId) {
  log("\n[6] Testing Reset Tape...", "blue");
  
  if (!tapeId) {
    log("✗ Skipped (no tape ID)", "yellow");
    return false;
  }

  // Test reset with defaults (no body - uses unary addition machine defaults)
  const result = await request("PUT", `${baseUrl}/api/tapes/${tapeId}/reset`, null);

  if (result.ok && result.data.content === "______1") {
    log("✓ Reset tape passed", "green");
    log(`  Content: "${result.data.content}" (default unary addition machine)`, "yellow");
    log(`  Head Position: ${result.data.headPosition}`, "yellow");
    log(`  Current State: ${result.data.currentState} (should be A)`, "yellow");
    
    if (result.data.currentState === "A") {
      log(`  ✓ Verified: Reset to initial state A`, "green");
    }
    
    return true;
  } else {
    log(`✗ Reset tape failed: ${JSON.stringify(result)}`, "red");
    return false;
  }
}

async function testDeleteTape(tapeId) {
  log("\n[7] Testing Delete Tape...", "blue");
  
  if (!tapeId) {
    log("✗ Skipped (no tape ID)", "yellow");
    return false;
  }

  const result = await request("DELETE", `${baseUrl}/api/tapes/${tapeId}`);

  if (result.ok && result.status === 204) {
    log("✓ Delete tape passed", "green");
    return true;
  } else {
    log(`✗ Delete tape failed: ${JSON.stringify(result)}`, "red");
    return false;
  }
}

async function testErrorCases(tapeId) {
  log("\n[8] Testing Error Cases...", "blue");
  
  // Test getting non-existent tape
  const getResult = await request(
    "GET",
    `${baseUrl}/api/tapes/00000000-0000-0000-0000-000000000000`
  );

  if (getResult.status === 404) {
    log("✓ 404 for non-existent tape works", "green");
  } else {
    log(`✗ Expected 404, got ${getResult.status}`, "red");
  }

  // Test executing step on non-existent tape
  const stepResult = await request(
    "PUT",
    `${baseUrl}/api/tapes/00000000-0000-0000-0000-000000000000/step`
  );

  if (stepResult.status === 404) {
    log("✓ 404 for step on non-existent tape works", "green");
    return true;
  } else {
    log(`✗ Expected 404, got ${stepResult.status}`, "red");
    return false;
  }
}

async function runAllTests() {
  log("=".repeat(50), "blue");
  log("Unary Addition Turing Machine API Test Suite", "blue");
  log("=".repeat(50), "blue");
  log(`Testing: ${baseUrl}`, "yellow");
  log("Testing unary addition machine with defaults:", "yellow");
  log("  - Tape: \"______1\" (6 underscores + \"1\")", "yellow");
  log("  - State: \"A\"", "yellow");
  log("  - Final state: \"HALT\"", "yellow");

  const results = {
    passed: 0,
    failed: 0,
  };

  // Run tests
  if (await testHealthCheck()) results.passed++;
  else results.failed++;

  const tapeId = await testCreateTape();
  if (tapeId) results.passed++;
  else results.failed++;

  if (await testGetTape(tapeId)) results.passed++;
  else results.failed++;

  if (await testExecuteStep(tapeId)) results.passed++;
  else results.failed++;

  if (await testRunMachine(tapeId)) results.passed++;
  else results.failed++;

  if (await testResetTape(tapeId)) results.passed++;
  else results.failed++;

  if (await testDeleteTape(tapeId)) results.passed++;
  else results.failed++;

  if (await testErrorCases(tapeId)) results.passed++;
  else results.failed++;

  // Summary
  log("\n" + "=".repeat(50), "blue");
  log("Test Summary", "blue");
  log("=".repeat(50), "blue");
  log(`Passed: ${results.passed}`, "green");
  log(`Failed: ${results.failed}`, results.failed > 0 ? "red" : "green");
  log("=".repeat(50), "blue");

  process.exit(results.failed > 0 ? 1 : 0);
}

// Check if fetch is available (Node 18+)
if (typeof fetch === "undefined") {
  console.error("Error: This script requires Node.js 18+ with native fetch support");
  console.error("Or install node-fetch: npm install node-fetch");
  process.exit(1);
}

runAllTests().catch((error) => {
  log(`\n✗ Test suite crashed: ${error.message}`, "red");
  process.exit(1);
});

