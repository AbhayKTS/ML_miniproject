// Stability AI image generation service
const axios = require('axios');
const { logger } = require('../utils/logger');

async function generateImage(prompt, opts = {}) {
  const response = await axios.post(
    'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    { text_prompts: [{ text: prompt }], cfg_scale: 7, steps: 30, ...opts },
    { headers: { Authorization: `Bearer ${process.env.STABILITY_API_KEY}` } }
  );
  logger.info('image_generated', { prompt: prompt.slice(0, 50) });
  return response.data.artifacts[0].base64;
}

module.exports = { generateImage };
