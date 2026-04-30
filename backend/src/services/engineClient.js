const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.ENGINE_ACCESS_KEY;
const client = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const isEngineEnabled = () => Boolean(client);

const getProcessingModel = (modelName = "gemini-1.5-flash") => {
  if (!client) {
    return null;
  }
  // Remove "models/" prefix if present because getGenerativeModel adds it implicitly
  const cleanName = modelName.replace("models/", "");
  return client.getGenerativeModel({ model: cleanName });
};

module.exports = {
  isEngineEnabled,
  getProcessingModel
};
