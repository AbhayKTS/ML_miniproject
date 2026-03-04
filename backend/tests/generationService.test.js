const test = require("node:test");
const assert = require("node:assert/strict");
const { generate } = require("../src/services/generationService");

test("generationService: generates text output", async () => {
  const result = await generate({
    modality: "text",
    prompt: "Write a haiku about rain",
    controls: { tone: "melancholic" },
    constraints: ["exactly 3 lines"],
    userId: "test-gen-" + Date.now()
  });

  assert.ok(result.id, "should have an id");
  assert.equal(result.modality, "text");
  assert.ok(typeof result.output === "string");
  assert.ok(result.output.length > 0);
  assert.ok(result.reasoning, "should include reasoning");
  assert.ok(result.createdAt);
});

test("generationService: generates image output", async () => {
  const result = await generate({
    modality: "image",
    prompt: "A starlit forest",
    controls: { originality: 90 },
    constraints: [],
    userId: "test-gen-img-" + Date.now()
  });

  assert.equal(result.modality, "image");
  assert.ok(result.output.length > 0);
});

test("generationService: rejects invalid modality", async () => {
  await assert.rejects(
    () =>
      generate({
        modality: "video",
        prompt: "anything",
        controls: {},
        constraints: [],
        userId: "test"
      }),
    { message: /Unsupported modality/ }
  );
});

test("generationService: handles empty constraints gracefully", async () => {
  const result = await generate({
    modality: "audio",
    prompt: "Gentle waves",
    controls: {},
    constraints: [],
    userId: "test-gen-audio-" + Date.now()
  });

  assert.equal(result.modality, "audio");
  assert.ok(result.output);
});
