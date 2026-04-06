const { logger } = require("../utils/logger");

const errorHandler = (err, req, res, _next) => {
  const status = Number(err?.statusCode) || 500;
  const safeMessage = status >= 500 ? "Unexpected server error" : (err.message || "Request failed");

  logger.error("request_failed", {
    status,
    method: req.method,
    path: req.originalUrl,
    message: err?.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err?.stack
  });

  return res.status(status).json({
    error: safeMessage,
    requestId: req.requestId || null
  });
};

module.exports = { errorHandler };
// Central error handler
const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;
  logger.error({ correlationId: req.correlationId, err }, 'unhandled_error');
  res.status(status).json({ error: err.message || 'Internal Server Error' });
};

module.exports = { errorHandler };
