const baseLog = (level, message, meta = {}) => {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  };
  const line = JSON.stringify(payload);
  if (level === "error" || level === "warn") {
    console.error(line);
    return;
  }
  console.log(line);
};

const logger = {
  info: (message, meta) => baseLog("info", message, meta),
  warn: (message, meta) => baseLog("warn", message, meta),
  error: (message, meta) => baseLog("error", message, meta)
};

module.exports = { logger };
