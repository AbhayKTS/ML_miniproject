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

const { getModel, isGeminiEnabled } = require("./geminiClient");

const generateOutput = async (modality, intent) => {
  if (isGeminiEnabled()) {
    const model = getModel();
    let prompt = "";

    if (modality === "text") {
      prompt = `Act as an adaptive creative collaborator (Chhaya).
        Generate a ${intent.tone} short story or narrative script.
        Themes: ${intent.themes.join(", ")}.
        Cultural Context: ${intent.culturalContext}.
        Complexity Level: ${intent.complexity}/100.
        Creative Freedom (Originality): ${intent.originality}/100.
        Specific Constraints: ${intent.constraints.join(". ")}.
        Return ONLY the creative text.`;
    } else if (modality === "image") {
      prompt = `Act as a creative director. Generate a detailed image generation prompt for Midjourney/DALL-E.
        Style: ${intent.tone}.
        Motifs: ${intent.themes.join(", ")}.
        Cultural Essence: ${intent.culturalContext}.
        Lighting/Technique: luminous painterly.
        Result should be high-quality and evocative.
        Return ONLY the image prompt text.`;
    } else {
      prompt = `Act as a sound designer. Describe a soundscape concept or music prompt.
        Mood: ${intent.tone}.
        Textures: ${intent.themes.join(", ")}.
        Cultural influence: ${intent.culturalContext}.
        Return ONLY the audio concept description.`;
    }

    try {
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error("Gemini generation error:", error);
    }
  }

  // Fallback if Gemini is disabled or fails
  if (modality === "text") {
    return `[Fallback] Chhaya frames a ${intent.tone} narrative where ${intent.culturalContext} motifs glow through each scene, balancing ${intent.themes.join(", ")} with a ${intent.riskBudget} creative arc.`;
  }
  if (modality === "image") {
    return `[Fallback] Image prompt: ${intent.culturalContext} skyline, ${intent.tone} palette, layered ${intent.themes.join(", ")} motifs, painterly lighting.`;
  }
  return `[Fallback] Audio prompt: ${intent.tone} ambience, ${intent.culturalContext} textures, ${intent.themes.join(", ")} motifs, slow tide rhythm.`;
};

const buildGenerationPlan = async ({ modality, prompt, controls, constraints, memory }) => {
  console.log(`Building generation plan for ${modality}...`);
  const intent = analyzeIntent({ prompt, controls, memory });
  const constrained = applyConstraints(intent, constraints);
  const aligned = alignCulture(constrained);
  const crossModal = crossModalPlan(aligned);

  console.log(`Intent analyzed for user: ${JSON.stringify(aligned)}`);

  const output = await generateOutput(modality, aligned);
  console.log(`Generation complete for ${modality}. Output length: ${output.length} chars.`);

  return {
    id: aligned.id,
    modality,
    intent: aligned,
    crossModal,
    output
  };
};

module.exports = {
  buildGenerationPlan
};
