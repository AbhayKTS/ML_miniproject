const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { buildGenerationPlan } = require('../src/services/creativeEngine');

const testImage = async () => {
  try {
    const plan = await buildGenerationPlan({
      modality: 'image',
      prompt: 'Test image prompt for smoke check',
      controls: { theme: 'test-theme', styleIntensity: 50 },
      constraints: [],
      memory: {}
    });
    console.log('IMAGE OK: output length', plan.output?.length || 0);
  } catch (err) {
    console.error('IMAGE ERROR:', err.message);
  }
};

const testAudio = async () => {
  try {
    const plan = await buildGenerationPlan({
      modality: 'audio',
      prompt: 'Test audio prompt for smoke check',
      controls: { mood: 'calm', tempo: 'moderate', instrumentation: 'synth' },
      constraints: [],
      memory: {}
    });
    console.log('AUDIO OK: output length', plan.output?.length || 0);
  } catch (err) {
    console.error('AUDIO ERROR:', err.message);
  }
};

(async () => {
  console.log('HUGGING_FACE_API_KEY present?', Boolean(process.env.HUGGING_FACE_API_KEY));
  console.log('JWT_SECRET present?', Boolean(process.env.JWT_SECRET || 'chhaya-dev-secret'));

  await testImage();
  await testAudio();
})();
