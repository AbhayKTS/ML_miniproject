const test = require("node:test");
const assert = require("node:assert/strict");
const { recordFeedback } = require("../src/services/feedbackEngine");

test("feedbackEngine: records feedback with all fields", async () => {
  const entry = await recordFeedback({
    userId: "test-fb-" + Date.now(),
    generationId: "gen-1",
    rating: 4,
    edits: "made it brighter",
    signals: { reuse: true, acceptance: true }
  });

  assert.ok(entry.id, "should have an id");
  assert.equal(entry.rating, 4);
  assert.equal(entry.edits, "made it brighter");
  assert.equal(entry.signals.reuse, true);
  assert.ok(entry.createdAt, "should have createdAt");
});

test("feedbackEngine: records feedback with minimal fields", async () => {
  const entry = await recordFeedback({
    userId: "test-fb-min-" + Date.now(),
    generationId: "gen-2",
    rating: 2,
    edits: undefined,
    signals: undefined
  });

  assert.ok(entry.id);
  assert.equal(entry.rating, 2);
});
