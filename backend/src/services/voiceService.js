// ElevenLabs TTS voice service
const axios = require('axios');
const { logger } = require('../utils/logger');

const BASE = 'https://api.elevenlabs.io/v1';
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

async function textToSpeech(text) {
  const { data } = await axios.post(
    `${BASE}/text-to-speech/${VOICE_ID}`,
    { text, model_id: 'eleven_multilingual_v2' },
    { headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY }, responseType: 'arraybuffer' }
  );
  logger.info('tts_generated', { chars: text.length });
  return Buffer.from(data);
}

module.exports = { textToSpeech };
