const { v4: uuid } = require("uuid");

// ─── Stage 1: Intent Analysis ──────────────────────────────────
// Dynamically infers creative direction from prompt + controls + memory
const analyzeIntent = ({ prompt, controls, memory }) => {
  const c = controls || {};
  const m = memory || {};

  // Extract keywords from prompt for dynamic theme inference
  const promptLower = (prompt || "").toLowerCase();
  const inferredThemes = m.themes?.length ? [...m.themes] : [];
  const themeKeywords = {
    nature: ["forest", "ocean", "mountain", "river", "sky", "garden", "sea", "wave"],
    urban: ["city", "street", "building", "neon", "traffic", "subway"],
    mythology: ["myth", "legend", "god", "ancient", "ritual", "temple", "celestial"],
    emotion: ["love", "grief", "joy", "anger", "hope", "fear", "longing"],
    technology: ["cyber", "digital", "AI", "robot", "code", "virtual", "data"]
  };
  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    if (keywords.some((kw) => promptLower.includes(kw)) && !inferredThemes.includes(theme)) {
      inferredThemes.push(theme);
    }
  }
  if (inferredThemes.length === 0) inferredThemes.push("exploratory");

  // Style intensity controls how much memory preferences influence output
  const styleIntensity = c.styleIntensity ?? 50;
  // AI autonomy controls creative freedom vs strict adherence
  const aiAutonomy = c.aiAutonomy ?? 50;

  return {
    id: uuid(),
    themes: inferredThemes,
    tone: c.tone || m.tone || "balanced",
    culturalContext: c.culturalContext || m.culturalContext || "universal",
    originality: c.originality ?? 70,
    complexity: c.complexity ?? 60,
    styleIntensity,
    aiAutonomy,
    genre: c.genre || null,
    narrativeStructure: c.narrativeStructure || null,
    visualStyle: styleIntensity > 50 ? (m.visualStyle || "evocative") : "neutral",
    audioStyle: styleIntensity > 50 ? (m.audioStyle || "ambient") : "neutral",
    prompt
  };
};

// ─── Stage 2: Constraint Application ───────────────────────────
// Applies structured constraints and computes risk budget
const applyConstraints = (intent, constraints = []) => {
  const structuredConstraints = constraints.length
    ? constraints
    : ["maintain coherence with creative intent"];

  // Risk budget factors in originality + aiAutonomy + constraint count
  // More constraints = less creative freedom, higher autonomy = more freedom
  const constraintPenalty = Math.min(structuredConstraints.length * 5, 25);
  const autonomyBoost = (intent.aiAutonomy - 50) * 0.3;
  const riskScore = intent.originality + autonomyBoost - constraintPenalty;

  let riskBudget;
  if (riskScore > 80) riskBudget = "experimental";
  else if (riskScore > 60) riskBudget = "expansive";
  else if (riskScore > 40) riskBudget = "balanced";
  else riskBudget = "conservative";

  return {
    ...intent,
    constraints: structuredConstraints,
    riskBudget,
    // Genre and narrative structure are first-class constraint dimensions
    genreConstraint: intent.genre ? `Stay within the ${intent.genre} genre.` : null,
    narrativeConstraint: intent.narrativeStructure
      ? `Follow a ${intent.narrativeStructure} structure.`
      : null
  };
};

// ─── Stage 3: Cultural Alignment ───────────────────────────────
// Dynamic sensitivity based on cultural context specificity
const alignCulture = (intent) => {
  const context = (intent.culturalContext || "").toLowerCase();

  // Determine sensitivity dynamically
  let sensitivity = "standard";
  const specificContexts = [
    "south asian", "southeast asian", "east asian", "african", "indigenous",
    "middle eastern", "latin american", "pacific islander", "nordic", "celtic"
  ];
  if (specificContexts.some((sc) => context.includes(sc))) {
    sensitivity = "high";
  } else if (context && context !== "universal") {
    sensitivity = "moderate";
  }

  // Authenticity checks scale with sensitivity
  const authenticityChecks = ["tone", "motifs"];
  if (sensitivity === "high") {
    authenticityChecks.push("language", "symbolism", "historical-accuracy");
  } else if (sensitivity === "moderate") {
    authenticityChecks.push("language");
  }

  return {
    ...intent,
    culturalAlignment: {
      region: intent.culturalContext,
      sensitivity,
      authenticityChecks
    }
  };
};

// ─── Stage 4: Cross-Modal Planning ─────────────────────────────
// Creates coherent anchors across text, visual, and audio modalities
const crossModalPlan = (intent) => {
  return {
    narrativeAnchor: `${intent.tone} narrative with themes of ${intent.themes.join(", ")}${intent.genre ? ` in the ${intent.genre} genre` : ""}`,
    visualAnchor: `${intent.visualStyle} visual style, ${intent.culturalContext} influences, ${intent.themes.join(" and ")} motifs`,
    audioAnchor: `${intent.audioStyle} soundscape, ${intent.tone} mood, ${intent.culturalContext} textures`
  };
};

