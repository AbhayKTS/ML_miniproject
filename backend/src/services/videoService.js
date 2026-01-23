const path = require("path");
const fs = require("fs/promises");
const { updateStore, getStore } = require("../data/store");
const { supabaseAdmin, isSupabaseEnabled } = require("./supabaseClient");
const { v4: uuid } = require("uuid");

const uploadsDir = path.join(process.cwd(), "data", "uploads");

const ensureUploadsDir = async () => {
  await fs.mkdir(uploadsDir, { recursive: true });
  return uploadsDir;
};

const createVideo = async ({ userId, filename, tempPath }) => {
  await ensureUploadsDir();
  const id = uuid();
  const storedPath = path.join(uploadsDir, `${id}-${filename}`);
  await fs.rename(tempPath, storedPath);

  const video = {
    id,
    userId,
    filename,
    sourcePath: storedPath,
    status: "uploaded",
    createdAt: new Date().toISOString()
  };

  await updateStore((store) => {
    store.videos.push(video);
    return store;
  });

  if (isSupabaseEnabled() && supabaseAdmin) {
    await supabaseAdmin.from("videos").insert({
      id: video.id,
      user_id: userId,
      filename: video.filename,
      source_path: video.sourcePath,
      status: video.status,
      created_at: video.createdAt
    });
  }

  return video;
};

const getVideo = async (videoId) => {
  const store = await getStore();
  return store.videos.find((video) => video.id === videoId);
};

const updateVideoStatus = async (videoId, status) => {
  await updateStore((store) => {
    const video = store.videos.find((entry) => entry.id === videoId);
    if (video) {
      video.status = status;
    }
    return store;
  });
};

module.exports = {
  createVideo,
  getVideo,
  updateVideoStatus,
  ensureUploadsDir
};
