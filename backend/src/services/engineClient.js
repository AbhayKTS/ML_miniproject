const https = require("https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey =
  process.env.GEMINI_API_KEY ||
  process.env.ENGINE_ACCESS_KEY ||
  "AIzaSyA_p6NHiOpEBQkZlhBm3ZaV-2k5B9Ak9lk";
const client = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const isEngineEnabled = () => Boolean(client);

<<<<<<< HEAD
const getProcessingModel = (modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash-latest") => {
=======
const getProcessingModel = (modelName = "gemini-1.5-flash") => {
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4
  if (!client) {
    return null;
  }
  // Remove "models/" prefix if present because getGenerativeModel adds it implicitly
  const cleanName = modelName.replace("models/", "");
  return client.getGenerativeModel({ model: cleanName });
};

const generateGeminiText = (prompt, modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash-latest") => {
  if (!apiKey) {
    return Promise.resolve(null);
  }

  const data = JSON.stringify({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  });

  const requestOptions = {
    hostname: "generativelanguage.googleapis.com",
    port: 443,
    path: `/v1/models/${modelName}:generateContent?key=${apiKey}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      let body = "";
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
            resolve(typeof text === "string" ? text.trim() : null);
            return;
          }
          reject(new Error(json.error?.message || `Gemini API error: ${res.statusCode}`));
        } catch (error) {
          reject(new Error("Failed to parse Gemini API response"));
        }
      });
    });

    req.on("error", reject);
    req.write(data);
    req.end();
  });
};

module.exports = {
  isEngineEnabled,
  getProcessingModel,
  generateGeminiText
};
