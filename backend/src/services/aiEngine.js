const { v4: uuid } = require("uuid");

const analyzeIntent = ({ prompt, controls, memory }) => {
  return {
    id: uuid(),
    themes: memory?.themes?.length ? memory.themes : ["mythic futurism"],
    tone: controls?.tone || memory?.tone || "warm visionary",
    culturalContext: controls?.culturalContext || memory?.culturalContext || "coastal ritual",
    originality: controls?.originality ?? 70,
    complexity: controls?.complexity ?? 60,
    prompt
  };
};

const applyConstraints = (intent, constraints = []) => {
  return {
    ...intent,
    constraints: constraints.length ? constraints : ["maintain narrative continuity"],
    riskBudget: intent.originality > 75 ? "expansive" : "balanced"
  };
};

const alignCulture = (intent) => {
  return {
    ...intent,
    culturalAlignment: {
      region: intent.culturalContext,
      sensitivity: "high",
      authenticityChecks: ["tone", "motifs", "language"]
    }
  };
};

const crossModalPlan = (intent) => {
  return {
    narrativeAnchor: `${intent.tone} with ${intent.themes.join(", ")}`,
    visualAnchor: "luminous painterly with layered coastal motifs",
    audioAnchor: "ambient synth textures with rhythmic tide"
  };
};

const generateOutput = (modality, intent) => {
  if (modality === "text") {
    return `Chhaya frames a ${intent.tone} narrative where ${intent.culturalContext} motifs glow through each scene, balancing ${intent.themes.join(", ")} with a ${intent.riskBudget} creative arc.`;
  }
  if (modality === "image") {
    return `Image prompt: ${intent.culturalContext} skyline, ${intent.tone} palette, layered ${intent.themes.join(", ")} motifs, painterly lighting.`;
  }
  return `Audio prompt: ${intent.tone} ambience, ${intent.culturalContext} textures, ${intent.themes.join(", ")} motifs, slow tide rhythm.`;
};

const buildGenerationPlan = ({ modality, prompt, controls, constraints, memory }) => {
  const intent = analyzeIntent({ prompt, controls, memory });
  const constrained = applyConstraints(intent, constraints);
  const aligned = alignCulture(constrained);
  const crossModal = crossModalPlan(aligned);
  return {
    id: aligned.id,
    modality,
    intent: aligned,
    crossModal,
    output: generateOutput(modality, aligned)
  };
};

module.exports = {
  buildGenerationPlan
};
