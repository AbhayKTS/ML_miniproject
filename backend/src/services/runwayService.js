const https = require("https");

const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;
const API_HOST = "api.runwayml.com";

const isRunwayEnabled = () => Boolean(RUNWAY_API_KEY);

const generateVideo = async (prompt, options = {}) => {
    if (!isRunwayEnabled()) {
        throw new Error("Runway API key not configured");
    }

    const data = JSON.stringify({
        taskType: "gen3a_text_to_video",
        input: {
            prompt,
            ...options
        }
    });

    const requestOptions = {
        hostname: API_HOST,
        port: 443,
        path: "/v1/tasks",
        method: "POST",
        headers: {
            "Authorization": `Bearer ${RUNWAY_API_KEY}`,
            "Content-Type": "application/json",
            "X-Runway-Version": "2024-03-06"
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
                        resolve(json);
                    } else {
                        console.error("Runway API error response:", json);
                        reject(new Error(json.message || `Runway API error: ${res.statusCode}`));
                    }
                } catch (e) {
                    reject(new Error("Failed to parse Runway API response"));
                }
            });
        });

        req.on("error", (e) => {
            console.error("Runway request error:", e);
            reject(e);
        });
        req.write(data);
        req.end();
    });
};

const getTaskStatus = async (taskId) => {
    if (!isRunwayEnabled()) {
        throw new Error("Runway API key not configured");
    }

    const requestOptions = {
        hostname: API_HOST,
        port: 443,
        path: `/v1/tasks/${taskId}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${RUNWAY_API_KEY}`
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
                        resolve(json);
                    } else {
                        reject(new Error(json.message || `Runway API error: ${res.statusCode}`));
                    }
                } catch (e) {
                    reject(new Error("Failed to parse Runway API response"));
                }
            });
        });

        req.on("error", reject);
        req.end();
    });
};

module.exports = {
    isRunwayEnabled,
    generateVideo,
    getTaskStatus
};
