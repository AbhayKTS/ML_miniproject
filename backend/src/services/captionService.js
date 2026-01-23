const { updateStore } = require("../data/store");
const { v4: uuid } = require("uuid");
const { transcribeWithWhisper } = require("../workers/whisperTranscribe");

const generateCaptions = async ({ clip, style = "karaoke" }) => {
  const transcript = await transcribeWithWhisper(clip.outputPath);
  const caption = {
    id: uuid(),
    clipId: clip.id,
    style,
    transcript: transcript.text,
    wordTimestamps: transcript.words,
    createdAt: new Date().toISOString()
  };

  await updateStore((store) => {
    store.captions.push(caption);
    return store;
  });

  return caption;
};

module.exports = {
  generateCaptions
};
