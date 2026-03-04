const test = require("node:test");
const assert = require("node:assert/strict");
const { buildGenerationPlan } = require("../src/services/creativeEngine");

test("buildGenerationPlan creates consistent text outputs", async () => {
  const plan = await buildGenerationPlan({
    modality: "text",
    prompt: "A luminous harbor story",
    controls: { tone: "reflective" },
    constraints: ["keep hopeful"],
    memory: { themes: ["harbor"], tone: "reflective", culturalContext: "coastal" }
  });

  assert.equal(plan.modality, "text");
  assert.ok(typeof plan.output === "string", "output should be a string");
  assert.ok(plan.output.length > 0, "output should not be empty");
  assert.ok(plan.intent.constraints.includes("keep hopeful"));
  assert.equal(plan.intent.tone, "reflective");
});

test("buildGenerationPlan creates image outputs", async () => {
  const plan = await buildGenerationPlan({
    modality: "image",
    prompt: "A sunset over ancient temples",
    controls: { tone: "ethereal", originality: 80 },
    constraints: ["warm colors only"],
    memory: { themes: ["temple"], tone: "ethereal", culturalContext: "Southeast Asian" }
  });

  assert.equal(plan.modality, "image");
  assert.ok(typeof plan.output === "string");
  assert.ok(plan.output.length > 0);
});

test("buildGenerationPlan creates audio outputs", async () => {
  const plan = await buildGenerationPlan({
    modality: "audio",
    prompt: "Calm ocean waves with distant bells",
    controls: { tone: "meditative", complexity: 30 },
    constraints: [],
    memory: { themes: ["ocean"], tone: "meditative", culturalContext: "coastal" }
  });

  assert.equal(plan.modality, "audio");
  assert.ok(typeof plan.output === "string");
  assert.ok(plan.output.length > 0);
});

test("buildGenerationPlan uses default memory when none provided", async () => {
  const plan = await buildGenerationPlan({
    modality: "text",
    prompt: "A brief poem",
    controls: {},
    constraints: [],
    memory: null
  });

  assert.equal(plan.modality, "text");
  assert.ok(typeof plan.output === "string");
  assert.ok(plan.intent.themes.length > 0, "should have default themes");
});
