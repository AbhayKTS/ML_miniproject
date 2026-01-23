const path = require("path");
const fs = require("fs/promises");
const { updateStore } = require("../data/store");
const { v4: uuid } = require("uuid");
const { embedCaptions } = require("../workers/captionEmbedder");
const { cropAndResize } = require("../workers/cropper");

const exportsDir = path.join(process.cwd(), "data", "exports");

const ensureExportsDir = async () => {
  await fs.mkdir(exportsDir, { recursive: true });
  return exportsDir;
};

const exportClip = async ({ clip, captions, format, resolution, aspectRatio }) => {
  await ensureExportsDir();
  const exportId = uuid();
  const outputPath = path.join(exportsDir, `${exportId}.${format || "mp4"}`);

  const croppedPath = await cropAndResize(clip.outputPath, aspectRatio, resolution);
  await embedCaptions(croppedPath, outputPath, captions?.transcript || "");

  const exportRecord = {
    id: exportId,
    clipId: clip.id,
    format,
    resolution,
    aspectRatio,
    outputPath,
    status: "ready",
    createdAt: new Date().toISOString()
  };

  await updateStore((store) => {
    store.exports.push(exportRecord);
    return store;
  });

  return exportRecord;
};

module.exports = {
  exportClip
};
