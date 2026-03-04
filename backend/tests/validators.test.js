const test = require("node:test");
const assert = require("node:assert/strict");
const { validate, generateBaseSchema, feedbackSchema, memoryUpdateSchema, projectSchema, clipRequestSchema, captionRequestSchema, exportRequestSchema } = require("../src/utils/validators");

// ─── generateBaseSchema ─────────────────────────────────
test("validators: generateBase rejects empty prompt", () => {
  const result = validate(generateBaseSchema, { prompt: "" });
  assert.equal(result.success, false);
});

test("validators: generateBase accepts valid full payload", () => {
  const result = validate(generateBaseSchema, {
    prompt: "Create something beautiful",
    controls: { originality: 80, tone: "dreamy", styleIntensity: 50, aiAutonomy: 70, genre: "poetry", narrativeStructure: "arc" },
    constraints: ["keep it short"]
  });
  assert.equal(result.success, true);
  assert.equal(result.data.controls.styleIntensity, 50);
});

test("validators: generateBase rejects prompt over 5000 chars", () => {
  const result = validate(generateBaseSchema, { prompt: "x".repeat(5001) });
  assert.equal(result.success, false);
});

test("validators: generateBase rejects originality out of range", () => {
  const result = validate(generateBaseSchema, { prompt: "ok", controls: { originality: 200 } });
  assert.equal(result.success, false);
});

test("validators: generateBase allows missing controls", () => {
  const result = validate(generateBaseSchema, { prompt: "hello" });
  assert.equal(result.success, true);
});

// ─── feedbackSchema ──────────────────────────────────────
test("validators: feedback rejects rating below 1", () => {
  const result = validate(feedbackSchema, { rating: 0 });
  assert.equal(result.success, false);
});

test("validators: feedback rejects rating above 5", () => {
  const result = validate(feedbackSchema, { rating: 6 });
  assert.equal(result.success, false);
});

test("validators: feedback accepts valid signals", () => {
  const result = validate(feedbackSchema, { rating: 4, signals: { reuse: true, acceptance: true } });
  assert.equal(result.success, true);
  assert.equal(result.data.signals.reuse, true);
});

test("validators: feedback accepts empty object", () => {
  const result = validate(feedbackSchema, {});
  assert.equal(result.success, true);
});

// ─── memoryUpdateSchema ──────────────────────────────────
test("validators: memoryUpdate requires updates object", () => {
  const result = validate(memoryUpdateSchema, {});
  assert.equal(result.success, false);
});

test("validators: memoryUpdate accepts lock toggle", () => {
  const result = validate(memoryUpdateSchema, { updates: { lock: true } });
  assert.equal(result.success, true);
  assert.equal(result.data.updates.lock, true);
});

test("validators: memoryUpdate accepts theme array", () => {
  const result = validate(memoryUpdateSchema, { updates: { themes: ["ocean", "night"] } });
  assert.equal(result.success, true);
  assert.deepEqual(result.data.updates.themes, ["ocean", "night"]);
});

// ─── projectSchema ───────────────────────────────────────
test("validators: project rejects empty name", () => {
  const result = validate(projectSchema, { name: "" });
  assert.equal(result.success, false);
});

test("validators: project accepts valid payload", () => {
  const result = validate(projectSchema, { name: "My Project", description: "desc" });
  assert.equal(result.success, true);
});

// ─── clipRequestSchema ───────────────────────────────────
test("validators: clipRequest rejects missing videoId", () => {
  const result = validate(clipRequestSchema, {});
  assert.equal(result.success, false);
});

test("validators: clipRequest accepts valid payload", () => {
  const result = validate(clipRequestSchema, { videoId: "abc", minDuration: 5, maxDuration: 30 });
  assert.equal(result.success, true);
});

// ─── captionRequestSchema ────────────────────────────────
test("validators: captionRequest rejects missing clipId", () => {
  const result = validate(captionRequestSchema, {});
  assert.equal(result.success, false);
});

// ─── exportRequestSchema ─────────────────────────────────
test("validators: export defaults format to mp4", () => {
  const result = validate(exportRequestSchema, { clipId: "abc" });
  assert.equal(result.success, true);
  assert.equal(result.data.format, "mp4");
  assert.equal(result.data.resolution, "1080p");
  assert.equal(result.data.aspectRatio, "9:16");
});
