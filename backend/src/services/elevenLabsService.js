const https = require("https");

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const API_HOST = "api.elevenlabs.io";
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel

const isElevenLabsEnabled = () => Boolean(ELEVEN_LABS_API_KEY);

const generateSpeech = async (text, voiceId = DEFAULT_VOICE_ID, options = {}) => {
    if (!isElevenLabsEnabled()) {
        throw new Error("ElevenLabs API key not configured");
    }

    const data = JSON.stringify({
        text,
        model_id: options.model_id || "eleven_multilingual_v2",
        voice_settings: {
            stability: options.stability || 0.5,
            similarity_boost: options.similarity_boost || 0.75,
            ...options.voice_settings
        }
    });

    const requestOptions = {
        hostname: API_HOST,
        port: 443,
        path: `/v1/text-to-speech/${voiceId}`,
        method: "POST",
        headers: {
            "xi-api-key": ELEVEN_LABS_API_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg"
        }
    };

    return new Promise((resolve, reject) => {
        const chunks = [];
        const req = https.request(requestOptions, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                let errorBody = "";
                res.on("data", (chunk) => errorBody += chunk);
                res.on("end", () => {
                    try {
                        const json = JSON.parse(errorBody);
                        reject(new Error(json.detail?.message || `ElevenLabs API error: ${res.statusCode}`));
                    } catch (e) {
                        reject(new Error(`ElevenLabs API error: ${res.statusCode}`));
                    }
                });
                return;
            }

            res.on("data", (chunk) => chunks.push(chunk));
            res.on("end", () => {
                const buffer = Buffer.concat(chunks);
                // Return base64 for easy frontend consumption
                resolve(`data:audio/mpeg;base64,${buffer.toString("base64")}`);
            });
        });

        req.on("error", (e) => {
            console.error("ElevenLabs request error:", e);
            reject(e);
        });
        req.write(data);
        req.end();
    });
};

module.exports = {
    isElevenLabsEnabled,
    generateSpeech
};
