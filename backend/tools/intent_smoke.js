// Quick smoke script: build generation plan and print the analyzed intent
process.env.ENGINE_ACCESS_KEY = process.env.ENGINE_ACCESS_KEY || "DUMMY_KEY_FOR_SMOKE";

const { buildGenerationPlan } = require("../src/services/creativeEngine");

(async () => {
  try {
    const plan = await buildGenerationPlan({
      modality: "text",
      prompt: "A short test prompt",
      controls: {
        theme: "neo-classical",
        genre: "ambient",
        styleIntensity: 42,
        mood: "calm",
        tempo: "moderate",
        instrumentation: "synth pads"
      },
      constraints: ["keep it short"],
      memory: { themes: ["sea"] }
    });
    console.log("Plan output (truncated):", plan.output && plan.output.slice(0, 200));
  } catch (err) {
    console.error("Generation plan failed as expected after intent logging:", err.message);
  }
})();
