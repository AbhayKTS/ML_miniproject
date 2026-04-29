const https = require("https");

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const API_HOST = "api.stability.ai";
const ENGINE_ID = "stable-diffusion-v1-6";

const isStabilityEnabled = () => Boolean(STABILITY_API_KEY);

const generateImage = async (prompt, options = {}) => {
    if (!isStabilityEnabled()) {
        throw new Error("Stability API key not configured");
    }

    const data = JSON.stringify({
        text_prompts: [
            {
                text: prompt,
                weight: 1
            }
        ],
        cfg_scale: options.cfg_scale || 7,
        height: options.height || 512,
        width: options.width || 512,
        samples: 1,
        steps: options.steps || 30,
    });

    const requestOptions = {
        hostname: API_HOST,
        port: 443,
        path: `/v1/generation/${ENGINE_ID}/text-to-image`,
        method: "POST",
        headers: {
            "Authorization": `Bearer ${STABILITY_API_KEY}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
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
                        // Stability returns an array of artifacts. 
                        // Most basic use case returns base64 in artifacts[0].base64
                        resolve(json);
                    } else {
                        console.error("Stability API error response:", json);
                        reject(new Error(json.message || `Stability API error: ${res.statusCode}`));
                    }
                } catch (e) {
                    reject(new Error("Failed to parse Stability API response"));
                }
            });
        });

        req.on("error", (e) => {
            console.error("Stability request error:", e);
            reject(e);
        });
        req.write(data);
        req.end();
    });
};

module.exports = {
    isStabilityEnabled,
    generateImage
};
