const { v4: uuid } = require("uuid");
const { HfInference } = require("@huggingface/inference");

const analyzeIntent = ({ prompt, controls, memory }) => {
  const baseThemes = memory?.themes?.length ? memory.themes : ["mythic futurism"];
  const themes = controls?.theme
    ? [...new Set([controls.theme, ...baseThemes])]
    : baseThemes;

  return {
    id: uuid(),
    themes,
    tone: controls?.tone || controls?.mood || memory?.tone || "warm visionary",
    culturalContext: controls?.culturalContext || memory?.culturalContext || "coastal ritual",
    originality: controls?.originality ?? 70,
    complexity: controls?.complexity ?? 60,
    genre: controls?.genre,
    styleIntensity: controls?.styleIntensity,
    mood: controls?.mood,
    tempo: controls?.tempo,
    instrumentation: controls?.instrumentation,
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
    const userPrompt = intent.prompt || "write a short creative story";
    const systemContext = `You are Chhaya, an adaptive creative collaborator. Write in a ${intent.tone} style. Genre: ${intent.genre || "open"}. Themes: ${intent.themes.join(", ")}. Cultural Context: ${intent.culturalContext}. Constraints: ${intent.constraints.join(". ")}.`;
    const fullPrompt = `${systemContext}\n\nUser request: ${userPrompt}\n\nResponse:`;
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const url = `https://text.pollinations.ai/${encodedPrompt}`;
    console.log(`[Text] Calling Pollinations.ai text`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Pollinations text error: ${response.status}`);
    }
    return (await response.text()).trim();
  } 
  
  if (modality === "image") {
    const imagePrompt = `${intent.prompt}. Style: ${intent.tone}, ${intent.culturalContext} motifs, themes of ${intent.themes.join(", ")}.`;
    const encodedPrompt = encodeURIComponent(imagePrompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=512&nologo=true&seed=${Math.floor(Math.random() * 99999)}`;
    console.log(`[Image] Calling Pollinations.ai`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Pollinations.ai image error: ${response.status}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const base64 = buffer.toString("base64");
    return `data:image/jpeg;base64,${base64}`;
  }
  
  if (modality === "audio") {
    const audioText = intent.prompt || `A ${intent.tone} soundscape exploring ${intent.themes.join(", ")} with ${intent.instrumentation || "blended instrumentation"}.`;

    if (process.platform === "darwin") {
      // macOS dev — use native say + afconvert
      const { execSync } = require("child_process");
      const fs = require("fs");
      const os = require("os");
      const path = require("path");
      const tmpAiff = path.join(os.tmpdir(), `chhaya_${Date.now()}.aiff`);
      const tmpWav  = path.join(os.tmpdir(), `chhaya_${Date.now()}.wav`);
      console.log(`[Audio] Using macOS say → afconvert → WAV`);
      execSync(`say -o "${tmpAiff}" "${audioText.replace(/"/g, '\\"')}"`);
      execSync(`afconvert -f WAVE -d LEI16@22050 "${tmpAiff}" "${tmpWav}"`);
      const buffer = fs.readFileSync(tmpWav);
      fs.unlinkSync(tmpAiff);
      fs.unlinkSync(tmpWav);
      return `data:audio/wav;base64,${buffer.toString("base64")}`;
    } else {
      // Cloud Functions / Linux — use Google Translate TTS (no key needed)
      const encoded = encodeURIComponent(audioText.slice(0, 200)); // max 200 chars
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=en&client=tw-ob&ttsspeed=1`;
      console.log(`[Audio] Using Google Translate TTS (Cloud Functions)`);
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      if (!response.ok) throw new Error(`TTS error: ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      return `data:audio/mpeg;base64,${buffer.toString("base64")}`;
    }
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
