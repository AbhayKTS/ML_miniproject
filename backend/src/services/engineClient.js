const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

// AI Provider configuration
const AI_PROVIDER = process.env.AI_PROVIDER || "gemini";

// Initialize clients based on available API keys
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.ENGINE_ACCESS_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;
const sambanovaApiKey = process.env.SAMBANOVA_API_KEY;

// Client instances
let geminiClient = null;
let openaiClient = null;
let sambanovaClient = null;

if (geminiApiKey) {
  geminiClient = new GoogleGenerativeAI(geminiApiKey);
  console.log("✓ Gemini AI initialized");
}

if (openaiApiKey) {
  openaiClient = new OpenAI({ apiKey: openaiApiKey });
  console.log("✓ OpenAI initialized");
}

if (sambanovaApiKey) {
  // SambaNova uses OpenAI-compatible API
  sambanovaClient = new OpenAI({
    apiKey: sambanovaApiKey,
    baseURL: "https://api.sambanova.ai/v1"
  });
  console.log("✓ SambaNova initialized");
}

const isEngineEnabled = () => {
  return Boolean(geminiClient || openaiClient || sambanovaClient);
};

const getActiveProvider = () => {
  if (AI_PROVIDER === "openai" && openaiClient) return "openai";
  if (AI_PROVIDER === "sambanova" && sambanovaClient) return "sambanova";
  if (geminiClient) return "gemini";
  if (openaiClient) return "openai";
  if (sambanovaClient) return "sambanova";
  return null;
};

// Gemini model getter
const getGeminiModel = (modelName = "gemini-1.5-flash") => {
  if (!geminiClient) return null;
  return geminiClient.getGenerativeModel({ model: modelName });
};

// OpenAI completion
const generateOpenAI = async (prompt, options = {}) => {
  if (!openaiClient) throw new Error("OpenAI client not initialized");
  
  const response = await openaiClient.chat.completions.create({
    model: options.model || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: options.maxTokens || 2048,
    temperature: options.temperature || 0.7
  });
  
  return response.choices[0].message.content;
};

// SambaNova completion
const generateSambaNova = async (prompt, options = {}) => {
  if (!sambanovaClient) throw new Error("SambaNova client not initialized");
  
  const response = await sambanovaClient.chat.completions.create({
    model: options.model || "Meta-Llama-3.1-8B-Instruct",
    messages: [{ role: "user", content: prompt }],
    max_tokens: options.maxTokens || 2048,
    temperature: options.temperature || 0.7
  });
  
  return response.choices[0].message.content;
};

// Gemini completion
const generateGemini = async (prompt, options = {}) => {
  const model = getGeminiModel(options.model);
  if (!model) throw new Error("Gemini client not initialized");
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Cascading fallback: Gemini → OpenAI → SambaNova
const generateWithFallback = async (prompt, options = {}) => {
  const errors = [];
  
  // Try Gemini first
  if (geminiClient) {
    try {
      console.log("🔄 Trying Gemini...");
      const result = await generateGemini(prompt, options);
      console.log("✓ Gemini succeeded");
      return { result, provider: "gemini" };
    } catch (error) {
      console.warn("✗ Gemini failed:", error.message);
      errors.push({ provider: "gemini", error: error.message });
    }
  }
  
  // Fallback to OpenAI
  if (openaiClient) {
    try {
      console.log("🔄 Falling back to OpenAI...");
      const result = await generateOpenAI(prompt, options);
      console.log("✓ OpenAI succeeded");
      return { result, provider: "openai" };
    } catch (error) {
      console.warn("✗ OpenAI failed:", error.message);
      errors.push({ provider: "openai", error: error.message });
    }
  }
  
  // Fallback to SambaNova
  if (sambanovaClient) {
    try {
      console.log("🔄 Falling back to SambaNova...");
      const result = await generateSambaNova(prompt, options);
      console.log("✓ SambaNova succeeded");
      return { result, provider: "sambanova" };
    } catch (error) {
      console.warn("✗ SambaNova failed:", error.message);
      errors.push({ provider: "sambanova", error: error.message });
    }
  }
  
  // All providers failed
  const errorSummary = errors.map(e => `${e.provider}: ${e.error}`).join("; ");
  throw new Error(`All AI providers failed. ${errorSummary || "No API keys configured."}`);
};

// Unified generate function - uses cascading fallback
const generate = async (prompt, options = {}) => {
  const { result } = await generateWithFallback(prompt, options);
  return result;
};

// Legacy support - returns Gemini model for backward compatibility
const getProcessingModel = (modelName = "gemini-1.5-flash") => {
  return getGeminiModel(modelName);
};

module.exports = {
  isEngineEnabled,
  getActiveProvider,
  getProcessingModel,
  getGeminiModel,
  generate,
  generateWithFallback,
  generateGemini,
  generateOpenAI,
  generateSambaNova,
  geminiClient,
  openaiClient,
  sambanovaClient
};