// ─── Stage 5: Output Generation ────────────────────────────────
const { getProcessingModel, isEngineEnabled } = require("./engineClient");

const generateOutput = async (modality, intent) => {
  if (isEngineEnabled()) {
    const model = getProcessingModel();
    let prompt = "";

    // Build constraint instructions block
    const constraintBlock = [
      ...intent.constraints.map((c) => `- ${c}`),
      intent.genreConstraint ? `- GENRE: ${intent.genreConstraint}` : null,
      intent.narrativeConstraint ? `- STRUCTURE: ${intent.narrativeConstraint}` : null
    ]
      .filter(Boolean)
      .join("\n");

    // Cultural instruction
    const culturalInstruction =
      intent.culturalAlignment.sensitivity === "high"
        ? `Cultural Context: ${intent.culturalContext}. Treat with HIGH sensitivity — ensure authenticity in tone, motifs, symbolism, and language. Avoid stereotypes or superficial portrayals.`
        : intent.culturalAlignment.sensitivity === "moderate"
          ? `Cultural Context: ${intent.culturalContext}. Ensure respectful and authentic cultural representation.`
          : `Cultural Context: ${intent.culturalContext}.`;

    // Autonomy instruction
    const autonomyInstruction =
      intent.aiAutonomy > 70
        ? "You have significant creative freedom — surprise the user with original interpretations."
        : intent.aiAutonomy < 30
          ? "Follow the user's instructions closely with minimal creative deviation."
          : "Balance creative exploration with adherence to the user's direction.";

    if (modality === "text") {
      prompt = `Act as Chhaya, an adaptive creative collaborator.
Generate a ${intent.tone} creative text piece.
Themes: ${intent.themes.join(", ")}.
${culturalInstruction}
Complexity Level: ${intent.complexity}/100.
Creative Freedom (Originality): ${intent.originality}/100.
Style Intensity: ${intent.styleIntensity}/100.
${autonomyInstruction}

Constraints:
${constraintBlock}

Return ONLY the creative text. No commentary or meta-text.`;
    } else if (modality === "image") {
      prompt = `Act as a creative director for Chhaya.
Generate a detailed image generation prompt for Midjourney/DALL-E.
Visual Style: ${intent.visualStyle}.
Motifs: ${intent.themes.join(", ")}.
${culturalInstruction}
Mood/Tone: ${intent.tone}.
Style Intensity: ${intent.styleIntensity}/100.
${autonomyInstruction}

Constraints:
${constraintBlock}

Return ONLY the image prompt text. No commentary.`;
    } else {
      prompt = `Act as a sound designer for Chhaya.
Describe a soundscape concept or music prompt.
Audio Style: ${intent.audioStyle}.
Mood: ${intent.tone}.
Textures: ${intent.themes.join(", ")}.
${culturalInstruction}
Style Intensity: ${intent.styleIntensity}/100.
${autonomyInstruction}

Constraints:
${constraintBlock}

Return ONLY the audio concept description. No commentary.`;
    }

    try {
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error("Content generation error:", error.message || error);
    }
  }

  // Fallback outputs when engine is disabled or fails
  const genreTag = intent.genre ? ` in the ${intent.genre} genre` : "";
  const structureTag = intent.narrativeStructure ? ` following ${intent.narrativeStructure}` : "";

  if (modality === "text") {
    return `[Chhaya] A ${intent.tone} narrative${genreTag}${structureTag} where ${intent.culturalContext} motifs illuminate scenes of ${intent.themes.join(", ")}, crafted at ${intent.originality}% originality with a ${intent.riskBudget} creative arc.`;
  }
  if (modality === "image") {
    return `[Chhaya] Image prompt: ${intent.visualStyle} composition, ${intent.culturalContext} influences, featuring ${intent.themes.join(", ")} motifs, ${intent.tone} palette${genreTag}.`;
  }
  return `[Chhaya] Audio concept: ${intent.audioStyle} soundscape, ${intent.tone} mood, ${intent.culturalContext} textures, weaving ${intent.themes.join(", ")}${genreTag}.`;
};

// ─── Pipeline Orchestrator ─────────────────────────────────────
const buildGenerationPlan = async ({ modality, prompt, controls, constraints, memory }) => {
  console.log(`Building generation plan for ${modality}...`);
  const intent = analyzeIntent({ prompt, controls, memory });
  const constrained = applyConstraints(intent, constraints);
  const aligned = alignCulture(constrained);
  const crossModal = crossModalPlan(aligned);

  console.log(`Intent analyzed: tone=${aligned.tone}, themes=[${aligned.themes}], genre=${aligned.genre || "none"}, riskBudget=${aligned.riskBudget}`);

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
