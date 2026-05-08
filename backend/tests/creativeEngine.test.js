jest.mock("../src/services/engineClient", () => ({
  isEngineEnabled: jest.fn(() => true),
  getProcessingModel: jest.fn(() => ({
    generateContent: jest.fn(async () => ({
      response: {
        text: () => "A reflective harbor story with hopeful arcs."
      }
    }))
  }))
}));

const { buildGenerationPlan } = require("../src/services/creativeEngine");

<<<<<<< HEAD
test("buildGenerationPlan creates consistent outputs", async () => {
  const plan = await buildGenerationPlan({
    modality: "text",
    prompt: "A luminous harbor story",
    controls: { tone: "reflective" },
    constraints: ["keep hopeful"],
    memory: { themes: ["harbor"], tone: "reflective", culturalContext: "coastal" }
=======
describe("Creative Engine", () => {
  beforeAll(() => {
    process.env.ENGINE_ACCESS_KEY = "test-key";
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4
  });

  it("buildGenerationPlan creates consistent outputs", async () => {
    const plan = await buildGenerationPlan({
      modality: "text",
      prompt: "A luminous harbor story",
      controls: { tone: "reflective" },
      constraints: ["keep hopeful"],
      memory: { themes: ["harbor"], tone: "reflective", culturalContext: "coastal" }
    });

    expect(plan.modality).toBe("text");
    expect(plan.output).toContain("reflective");
    expect(plan.intent.constraints).toContain("keep hopeful");
  });
});
