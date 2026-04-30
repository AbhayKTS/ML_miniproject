const { buildGenerationPlan } = require("./creativeEngine");
const { getMemory } = require("./creativeMemory");
const { findByUserId } = require("../repositories/feedbackRepository");
const { saveGeneration } = require("../repositories/generationRepository");
const {
  summarizeFeedback,
  buildAdaptiveProfile,
  applyAdaptiveControls
} = require("../ai-engine/adaptiveLearning");
const runwayService = require("./runwayService");
const stabilityService = require("./stabilityService");
const elevenLabsService = require("./elevenLabsService");
const sunoService = require("./sunoService");

const generate = async ({ modality, prompt, controls, constraints, userId, audio_type, mode }) => {
  const memory = await getMemory(userId);
  const feedbackHistory = await findByUserId(userId, 30);
  const feedbackSummary = summarizeFeedback(feedbackHistory);
  const adaptiveProfile = buildAdaptiveProfile({ memory, feedbackSummary });
  const adaptiveControls = applyAdaptiveControls({ controls, adaptiveProfile });

  if (mode === "prompt") {
    const plan = await buildGenerationPlan({
      modality,
      prompt,
      controls: adaptiveControls,
      constraints,
      memory
    });
    const safeOutput = typeof plan?.output === "string" ? plan.output : "";
    return saveGeneration({
      modality,
      prompt,
      output: safeOutput,
      reasoning: plan.intent,
      crossModal: plan.crossModal,
      userId,
      adaptiveProfile
    });
  }

  // Handle Video separately via Runway if enabled
  if (modality === "video" && runwayService.isRunwayEnabled()) {
    const task = await runwayService.generateVideo(prompt, {
      duration: adaptiveControls.duration || 5, // Default durations
      ratio: adaptiveControls.aspectRatio || "16:9"
    });

    return saveGeneration({
      modality,
      prompt,
      output: task.id, // Store taskId as output initially or handle async 
      status: "pending",
      reasoning: { tone: adaptiveControls.tone || "visionary", themes: memory?.themes || [] },
      userId,
      runwayTaskId: task.id
    });
  }

  // Handle Image separately via Stability AI if enabled
  if (modality === "image" && stabilityService.isStabilityEnabled()) {
    const result = await stabilityService.generateImage(prompt, {
      width: adaptiveControls.width || 512,
      height: adaptiveControls.height || 512,
      steps: adaptiveControls.steps || 30
    });

    const base64Image = result.artifacts?.[0]?.base64;
    const output = base64Image ? `data:image/png;base64,${base64Image}` : "[Stability Generation Failed]";

    return saveGeneration({
      modality,
      prompt,
      output,
      reasoning: { tone: adaptiveControls.tone || "visionary", model: "stable-diffusion-v1-6" },
      userId
    });
  }

  // Handle Audio modality (Speech vs Music)
  if (modality === "audio") {
    // Determine type: default to speech if it looks like a script, or if explicit
    const type = audio_type || (prompt.length > 50 ? "speech" : "music");

    if (type === "speech" && elevenLabsService.isElevenLabsEnabled()) {
      const output = await elevenLabsService.generateSpeech(prompt, adaptiveControls.voiceId);
      return saveGeneration({
        modality,
        prompt,
        output,
        reasoning: { tone: adaptiveControls.tone, type: "speech", model: "eleven-v2" },
        userId
      });
    }

    if (type === "music" && sunoService.isSunoEnabled()) {
      const result = await sunoService.generateMusic(prompt, {
        instrumental: adaptiveControls.instrumental ?? true
      });
      return saveGeneration({
        modality,
        prompt,
        output: result.output,
        reasoning: { tone: adaptiveControls.tone, type: "music", model: "suno-v3" },
        userId
      });
    }
  }

  const plan = await buildGenerationPlan({
    modality,
    prompt,
    controls: adaptiveControls,
    constraints,
    memory
  });
  const safeOutput = typeof plan?.output === "string" ? plan.output : "";
  return saveGeneration({
    modality,
    prompt,
    output: safeOutput,
    reasoning: plan.intent,
    crossModal: plan.crossModal,
    userId,
    adaptiveProfile
  });
};

module.exports = {
  generate
};
