const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.ENGINE_ACCESS_KEY;
const client = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const isEngineEnabled = () => Boolean(client);

const getProcessingModel = (modelName = "creative-v1") => {
  if (!client) {
    return null;
  }
  return client.getGenerativeModel({ model: modelName });
};

module.exports = {
  isEngineEnabled,
  getProcessingModel
};
