const test = require("node:test");
const assert = require("node:assert/strict");
const { buildGenerationPlan } = require("../src/services/aiEngine");

test("buildGenerationPlan creates consistent outputs", () => {
  const plan = buildGenerationPlan({
    modality: "text",
    prompt: "A luminous harbor story",
    controls: { tone: "reflective" },
    constraints: ["keep hopeful"],
    memory: { themes: ["harbor"], tone: "reflective", culturalContext: "coastal" }
  });

  assert.equal(plan.modality, "text");
  assert.ok(plan.output.includes("reflective"));
  assert.ok(plan.intent.constraints.includes("keep hopeful"));
});
