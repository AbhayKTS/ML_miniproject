const fs = require("fs/promises");
const path = require("path");

const TEMP_DIR = path.resolve(__dirname, "../../data/temp");
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Remove temp files older than MAX_AGE_MS.
 * Intended to be called on a schedule or at startup.
 */
const cleanTempFiles = async () => {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
    const files = await fs.readdir(TEMP_DIR);
    const now = Date.now();
    let removed = 0;

    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      try {
        const stat = await fs.stat(filePath);
        if (now - stat.mtimeMs > MAX_AGE_MS) {
          await fs.unlink(filePath);
          removed++;
        }
      } catch {
        // skip files we can't stat
      }
    }

    if (removed > 0) {
      console.log(`[Cleanup] Removed ${removed} temp file(s) older than 24h`);
    }
  } catch (error) {
    console.error(`[Cleanup] Failed: ${error.message}`);
  }
};

module.exports = { cleanTempFiles, TEMP_DIR };
