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

const { getProcessingModel, isEngineEnabled } = require("./engineClient");

const generateOutput = async (modality, intent) => {
  if (modality === "text") {
    if (!process.env.ENGINE_ACCESS_KEY) throw new Error("ENGINE_ACCESS_KEY is missing for text generation");
    const model = getProcessingModel();
    const prompt = `Act as an adaptive creative collaborator (Chhaya).
      Generate a ${intent.tone} short story or narrative script.
      Themes: ${intent.themes.join(", ")}.
      Cultural Context: ${intent.culturalContext}.
      Complexity Level: ${intent.complexity}/100.
      Creative Freedom (Originality): ${intent.originality}/100.
      Specific Constraints: ${intent.constraints.join(". ")}.
      Return ONLY the creative text.`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } 
  
  if (modality === "image") {
    if (!process.env.STABILITY_API_KEY) throw new Error("STABILITY_API_KEY is missing for image generation");
    const prompt = `A ${intent.tone} painterly image featuring ${intent.culturalContext} motifs, layered with ${intent.themes.join(", ")} themes.`;
    // Simulated API call to Stability AI
    const response = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.STABILITY_API_KEY}` },
      body: JSON.stringify({ text_prompts: [{ text: prompt }] })
    });
    if (!response.ok) throw new Error(`Stability API Error: ${response.status}`);
    const data = await response.json();
    // Assuming data contains base64 image or url
    return `[Stability AI Image Data generated for prompt: ${prompt}]`;
  } 
  
  if (modality === "audio") {
    if (!process.env.ELEVEN_LABS_API_KEY) throw new Error("ELEVEN_LABS_API_KEY is missing for audio generation");
    const textToSpeak = `This is a ${intent.tone} audio piece exploring ${intent.themes.join(", ")}.`;
    // Simulated API call to ElevenLabs
    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", {
      method: "POST",
      headers: { "Content-Type": "application/json", "xi-api-key": process.env.ELEVEN_LABS_API_KEY },
      body: JSON.stringify({ text: textToSpeak })
    });
    if (!response.ok) throw new Error(`ElevenLabs API Error: ${response.status}`);
    return `[ElevenLabs Audio Data generated for tone: ${intent.tone}]`;
  }
  
  if (modality === "video") {
    if (!process.env.RUNWAY_API_KEY) throw new Error("RUNWAY_API_KEY is missing for video generation");
    const prompt = `A cinematic ${intent.tone} video showcasing ${intent.culturalContext} elements.`;
    const response = await fetch("https://api.runwayml.com/v1/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.RUNWAY_API_KEY}` },
      body: JSON.stringify({ prompt })
    });
    if (!response.ok) throw new Error(`Runway API Error: ${response.status}`);
    return `[Runway Video Data generated for prompt: ${prompt}]`;
  }

  throw new Error(`Unsupported modality: ${modality}`);
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
