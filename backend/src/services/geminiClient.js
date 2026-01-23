const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const client = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const isGeminiEnabled = () => Boolean(client);

const getModel = (modelName = "gemini-1.5-flash") => {
  if (!client) {
    return null;
  }
  return client.getGenerativeModel({ model: modelName });
};

module.exports = {
  isGeminiEnabled,
  getModel
};
