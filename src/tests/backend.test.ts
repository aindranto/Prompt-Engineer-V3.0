import { translateErrorMessage } from '../server/geminiService.js';
import { HARDCODED_SYSTEM_INSTRUCTION } from '../types.js';

function runTests() {
  console.log("==========================================");
  console.log("RUNNING AUTOMATED SUITE FOR PHASE 3 VERIFICATION");
  console.log("==========================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // Test 1: Error Translation for High Demand (503)
  const highDemandResult = translateErrorMessage("503 Service Unavailable: High demand");
  assert(
    highDemandResult.includes("High Demand") && highDemandResult.includes("lalu lintas"),
    "Test 1: Error translation for 503 High Demand returns Indonesian friendly message"
  );

  // Test 2: Error Translation for Quota Limit (429)
  const quotaResult = translateErrorMessage("429 Resource Exhausted: quota exceeded");
  assert(
    quotaResult.includes("Rate Limit Exceeded") && quotaResult.includes("kuota"),
    "Test 2: Error translation for 429 Quota Exceeded returns Indonesian friendly message"
  );

  // Test 3: Error Translation for Payload Too Large (413)
  const payloadResult = translateErrorMessage("413 Request Entity Too Large");
  assert(
    payloadResult.includes("Payload Too Large") && payloadResult.includes("3MB"),
    "Test 3: Error translation for 413 Payload Too Large returns Indonesian friendly message"
  );

  // Test 4: System Instruction Contains All Required Rules
  assert(
    HARDCODED_SYSTEM_INSTRUCTION.includes("PERAN & IDENTITAS") &&
      HARDCODED_SYSTEM_INSTRUCTION.includes("reason-box") &&
      HARDCODED_SYSTEM_INSTRUCTION.includes("option-box") &&
      HARDCODED_SYSTEM_INSTRUCTION.includes("BAHASA INDONESIA") &&
      HARDCODED_SYSTEM_INSTRUCTION.includes("AI Image Generator") &&
      HARDCODED_SYSTEM_INSTRUCTION.includes("MANDATORY CODE BLOCK FENCING"),
    "Test 4: Hardcoded System Instruction V3.0 contains required multi-role, option box & Bahasa Indonesia prompt rules"
  );

  console.log("------------------------------------------");
  console.log(`TOTAL PASSED: ${passed}`);
  console.log(`TOTAL FAILED: ${failed}`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
