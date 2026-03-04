const test = require("node:test");
const assert = require("node:assert/strict");
const { getMemory, updateMemory, blendFeedback } = require("../src/services/creativeMemory");

test("creativeMemory: getMemory returns default for unknown user", async () => {
  const memory = await getMemory("nonexistent-user-" + Date.now());
  assert.equal(memory.tone, "balanced");
  assert.deepEqual(memory.themes, ["exploratory"]);
  assert.equal(memory.lock, false);
  assert.equal(memory.culturalContext, "universal");
});

test("creativeMemory: updateMemory persists changes", async () => {
  const userId = "test-update-" + Date.now();
  await updateMemory(userId, { tone: "dreamy", themes: ["sunset"] });
  const memory = await getMemory(userId);
  assert.equal(memory.tone, "dreamy");
  assert.deepEqual(memory.themes, ["sunset"]);
});

test("creativeMemory: locked memory blocks updates", async () => {
  const userId = "test-lock-" + Date.now();
  await updateMemory(userId, { tone: "playful", lock: true });
  await updateMemory(userId, { tone: "aggressive" });
  const memory = await getMemory(userId);
  // Should still be playful because lock blocked the aggressive update
  assert.equal(memory.tone, "playful");
  assert.equal(memory.lock, true);
});

test("creativeMemory: unlocking memory allows updates", async () => {
  const userId = "test-unlock-" + Date.now();
  await updateMemory(userId, { tone: "playful", lock: true });
  // Unlock and update simultaneously
  await updateMemory(userId, { tone: "calm", lock: false });
  const memory = await getMemory(userId);
  assert.equal(memory.tone, "calm");
  assert.equal(memory.lock, false);
});

test("creativeMemory: blendFeedback updates memory based on rating", async () => {
  const userId = "test-blend-" + Date.now();
  await updateMemory(userId, { tone: "energetic", themes: ["city"] });
  
  await blendFeedback(userId, { rating: 5, edits: null, signals: { reuse: true } });
  const memory = await getMemory(userId);
  // After positive feedback, memory should have been updated
  assert.ok(memory.updatedAt, "memory should have updatedAt");
});

test("creativeMemory: blendFeedback respects lock", async () => {
  const userId = "test-blend-lock-" + Date.now();
  await updateMemory(userId, { tone: "fixed", lock: true });
  
  const result = await blendFeedback(userId, { rating: 1, edits: "change everything" });
  assert.equal(result.locked, true);
  const memory = await getMemory(userId);
  assert.equal(memory.tone, "fixed");
});
